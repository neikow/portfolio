import { blogPostsTable } from '#shared/schemas/blogPost'
import { eq } from 'drizzle-orm'
import { contentConverter } from '#shared/utils/blog/contentConverter'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400, statusMessage: 'Invalid slug parameter',
    })
  }

  const db = useDatabase()

  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, slug))

  if (!post) {
    throw createError({
      statusCode: 404, statusMessage: 'Blog post not found',
    })
  }

  if (!import.meta.dev && !post.published) {
    await requireUserSession(event)
  }

  return { ...post, content: contentConverter(post.content) }
})
