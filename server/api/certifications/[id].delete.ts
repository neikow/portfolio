import { certificationsTable } from '#shared/schemas/certification'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  await requireUserSession(event)
  const db = useDatabase()

  await db.delete(certificationsTable).where(eq(certificationsTable.id, id))

  return { success: true }
})
