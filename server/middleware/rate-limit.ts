import { checkRateLimit } from '../utils/rateLimit'

const LIMITS: Array<{ pattern: RegExp, scope: string, limit: number, windowSecs: number }> = [
  { pattern: /^\/api\/auth\//, scope: 'auth', limit: 10, windowSecs: 600 },
  { pattern: /^\/api\/upload/, scope: 'upload', limit: 20, windowSecs: 60 },
  { pattern: /^\/api\/acquisitions\/fetch-url/, scope: 'fetch-url', limit: 15, windowSecs: 60 },
  { pattern: /^\/api\/acquisitions$/, scope: 'acquisitions', limit: 10, windowSecs: 60 },
  { pattern: /^\/_ws/, scope: 'ws', limit: 10, windowSecs: 60 },
]

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  const matched = LIMITS.find(l => l.pattern.test(path))
  if (matched) {
    await checkRateLimit(event, matched.scope, matched.limit, matched.windowSecs)
  }
})
