import { z } from 'zod'
import { acquisitionsTable } from '#shared/schemas/acquisition'

const createSchema = z.object({
  type: z.enum(['cv', 'cold-email']),
  tone: z.enum(['professional', 'casual', 'enthusiastic', 'concise']).default('professional'),
  inputContent: z.string().min(10, 'Please provide more context (at least 10 characters)'),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const body = await readBody(event)
  const { success, data, error } = createSchema.safeParse(body)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request data', data: error })
  }

  const db = useDatabase()

  const results = await db
    .insert(acquisitionsTable)
    .values({
      type: data.type,
      tone: data.tone,
      inputContent: data.inputContent,
      status: 'pending',
    })
    .returning()

  const acquisition = results[0]
  if (!acquisition) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create acquisition' })
  }

  // Trigger generation asynchronously (non-blocking)
  generateAcquisition(acquisition.id).catch(err =>
    console.error('[generation] error for id', acquisition.id, err),
  )

  return { success: true, acquisition }
})
