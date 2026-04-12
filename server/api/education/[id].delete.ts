import { educationsTable } from '#shared/schemas/education'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  await requireUserSession(event)
  const db = useDatabase()

  await db.delete(educationsTable).where(eq(educationsTable.id, id))

  return { success: true }
})
