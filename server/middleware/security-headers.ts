const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://analytics.lysen.dev",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://analytics.lysen.dev https://*.sentry.io wss: https:",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ')

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_nuxt/')) return

  setResponseHeaders(event, {
    'Content-Security-Policy': CSP,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    ...(process.env.NODE_ENV === 'production'
      ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload' }
      : {}),
  })
})
