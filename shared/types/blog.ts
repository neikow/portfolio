import { z } from 'zod'

export const newBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()).default([]),
  content: z.string().min(1, 'Content is required'),
  coverImageUrl: z.string(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  publishedAt: z.date().optional(),
  lastModifiedAt: z.date().optional(),
  timeEdited: z.date().optional(),
})

export type NewBlogPost = z.infer<typeof newBlogPostSchema>
