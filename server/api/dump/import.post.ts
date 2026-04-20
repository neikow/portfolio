import { timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import { blogPostsTable } from '#shared/schemas/blogPost'
import { certificationsTable } from '#shared/schemas/certification'
import { educationsTable } from '#shared/schemas/education'
import { experiencesTable } from '#shared/schemas/experience'
import { galleryImagesTable } from '#shared/schemas/galleryImage'
import { labExperimentsTable } from '#shared/schemas/labExperiment'

function safeTokenCompare(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a)
    const bb = Buffer.from(b)
    if (ba.length !== bb.length) return false
    return timingSafeEqual(ba, bb)
  }
  catch {
    return false
  }
}

const schoolProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.url().nullable(),
  repoUrl: z.url().nullable(),
  pdfUrl: z.url().nullable(),
  tags: z.array(z.string()),
})

const dumpSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  blogPosts: z.array(z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    content: z.string(),
    coverImageUrl: z.string(),
    slug: z.string(),
    published: z.boolean(),
    publishedAt: z.string().nullable(),
    createdAt: z.string(),
  })).optional().default([]),
  experiences: z.array(z.object({
    name: z.string(),
    role: z.string(),
    description: z.string(),
    startDate: z.string(),
    endDate: z.string().nullable(),
    company: z.string(),
    companyUrl: z.string().nullable(),
    logoUrl: z.string(),
    technologies: z.array(z.string()),
  })).optional().default([]),
  labExperiments: z.array(z.object({
    name: z.string(),
    url: z.string().nullable(),
    repoUrl: z.string().nullable(),
    pictures: z.array(z.string()),
    tags: z.array(z.string()),
    description: z.string(),
    createdAt: z.string(),
  })).optional().default([]),
  galleryImages: z.array(z.object({
    filename: z.string(),
    uploadedAt: z.string(),
  })).optional().default([]),
  educations: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    field: z.string(),
    description: z.string(),
    startDate: z.string(),
    endDate: z.string().nullable(),
    logoUrl: z.string(),
    websiteUrl: z.string().nullable(),
    schoolProjects: z.array(schoolProjectSchema),
  })).optional().default([]),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    issuerUrl: z.string().nullable(),
    logoUrl: z.string().nullable(),
    issuedAt: z.string(),
    expiresAt: z.string().nullable(),
    credentialUrl: z.string().nullable(),
    description: z.string().nullable(),
  })).optional().default([]),
})

type ImportResult = {
  blogPosts: number
  experiences: number
  labExperiments: number
  galleryImages: number
  educations: number
  certifications: number
}

export default defineEventHandler(async (event): Promise<ImportResult> => {
  const { dumpToken } = useRuntimeConfig()

  if (!dumpToken) {
    throw createError({ statusCode: 404 })
  }

  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''

  if (!token || !safeTokenCompare(token, dumpToken)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const rawBody = await readBody(event)
  const parsed = dumpSchema.safeParse(rawBody)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid dump format', data: parsed.error })
  }

  const body = parsed.data
  const db = useDatabase()

  const results: ImportResult = {
    blogPosts: 0,
    experiences: 0,
    labExperiments: 0,
    galleryImages: 0,
    educations: 0,
    certifications: 0,
  }

  if (body.blogPosts.length) {
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

  if (body.experiences.length) {
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

  if (body.labExperiments.length) {
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

  if (body.galleryImages.length) {
    const inserted = await db
      .insert(galleryImagesTable)
      .values(body.galleryImages.map(g => ({
        filename: g.filename,
        uploadedAt: g.uploadedAt,
      })))
      .returning({ id: galleryImagesTable.id })
    results.galleryImages = inserted.length
  }

  if (body.educations.length) {
    const inserted = await db
      .insert(educationsTable)
      .values(body.educations.map(e => ({
        school: e.school,
        degree: e.degree,
        field: e.field,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate ?? null,
        logoUrl: e.logoUrl,
        websiteUrl: e.websiteUrl ?? null,
        schoolProjects: e.schoolProjects,
      })))
      .returning({ id: educationsTable.id })
    results.educations = inserted.length
  }

  if (body.certifications.length) {
    const inserted = await db
      .insert(certificationsTable)
      .values(body.certifications.map(c => ({
        name: c.name,
        issuer: c.issuer,
        issuerUrl: c.issuerUrl ?? null,
        logoUrl: c.logoUrl ?? null,
        issuedAt: c.issuedAt,
        expiresAt: c.expiresAt ?? null,
        credentialUrl: c.credentialUrl ?? null,
        description: c.description ?? null,
      })))
      .returning({ id: certificationsTable.id })
    results.certifications = inserted.length
  }

  return results
})
