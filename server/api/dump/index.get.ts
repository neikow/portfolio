import { blogPostsTable } from '#shared/schemas/blogPost'
import { experiencesTable } from '#shared/schemas/experience'
import { galleryImagesTable } from '#shared/schemas/galleryImage'
import { labExperimentsTable } from '#shared/schemas/labExperiment'
import type { DataDump } from '#shared/types/dump'

export default defineEventHandler(async (event): Promise<DataDump> => {
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

  const db = useDatabase()

  const [blogPosts, experiences, labExperiments, galleryImages] = await Promise.all([
    db.select().from(blogPostsTable),
    db.select().from(experiencesTable),
    db.select().from(labExperimentsTable),
    db.select().from(galleryImagesTable),
  ])

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    blogPosts: blogPosts.map(p => ({
      title: p.title,
      description: p.description,
      tags: p.tags,
      content: p.content,
      coverImageUrl: p.coverImageUrl,
      slug: p.slug,
      published: p.published,
      publishedAt: p.publishedAt ?? null,
      createdAt: p.createdAt,
    })),
    experiences: experiences.map(e => ({
      name: e.name,
      role: e.role,
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate ?? null,
      company: e.company,
      companyUrl: e.companyUrl ?? null,
      logoUrl: e.logoUrl,
      technologies: e.technologies,
    })),
    labExperiments: labExperiments.map(l => ({
      name: l.name,
      url: l.url ?? null,
      repoUrl: l.repoUrl ?? null,
      pictures: l.pictures,
      tags: l.tags,
      description: l.description,
      createdAt: l.createdAt,
    })),
    galleryImages: galleryImages.map(g => ({
      filename: g.filename,
      uploadedAt: g.uploadedAt,
    })),
  }
})
