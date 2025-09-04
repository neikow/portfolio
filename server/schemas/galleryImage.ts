import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const galleryImagesTable = sqliteTable('gallery_images', {
  id: integer('id').primaryKey(),
  filename: text('filename').notNull(),
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch()
                 )`),
})
