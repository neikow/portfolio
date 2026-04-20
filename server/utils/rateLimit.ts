import type { H3Event } from 'h3'
import { getSharedRedis } from './redis'

function getClientIp(event: H3Event): string {
  return (
    getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    ?? getHeader(event, 'x-real-ip')
    ?? event.node.req.socket?.remoteAddress
    ?? 'unknown'
  )
}

export async function checkRateLimit(
  event: H3Event,
  scope: string,
  limit: number,
  windowSecs: number,
): Promise<void> {
  const ip = getClientIp(event)
  const key = `rl:${scope}:${ip}`
  const redis = getSharedRedis()
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, windowSecs)
  if (count > limit) {
    throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' })
  }
}
