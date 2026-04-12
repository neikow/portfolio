import { eq } from 'drizzle-orm'
import { acquisitionsTable } from '#shared/schemas/acquisition'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const db = useDatabase()
  await db.delete(acquisitionsTable).where(eq(acquisitionsTable.id, id))

  return { success: true }
})
