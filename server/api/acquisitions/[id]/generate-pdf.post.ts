import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { acquisitionsTable } from '#shared/schemas/acquisition'

const schema = z.object({
  templateType: z.enum(['eu', 'us']),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { success, data } = schema.safeParse(body)

  if (!success) throw createError({ statusCode: 400, statusMessage: 'templateType must be "eu" or "us"' })

  const db = useDatabase()
  const [acquisition] = await db.select().from(acquisitionsTable).where(eq(acquisitionsTable.id, id))

  if (!acquisition) throw createError({ statusCode: 404 })
  if (acquisition.type !== 'cv') throw createError({ statusCode: 400, statusMessage: 'PDF generation only available for CV type' })
  if (!acquisition.generatedContent) throw createError({ statusCode: 400, statusMessage: 'No generated content yet' })

  await db.update(acquisitionsTable)
    .set({ pdfStatus: 'pending', pdfTemplateType: data.templateType })
    .where(eq(acquisitionsTable.id, id))

  await usePdfQueue().add('generate-pdf', { acquisitionId: id, templateType: data.templateType }, {
    attempts: 2,
    backoff: { type: 'exponential', delay: 3000 },
  })

  return { success: true }
})
