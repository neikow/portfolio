import { eq } from 'drizzle-orm'
import { marked } from 'marked'
import { chromium } from 'playwright-core'
import { cvTemplatesTable } from '#shared/schemas/cvTemplate'
import { acquisitionsTable } from '#shared/schemas/acquisition'
import { EU_TEMPLATE, US_TEMPLATE } from './defaultCvTemplates'

export async function generateAcquisitionPdf(acquisitionId: number, templateType: 'eu' | 'us'): Promise<void> {
  const db = useDatabase()

  await db.update(acquisitionsTable)
    .set({ pdfStatus: 'processing', pdfTemplateType: templateType })
    .where(eq(acquisitionsTable.id, acquisitionId))

  wsBroadcast(acquisitionId, { type: 'pdf-status', status: 'processing' })

  try {
    const [acquisition] = await db.select().from(acquisitionsTable).where(eq(acquisitionsTable.id, acquisitionId))
    if (!acquisition?.generatedContent) throw new Error('No generated content found')

    // Fetch or seed template
    let [template] = await db.select().from(cvTemplatesTable).where(eq(cvTemplatesTable.type, templateType))
    if (!template) {
      const defaultHtml = templateType === 'eu' ? EU_TEMPLATE : US_TEMPLATE
      ;[template] = await db.insert(cvTemplatesTable).values({ type: templateType, html: defaultHtml }).returning()
    }
    if (!template) throw new Error('Failed to load template')

    // markdown → HTML
    const contentHtml = marked.parse(acquisition.generatedContent, { async: false })
    const fullHtml = template.html.replace('{{content}}', contentHtml)

    // Playwright → PDF
    const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    const browser = await chromium.launch({
      ...(executablePath ? { executablePath } : {}),
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })

    const page = await browser.newPage()
    await page.setContent(fullHtml, { waitUntil: 'networkidle' })
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '15mm', right: '0', bottom: '15mm', left: '0' } })
    await browser.close()

    // Save to storage
    const storage = useStorage('commonUploads')
    const fileName = `cv-${acquisitionId}-${templateType}-${Date.now()}.pdf`
    await storage.setItemRaw(fileName, pdfBuffer)
    const pdfUrl = `/media/${fileName}`

    await db.update(acquisitionsTable)
      .set({ pdfStatus: 'done', pdfUrl, pdfTemplateType: templateType })
      .where(eq(acquisitionsTable.id, acquisitionId))

    wsBroadcast(acquisitionId, { type: 'pdf-done', pdfUrl })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await db.update(acquisitionsTable)
      .set({ pdfStatus: 'error' })
      .where(eq(acquisitionsTable.id, acquisitionId))
    wsBroadcast(acquisitionId, { type: 'pdf-error', message })
  }
}
