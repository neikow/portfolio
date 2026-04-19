import { cvTemplatesTable } from '#shared/schemas/cvTemplate'
import { EU_TEMPLATE, US_TEMPLATE } from '../../utils/defaultCvTemplates'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const db = useDatabase()
  const templates = await db.select().from(cvTemplatesTable)

  // Seed defaults if missing
  const result: { eu: string, us: string } = {
    eu: EU_TEMPLATE,
    us: US_TEMPLATE,
  }

  for (const t of templates) {
    if (t.type === 'eu' || t.type === 'us') result[t.type] = t.html
  }

  return result
})
