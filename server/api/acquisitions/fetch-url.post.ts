const MAX_CHARS = 12000

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const { url } = await readBody<{ url: string }>(event)

  if (!url) {
    throw createError({ statusCode: 400, statusMessage: 'URL required' })
  }

  try {
    const html = await $fetch<string>(url, {
      responseType: 'text',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portfolio-bot/1.0)' },
      timeout: 10000,
    })

    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, MAX_CHARS)

    return { content: text, truncated: html.length > MAX_CHARS }
  }
  catch (e) {
    throw createError({ statusCode: 422, statusMessage: `Failed to fetch URL: ${e instanceof Error ? e.message : 'unknown error'}` })
  }
})
