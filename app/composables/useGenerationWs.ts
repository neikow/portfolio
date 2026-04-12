export type WsEvent
  = | { type: 'subscribed', id: number }
    | { type: 'status', status: string }
    | { type: 'chunk', text: string }
    | { type: 'done', generatedContent: string }
    | { type: 'error', message: string }
    | { type: 'pdf-status', status: string }
    | { type: 'pdf-done', pdfUrl: string }
    | { type: 'pdf-error', message: string }

export function useGenerationWs(
  id: Ref<number | null>,
  onEvent: (event: WsEvent) => void,
) {
  let ws: WebSocket | null = null

  function connect() {
    if (!id.value) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${protocol}//${window.location.host}/_ws`

    ws = new WebSocket(url)

    ws.onopen = () => {
      ws!.send(JSON.stringify({ type: 'subscribe', id: id.value }))
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WsEvent
        onEvent(data)
      }
      catch {
        console.error('[ws] failed to parse message', event.data)
      }
    }

    ws.onclose = () => {
      ws = null
    }

    ws.onerror = (err) => {
      console.error('[ws] error', err)
    }
  }

  function disconnect() {
    ws?.close()
    ws = null
  }

  watch(id, (newId) => {
    disconnect()
    if (newId) connect()
  })

  onUnmounted(() => disconnect())

  return { connect, disconnect }
}
