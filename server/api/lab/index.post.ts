import { labExperimentInsertSchema, labExperimentsTable } from '#shared/schemas/labExperiment'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { success, data, error } = labExperimentInsertSchema.safeParse(body)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request data', data: error })
  }

  await requireUserSession(event)
  const db = useDatabase()

  try {
    const [experiment] = await db.insert(labExperimentsTable).values(data).returning()

    return { success: true, experiment }
  }
  catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create lab experiment', data: e })
  }
})
