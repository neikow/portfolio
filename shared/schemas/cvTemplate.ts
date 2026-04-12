import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const cvTemplatesTable = pgTable('cv_templates', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  type: text('type').notNull().unique(), // 'eu' | 'us'
  html: text('html').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).$onUpdate(() => new Date().toISOString()),
})

export type CvTemplate = typeof cvTemplatesTable.$inferSelect
