import { educationsTable } from '#shared/schemas/education'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDatabase()

  return db.select().from(educationsTable).orderBy(
    desc(educationsTable.startDate),
  )
})
