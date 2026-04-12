import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export const certificationsTable = pgTable('certifications', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  issuer: text('issuer').notNull(),
  issuerUrl: text('issuer_url'),
  logoUrl: text('logo_url'),
  issuedAt: timestamp('issued_at', { mode: 'string' }).notNull(),
  expiresAt: timestamp('expires_at', { mode: 'string' }),
  credentialUrl: text('credential_url'),
  description: text('description'),
  editedAt: timestamp('edited_at', { mode: 'string' }).$onUpdate(() => new Date().toISOString()),
})

export type CertificationInsert = typeof certificationsTable.$inferInsert
export type Certification = typeof certificationsTable.$inferSelect

export const certificationInsertSchema = createInsertSchema(certificationsTable)
export const certificationUpdateSchema = createUpdateSchema(certificationsTable)
