import { educationUpdateSchema, educationsTable } from '#shared/schemas/education'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const { success, data, error } = educationUpdateSchema.safeParse(body)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request data', data: error })
  }

  await requireUserSession(event)
  const db = useDatabase()

  try {
    const [education] = await db
      .update(educationsTable)
      .set(data)
      .where(eq(educationsTable.id, id))
      .returning()

    return { success: true, education }
  }
  catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update education', data: e })
  }
})
