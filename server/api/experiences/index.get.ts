import { experiencesTable } from '#shared/schemas/experience'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDatabase()

  return db.select().from(experiencesTable).orderBy(
    desc(experiencesTable.startDate),
    desc(experiencesTable.endDate),
  )
})
