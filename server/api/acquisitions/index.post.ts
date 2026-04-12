import { z } from 'zod'
import { acquisitionsTable } from '#shared/schemas/acquisition'
import { buildInputContentFromBlocks } from '#shared/types/acquisition-blocks'

const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), label: z.string(), content: z.string() }),
  z.object({ type: z.literal('url'), label: z.string(), url: z.string(), fetchedContent: z.string() }),
  z.object({ type: z.literal('file'), label: z.string(), fileUrl: z.string(), fileName: z.string() }),
])

const createSchema = z.object({
  type: z.enum(['cv', 'cold-email']),
  tone: z.enum(['professional', 'casual', 'enthusiastic', 'concise']).default('professional'),
  blocks: z.array(blockSchema).min(1, 'At least one block required'),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const body = await readBody(event)
  const { success, data, error } = createSchema.safeParse(body)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request data', data: error })
  }

  const inputContent = buildInputContentFromBlocks(data.blocks)

  if (inputContent.trim().length < 10) {
    throw createError({ statusCode: 400, statusMessage: 'Please provide more context in your blocks' })
  }

  const db = useDatabase()

  const results = await db
    .insert(acquisitionsTable)
    .values({
      type: data.type,
      tone: data.tone,
      inputContent,
      inputBlocks: data.blocks,
      status: 'pending',
    })
    .returning()

  const acquisition = results[0]
  if (!acquisition) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create acquisition' })
  }

  await useGenerationQueue().add('generate', { acquisitionId: acquisition.id }, {
    delay: 2000, // give client time to establish WS subscription before worker starts
    attempts: 2,
    backoff: { type: 'exponential', delay: 2000 },
  })

  return { success: true, acquisition }
})
