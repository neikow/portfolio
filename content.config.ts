import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        published: z.boolean().default(false),
        datePublished: z.date(),
        dateEdited: z.date().optional(),
        image: z.string(),
        tags: z.coerce.string().array(),
        refs: z.object({
          text: z.string().optional(),
          url: z.string().url(),
        }).array(),
      }),
    }),
  },
})
