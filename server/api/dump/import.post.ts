import { blogPostsTable } from '#shared/schemas/blogPost'
import { experiencesTable } from '#shared/schemas/experience'
import { galleryImagesTable } from '#shared/schemas/galleryImage'
import { labExperimentsTable } from '#shared/schemas/labExperiment'
import type { DataDump } from '#shared/types/dump'

type ImportResult = {
  blogPosts: number
  experiences: number
  labExperiments: number
  galleryImages: number
}

export default defineEventHandler(async (event): Promise<ImportResult> => {
  const { dumpToken } = useRuntimeConfig()

  if (!dumpToken) {
    throw createError({ statusCode: 404 })
  }

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : String(getQuery(event).token ?? '')

  if (!token || token !== dumpToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<DataDump>(event)
  const db = useDatabase()

  const results: ImportResult = {
    blogPosts: 0,
    experiences: 0,
    labExperiments: 0,
    galleryImages: 0,
  }

  if (body.blogPosts?.length) {
    const inserted = await db
      .insert(blogPostsTable)
      .values(body.blogPosts.map(p => ({
        title: p.title,
        description: p.description,
        tags: p.tags,
        content: p.content,
        coverImageUrl: p.coverImageUrl,
        slug: p.slug,
        published: p.published,
        publishedAt: p.publishedAt ?? null,
        createdAt: p.createdAt,
      })))
      .onConflictDoNothing({ target: blogPostsTable.slug })
      .returning({ slug: blogPostsTable.slug })
    results.blogPosts = inserted.length
  }

  if (body.experiences?.length) {
    const inserted = await db
      .insert(experiencesTable)
      .values(body.experiences.map(e => ({
        name: e.name,
        role: e.role,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate ?? null,
        company: e.company,
        companyUrl: e.companyUrl ?? null,
        logoUrl: e.logoUrl,
        technologies: e.technologies,
      })))
      .returning({ id: experiencesTable.id })
    results.experiences = inserted.length
  }

  if (body.labExperiments?.length) {
    const inserted = await db
      .insert(labExperimentsTable)
      .values(body.labExperiments.map(l => ({
        name: l.name,
        url: l.url ?? null,
        repoUrl: l.repoUrl ?? null,
        pictures: l.pictures,
        tags: l.tags,
        description: l.description,
        createdAt: l.createdAt,
      })))
      .returning({ id: labExperimentsTable.id })
    results.labExperiments = inserted.length
  }

  if (body.galleryImages?.length) {
    const inserted = await db
      .insert(galleryImagesTable)
      .values(body.galleryImages.map(g => ({
        filename: g.filename,
        uploadedAt: g.uploadedAt,
      })))
      .returning({ id: galleryImagesTable.id })
    results.galleryImages = inserted.length
  }

  return results
})
