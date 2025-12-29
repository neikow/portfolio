import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

export const labExperimentsTable = pgTable('lab_experiments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  url: text('url'),
  repoUrl: text('repo_url'),
  pictures: text('pictures').array().notNull().default([]),
  tags: text('tags').array().notNull().default([]),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  editedAt: timestamp('edited_at', { mode: 'string' }).$onUpdate(() => new Date().toISOString()),
  description: text('description').notNull(),
})

export type LabExperiment = typeof labExperimentsTable.$inferSelect
export type LabExperimentInsert = typeof labExperimentsTable.$inferInsert

export const labExperimentInsertSchema = createInsertSchema(labExperimentsTable)
export const labExperimentUpdateSchema = createInsertSchema(labExperimentsTable)
