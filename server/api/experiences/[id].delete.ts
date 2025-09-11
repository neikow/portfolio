import { experiencesTable } from '#shared/schemas/experience'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const db = useDatabase()

  await requireUserSession(event)

  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required and must be a number' })
  }

  const [experience] = await db.delete(experiencesTable).where(eq(experiencesTable.id, Number(id))).returning()

  if (!experience) {
    throw createError({ statusCode: 404, statusMessage: 'Experience not found' })
  }

  return { success: true }
})
