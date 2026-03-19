import { blogPostsTable } from '#shared/schemas/blogPost'
import { and, eq } from 'drizzle-orm'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

type CachedOgMetadata = {
  expiresAt: number
}

type OgPayload = {
  site: string
  name: string
  buttonText: string
  showIcon: 'true' | 'false'
  description: string
}

export default defineEventHandler(async (event) => {
  const routePath = getRouterParam(event, 'path')
  const normalizedPath = routePath
    ?.split('/')
    .filter(Boolean)
    .join('/')
    .replace(/\.png$/i, '')

  if (!normalizedPath) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required',
    })
  }

  const storage = useStorage('ogImagesCache')
  const cacheKey = `${normalizedPath}.png`
  const metadataKey = `${cacheKey}.meta`

  const [cachedImage, metadata] = await Promise.all([
    storage.getItemRaw(cacheKey),
    storage.getItem<CachedOgMetadata>(metadataKey),
  ])

  const isCacheValid = Boolean(cachedImage && metadata && metadata.expiresAt > Date.now())

  setHeader(event, 'content-type', 'image/png')
  setHeader(event, 'cache-control', 'public, max-age=86400, s-maxage=86400')

  if (isCacheValid) {
    return cachedImage
  }

  const runtimeConfig = useRuntimeConfig(event)
  if (!runtimeConfig.ogApiToken || !runtimeConfig.ogTemplateUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OG image service is not configured',
    })
  }

  const payload = await resolveOgPayload(normalizedPath)
  const sourceUrl = buildSourceUrl(runtimeConfig.ogTemplateUrl, payload)

  const response = await fetch(sourceUrl, {
    headers: {
      authorization: `Bearer ${runtimeConfig.ogApiToken}`,
    },
  })

  if (!response.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to generate OG image',
    })
  }

  const arrayBuffer = await response.arrayBuffer()
  const imageBuffer = new Uint8Array(arrayBuffer)

  await Promise.all([
    storage.setItemRaw(cacheKey, imageBuffer),
    storage.setItem(metadataKey, { expiresAt: Date.now() + ONE_DAY_MS }),
  ])

  return imageBuffer
})

async function resolveOgPayload(path: string): Promise<OgPayload> {
  switch (path) {
    case 'home':
      return {
        site: 'lysen.dev',
        name: 'Vitaly Lysen',
        buttonText: 'Discover',
        showIcon: 'true',
        description: 'Software engineer building web applications, experiments, and writing about technology.',
      }
    case 'projects':
      return {
        site: 'lysen.dev/projects',
        name: 'Projects & Experience',
        buttonText: 'View projects',
        showIcon: 'true',
        description: 'Professional experience, software projects, and technical work by Vitaly Lysen.',
      }
    case 'lab':
      return {
        site: 'lysen.dev/lab',
        name: 'Lab Experiments',
        buttonText: 'Try experiments',
        showIcon: 'true',
        description: 'Interactive browser experiments and creative prototypes exploring modern web technologies.',
      }
    case 'blog':
      return {
        site: 'lysen.dev/blog',
        name: 'Blog',
        buttonText: 'Read posts',
        showIcon: 'true',
        description: 'Technical articles, tutorials, and engineering notes by Vitaly Lysen.',
      }
    default:
      break
  }

  if (path.startsWith('blog/')) {
    const slug = path.replace('blog/', '')
    const db = useDatabase()
    const [post] = await db.select()
      .from(blogPostsTable)
      .where(and(eq(blogPostsTable.slug, slug), eq(blogPostsTable.published, true)))

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found',
      })
    }

    return {
      site: 'lysen.dev/blog',
      name: post.title,
      buttonText: 'Read more',
      showIcon: 'true',
      description: post.description,
    }
  }

  throw createError({
    statusCode: 404,
    statusMessage: 'OG route not found',
  })
}

function buildSourceUrl(baseUrl: string, payload: OgPayload) {
  const url = new URL(baseUrl)
  for (const [key, value] of Object.entries(payload)) {
    url.searchParams.set(key, value)
  }
  return url.toString()
}
