import { eq } from 'drizzle-orm'
import type { LabExperiment } from '#shared/schemas/labExperiment'
import { labExperimentsTable, labExperimentUpdateSchema } from '#shared/schemas/labExperiment'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required and must be a number' })
  }

  const { data, success, error } = await readValidatedBody(event, labExperimentUpdateSchema.safeParse)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request data', data: error })
  }

  await requireUserSession(event)
  const body = { ...data }

  const db = useDatabase()

  let experiment: LabExperiment | null = null
  let err: Error | null = null

  try {
    const [updatedExperiment] = await db.update(labExperimentsTable).set(body).where(
      eq(labExperimentsTable.id, Number(id)),
    ).returning()

    if (!updatedExperiment) {
      err = createError({ statusCode: 404, statusMessage: 'Experiment not found' })
    }
    else {
      experiment = updatedExperiment
    }
  }
  catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update experiment', data: e })
  }

  if (err) {
    throw err
  }

  if (!experiment) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update experiment' })
  }

  return { success: true, experiment }
})
