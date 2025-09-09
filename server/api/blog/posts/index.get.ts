import { blogPostsTable } from '~~/server/schemas'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDatabase()
  return db.select()
    .from(blogPostsTable)
    // .where(eq(blogPostsTable.published, true))
    .orderBy(desc(blogPostsTable.publishedAt))
})
