export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] client connected', peer.id)
  },

  message(peer, message) {
    try {
      const data = JSON.parse(message.text())

      if (data.type === 'subscribe' && typeof data.id === 'number') {
        wsSubscribe(data.id, peer)
        peer.send(JSON.stringify({ type: 'subscribed', id: data.id }))
      }
    }
    catch {
      peer.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }))
    }
  },

  close(peer) {
    console.log('[ws] client disconnected', peer.id)
    wsUnsubscribe(peer)
  },
})
