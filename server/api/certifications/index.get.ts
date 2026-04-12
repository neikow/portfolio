import { certificationsTable } from '#shared/schemas/certification'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDatabase()

  return db.select().from(certificationsTable).orderBy(
    desc(certificationsTable.issuedAt),
  )
})
