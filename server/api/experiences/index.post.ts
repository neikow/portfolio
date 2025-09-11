import { experienceInsertSchema, experiencesTable } from '#shared/schemas/experience'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { success, data, error } = experienceInsertSchema.safeParse(body)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request data', data: error })
  }

  await requireUserSession(event)
  const db = useDatabase()

  try {
    const [experience] = await db.insert(experiencesTable).values(data).returning()

    return { success: true, experience }
  }
  catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create experience', data: e })
  }
})
