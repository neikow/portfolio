import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export const experiencesTable = pgTable('experiences', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  description: text('description').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  company: text('company').notNull(),
  companyUrl: text('company_url'),
  logoUrl: text('logo_url').notNull(),
})

export type ExperienceInsert = typeof experiencesTable.$inferInsert
export type Experience = typeof experiencesTable.$inferSelect

export const experienceInsertSchema = createInsertSchema(experiencesTable)
export const experienceUpdateSchema = createUpdateSchema(experiencesTable)
