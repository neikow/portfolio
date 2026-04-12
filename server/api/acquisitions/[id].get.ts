import { eq } from 'drizzle-orm'
import { acquisitionsTable } from '#shared/schemas/acquisition'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const db = useDatabase()
  const [acquisition] = await db
    .select()
    .from(acquisitionsTable)
    .where(eq(acquisitionsTable.id, id))

  if (!acquisition) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return acquisition
})
