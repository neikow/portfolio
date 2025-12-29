import { blogPostsTable } from '#shared/schemas/blogPost'
import { experiencesTable } from '#shared/schemas/experience'
import { desc, eq } from 'drizzle-orm'
import type { DashboardStats } from '#shared/types/stats'
import { labExperimentsTable } from '#shared/schemas/labExperiment'

export default defineEventHandler(async (event): Promise<DashboardStats> => {
  await requireUserSession(event)

  const db = useDatabase()

  const blogPostsCount = await db.$count(
    db.select().from(blogPostsTable).where(eq(blogPostsTable.published, true),
    ))
  const lastBlogPost = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.published, true))
    .orderBy(desc(blogPostsTable.publishedAt))
    .limit(1)
    .then(posts => posts[0] || null)
  const lastBlogPostDate = lastBlogPost ? lastBlogPost.publishedAt : null

  const blogDraftsCount = await db
    .$count(
      db.select().from(blogPostsTable).where(eq(blogPostsTable.published, false),
      ))

  const experiencesCount = await db.$count(experiencesTable)
  const experiences = await db
    .select()
    .from(experiencesTable)
    .orderBy(desc(experiencesTable.startDate))

  const totalExperienceYears = experiences.reduce((total, exp) => {
    const endDate = exp.endDate || new Date()
    const years = (new Date(endDate).getTime() - new Date(exp.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    return total + years
  }, 0)

  const labExperimentsCount = await db.$count(labExperimentsTable)
  const projectsCount = 0

  return {
    blogPostsCount,
    labExperimentsCount,
    projectsCount,
    lastBlogPostDate,
    blogDraftsCount,
    experiencesYears: totalExperienceYears,
    experiencesCount,
  }
})
