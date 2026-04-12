import { educationInsertSchema, educationsTable } from '#shared/schemas/education'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { success, data, error } = educationInsertSchema.safeParse(body)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request data', data: error })
  }

  await requireUserSession(event)
  const db = useDatabase()

  try {
    const [education] = await db.insert(educationsTable).values(data).returning()
    return { success: true, education }
  }
  catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create education', data: e })
  }
})
