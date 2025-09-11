import { galleryImagesTable } from '#shared/schemas/galleryImage'
import { desc } from 'drizzle-orm'
import { z } from 'zod'

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 20

export default defineEventHandler(async (event) => {
  const { success, data } = await getValidatedQuery(event, z.object({
    offset: z.coerce.number().min(0).default(DEFAULT_OFFSET),
    limit: z.coerce.number().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
  }).safeParse)

  if (!success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid query parameters' })
  }

  const db = useDatabase()
  return db.select()
    .from(galleryImagesTable)
    .orderBy(desc(galleryImagesTable.uploadedAt))
    .limit(data?.limit)
    .offset(data?.offset ?? DEFAULT_OFFSET)
})
