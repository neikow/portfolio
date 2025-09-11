import { blogPostsTable } from '#shared/schemas/blogPost'
import { and, desc, eq, type SQL } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id: string | undefined = query.id as string | undefined

  const db = useDatabase()

  const conditions: SQL[] = []

  const { user } = await getUserSession(event)

  if (!user) {
    conditions.push(eq(blogPostsTable.published, true))
  }

  if (id) {
    conditions.push(eq(blogPostsTable.id, Number(id)))
  }

  const q = db.select()
    .from(blogPostsTable)
    .where(and(...conditions))
    .orderBy(desc(blogPostsTable.publishedAt), desc(blogPostsTable.createdAt))

  return q
})
