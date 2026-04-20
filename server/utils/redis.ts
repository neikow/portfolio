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

// Shared singleton for general server use (WS tokens, rate limiting)
let _shared: Redis | null = null

export function getSharedRedis(): Redis {
  if (!_shared || _shared.status === 'end' || _shared.status === 'close') {
    const { redisUrl } = useRuntimeConfig()
    _shared = new Redis(redisUrl || 'redis://localhost:6379', {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    })
  }
  return _shared
}
