import { Redis } from 'ioredis'

// BullMQ requires separate connections per Queue/Worker — use factory
export function createRedisConnection(): Redis {
  const { redisUrl } = useRuntimeConfig()
  return new Redis(redisUrl || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  })
}
