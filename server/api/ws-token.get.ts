import { getSharedRedis } from '../utils/redis'

const WS_TOKEN_TTL = 30 // seconds

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const token = crypto.randomUUID()
  const redis = getSharedRedis()
  await redis.set(`ws-token:${token}`, '1', 'EX', WS_TOKEN_TTL)

  return { token }
})
