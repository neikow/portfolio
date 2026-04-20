import { getSharedRedis } from '../utils/redis'

export default defineWebSocketHandler({
  open(_peer) {},

  async message(peer, message) {
    try {
      const data = JSON.parse(message.text())

      if (data.type === 'subscribe' && typeof data.id === 'number') {
        const token = typeof data.token === 'string' ? data.token : ''
        if (!token) {
          peer.send(JSON.stringify({ type: 'error', message: 'Authentication required' }))
          peer.close()
          return
        }

        const redis = getSharedRedis()
        const valid = await redis.getdel(`ws-token:${token}`)

        if (!valid) {
          peer.send(JSON.stringify({ type: 'error', message: 'Invalid or expired token' }))
          peer.close()
          return
        }

        wsSubscribe(data.id, peer)
        peer.send(JSON.stringify({ type: 'subscribed', id: data.id }))
      }
    }
    catch {
      peer.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }))
    }
  },

  close(peer) {
    wsUnsubscribe(peer)
  },
})
