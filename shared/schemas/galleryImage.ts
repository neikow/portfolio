import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const galleryImagesTable = pgTable('gallery_images', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  filename: text('filename').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
})
