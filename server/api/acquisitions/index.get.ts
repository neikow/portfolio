import { desc } from 'drizzle-orm'
import { acquisitionsTable } from '#shared/schemas/acquisition'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const db = useDatabase()

  const acquisitions = await db
    .select()
    .from(acquisitionsTable)
    .orderBy(desc(acquisitionsTable.createdAt))

  return acquisitions
})
