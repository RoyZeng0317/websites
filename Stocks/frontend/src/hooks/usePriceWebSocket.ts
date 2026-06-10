import { useEffect, useRef } from 'react'
import { createPriceWebSocket } from '../api/stockApi'
import type { RealtimePrice } from '../types/stock'

type Listener = (data: RealtimePrice) => void

interface SocketEntry {
  ws: WebSocket | null
  listeners: Set<Listener>
  reconnectTimer: ReturnType<typeof setTimeout> | null
}

// Module-level pool: one WebSocket per symbol, shared across all subscribers
const pool = new Map<string, SocketEntry>()

function connect(symbol: string): void {
  const entry = pool.get(symbol)
  if (!entry) return
  if (entry.ws?.readyState === WebSocket.OPEN || entry.ws?.readyState === WebSocket.CONNECTING) return

  const ws = createPriceWebSocket(symbol, (data) => {
    for (const fn of entry.listeners) fn(data)
  })

  ws.onerror = () => ws.close()
  ws.onclose = () => {
    entry.ws = null
    if (entry.listeners.size > 0) {
      entry.reconnectTimer = setTimeout(() => connect(symbol), 5000)
    }
  }

  entry.ws = ws
}

export function usePriceWebSocket(symbol: string, onPrice: Listener): void {
  const cbRef = useRef(onPrice)
  cbRef.current = onPrice

  useEffect(() => {
    const handler: Listener = (d) => cbRef.current(d)

    if (!pool.has(symbol)) {
      pool.set(symbol, { ws: null, listeners: new Set(), reconnectTimer: null })
    }
    const entry = pool.get(symbol)!
    entry.listeners.add(handler)
    connect(symbol)

    return () => {
      entry.listeners.delete(handler)
      if (entry.listeners.size === 0) {
        if (entry.reconnectTimer) clearTimeout(entry.reconnectTimer)
        entry.ws?.close()
        pool.delete(symbol)
      }
    }
  }, [symbol])
}
