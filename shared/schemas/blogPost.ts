import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const blogPostsTable = pgTable('blog_posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  tags: text('tags').array().notNull().default([]),
  content: text('content').notNull(),
  coverImageUrl: text('cover_image_url').notNull(),
  slug: text('slug').notNull().unique(),
  published: boolean('published').notNull().default(false),
  publishedAt: timestamp('time_published', { mode: 'string', withTimezone: true }),
  editedAt: timestamp('edited_at', { mode: 'string' }).$onUpdate(() => new Date().toISOString()),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
})
