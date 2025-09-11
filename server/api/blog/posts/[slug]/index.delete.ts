import { blogPostsTable } from '#shared/schemas/blogPost'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event)
  const slug = params.slug

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    })
  }

  await requireUserSession(event)

  const db = useDatabase()

  const rows = await db.delete(blogPostsTable)
    .where(eq(blogPostsTable.slug, slug))
    .returning()

  if (rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found',
    })
  }

  return { success: true }
})
