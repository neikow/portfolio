import { type Experience, experiencesTable, experienceUpdateSchema } from '#shared/schemas/experience'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required and must be a number' })
  }

  const { data, success, error } = await readValidatedBody(event, experienceUpdateSchema.safeParse)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request data', data: error })
  }

  await requireUserSession(event)
  const body = { ...data }

  const db = useDatabase()

  let experience: Experience | null = null
  let err: Error | null = null

  try {
    const [updatedExperience] = await db.update(experiencesTable).set(body).where(
      eq(experiencesTable.id, Number(id)),
    ).returning()

    if (!updatedExperience) {
      err = createError({ statusCode: 404, statusMessage: 'Experience not found' })
    }
    else {
      experience = updatedExperience
    }
  }
  catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update experience', data: e })
  }

  if (err) {
    throw err
  }

  if (!experience) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update experience' })
  }

  return { success: true, experience }
})
