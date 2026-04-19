import { certificationUpdateSchema, certificationsTable } from '#shared/schemas/certification'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const { success, data, error } = certificationUpdateSchema.safeParse(body)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request data', data: error })
  }

  await requireUserSession(event)
  const db = useDatabase()

  try {
    const [certification] = await db
      .update(certificationsTable)
      .set(data)
      .where(eq(certificationsTable.id, id))
      .returning()

    return { success: true, certification }
  }
  catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update certification', data: e })
  }
})
