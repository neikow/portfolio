import type { SitemapUrlInput } from '#sitemap/types'
import { useDatabase } from '~~/server/utils/useDatabase'
import { blogPostsTable } from '#shared/schemas/blogPost'
import { eq } from 'drizzle-orm'

async function generateBlogUrls(): Promise<SitemapUrlInput[]> {
  const db = useDatabase()

  const posts = await db.select({
    title: blogPostsTable.title,
    slug: blogPostsTable.slug,
    updatedAt: blogPostsTable.editedAt,
    publishedAt: blogPostsTable.publishedAt,
    coverImageUrl: blogPostsTable.coverImageUrl,
    description: blogPostsTable.description,
  }).from(blogPostsTable)
    .where(eq(blogPostsTable.published, true))
    .orderBy(blogPostsTable.publishedAt)

  return posts.map(post => ({
    loc: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: (post.updatedAt ?? post.publishedAt) ?? new Date().toISOString(),
    news: {
      title: post.title,
      publication_date: post.publishedAt!,
      publication: {
        name: 'lysen.dev - Blog',
        language: 'en',
      },
    },
    images: [
      {
        loc: post.coverImageUrl,
        title: post.title,
        caption: post.description,
      },
    ],
  } satisfies SitemapUrlInput))
}

export default defineSitemapEventHandler(() => {
  return generateBlogUrls()
})
