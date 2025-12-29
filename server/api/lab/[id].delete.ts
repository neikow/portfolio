import { labExperimentsTable } from '#shared/schemas/labExperiment'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const db = useDatabase()

  await requireUserSession(event)

  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required and must be a number' })
  }

  const [experiment] = await db.delete(labExperimentsTable).where(eq(labExperimentsTable.id, Number(id))).returning()

  if (!experiment) {
    throw createError({ statusCode: 404, statusMessage: 'Experiment not found' })
  }

  return { success: true }
})
