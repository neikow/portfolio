import { resolve4, resolve6 } from 'node:dns/promises'

const MAX_CHARS = 12000

const PRIVATE_IP_RE
  = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|169\.254\.|0\.|100\.64\.|::1$|fc00:|fe80:|::ffff:(?:10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.))/i

async function isSafeUrl(raw: string): Promise<boolean> {
  let parsed: URL
  try {
    parsed = new URL(raw)
  }
  catch {
    return false
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false

  const { hostname } = parsed

  // Reject bare IPs that are private without needing DNS
  if (PRIVATE_IP_RE.test(hostname)) return false

  // Resolve DNS and check every returned IP
  try {
    const [v4, v6] = await Promise.allSettled([resolve4(hostname), resolve6(hostname)])
    const ips = [
      ...(v4.status === 'fulfilled' ? v4.value : []),
      ...(v6.status === 'fulfilled' ? v6.value : []),
    ]
    if (ips.length === 0) return false // can't resolve — block
    return !ips.some(ip => PRIVATE_IP_RE.test(ip))
  }
  catch {
    return false
  }
}

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const { url } = await readBody<{ url: string }>(event)

  if (!url) {
    throw createError({ statusCode: 400, statusMessage: 'URL required' })
  }

  if (!(await isSafeUrl(url))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or disallowed URL' })
  }

  try {
    const html = await $fetch<string>(url, {
      responseType: 'text',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portfolio-bot/1.0)' },
      timeout: 10000,
      redirect: 'error',
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
