import { integer, json, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export type SchoolProject = {
  name: string
  description: string
  url: string | null
  repoUrl: string | null
  pdfUrl: string | null
  tags: string[]
}

export const educationsTable = pgTable('educations', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  school: text('school').notNull(),
  degree: text('degree').notNull(),
  field: text('field').notNull(),
  description: text('description').notNull().default(''),
  startDate: timestamp('start_date', { mode: 'string' }).notNull(),
  endDate: timestamp('end_date', { mode: 'string' }),
  logoUrl: text('logo_url').notNull().default(''),
  websiteUrl: text('website_url'),
  schoolProjects: json('school_projects').$type<SchoolProject[]>().notNull().default([]),
  editedAt: timestamp('edited_at', { mode: 'string' }).$onUpdate(() => new Date().toISOString()),
})

export type EducationInsert = typeof educationsTable.$inferInsert
export type Education = typeof educationsTable.$inferSelect

export const educationInsertSchema = createInsertSchema(educationsTable)
export const educationUpdateSchema = createUpdateSchema(educationsTable)
