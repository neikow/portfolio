import type { Peer } from 'crossws'

const subscriptions = new Map<number, Set<Peer>>()

export function wsSubscribe(id: number, peer: Peer) {
  if (!subscriptions.has(id)) subscriptions.set(id, new Set())
  subscriptions.get(id)!.add(peer)
}

export function wsUnsubscribe(peer: Peer) {
  for (const peers of subscriptions.values()) {
    peers.delete(peer)
  }
}

export function wsBroadcast(id: number, data: object) {
  const peers = subscriptions.get(id)
  if (!peers) return
  const message = JSON.stringify(data)
  for (const peer of peers) {
    peer.send(message)
  }
}
