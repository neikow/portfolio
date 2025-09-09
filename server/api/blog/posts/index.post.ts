import { newBlogPostSchema } from '#shared/types/blog'
import { blogPostsTable } from '~~/server/schemas'

export default defineEventHandler(async (event) => {
  const { data, success, error } = await readValidatedBody(event, newBlogPostSchema.safeParse)
  await requireUserSession(event)
  if (!success) {
    throw createError({
      statusCode: 400, statusMessage: 'Invalid request data', data: error,
    })
  }

  const db = useDatabase()

  try {
    const [result] = await db.insert(blogPostsTable).values({
      title: data.title,
      description: data.description,
      tags: data.tags,
      content: data.content,
      coverImageUrl: data.coverImageUrl,
      slug: data.slug,
    }).returning()

    return { success: true, slug: result.slug }
  }
  catch (e) {
    if (e instanceof Error && e.message.includes('duplicate key value')) {
      throw createError({
        statusCode: 400, statusMessage: 'Slug already exists. Please choose a different slug.',
      })
    }
    throw createError({
      statusCode: 500, statusMessage: 'Error creating blog post',
    })
  }
})
