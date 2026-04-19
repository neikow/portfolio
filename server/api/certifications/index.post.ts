import { certificationInsertSchema, certificationsTable } from '#shared/schemas/certification'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { success, data, error } = certificationInsertSchema.safeParse(body)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request data', data: error })
  }

  await requireUserSession(event)
  const db = useDatabase()

  try {
    const [certification] = await db.insert(certificationsTable).values(data).returning()
    return { success: true, certification }
  }
  catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create certification', data: e })
  }
})
