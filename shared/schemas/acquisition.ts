import { integer, json, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import type { InputBlock } from '#shared/types/acquisition-blocks'

export const acquisitionTypeEnum = pgEnum('acquisition_type', ['cv', 'cold-email'])
export const acquisitionStatusEnum = pgEnum('acquisition_status', ['pending', 'processing', 'done', 'error'])
export const acquisitionToneEnum = pgEnum('acquisition_tone', ['professional', 'casual', 'enthusiastic', 'concise'])

export const acquisitionsTable = pgTable('acquisitions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  type: acquisitionTypeEnum('type').notNull(),
  status: acquisitionStatusEnum('status').notNull().default('pending'),
  tone: acquisitionToneEnum('tone').notNull().default('professional'),
  language: text('language'),
  inputContent: text('input_content').notNull(),
  inputBlocks: json('input_blocks').$type<InputBlock[]>(),
  generatedContent: text('generated_content'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).$onUpdate(() => new Date().toISOString()),
})

export type AcquisitionInsert = typeof acquisitionsTable.$inferInsert
export type Acquisition = typeof acquisitionsTable.$inferSelect

export const acquisitionInsertSchema = createInsertSchema(acquisitionsTable)
