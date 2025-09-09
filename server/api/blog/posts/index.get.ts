import {blogPostsTable} from "~~/server/schemas/blogPost";
import {desc} from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = useDatabase()
  return db.select()
    .from(blogPostsTable)
    // .where(eq(blogPostsTable.published, true))
    .orderBy(desc(blogPostsTable.publishedAt))
})