import { blogPostsTable } from '#shared/schemas/blogPost'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  await requireUserSession(event)

  const id = body.id

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required and must be a number',
    })
  }

  const db = useDatabase()

  delete body.id

  if (body.published !== undefined) {
    if (body.published) {
      body.publishedAt = new Date().toISOString()
    }
    else {
      body.publishedAt = null
    }
  }

  console.log(body)

  const [post] = await db.update(blogPostsTable)
    .set(body)
    .where(eq(blogPostsTable.id, Number(id)))
    .returning()

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found',
    })
  }

  return { post, success: true }
})
