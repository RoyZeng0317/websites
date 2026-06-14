import { useState, useEffect } from 'react'
import { apiJson } from '../../lib/api'
import DragWindow from './DragWindow'

interface NetData {
  totalRx: number
  totalTx: number
  interfaces: Record<string, { rx: number; tx: number }>
}

function fmt(bps: number): string {
  if (bps >= 1e9) return `${(bps / 1e9).toFixed(2)} GB/s`
  if (bps >= 1e6) return `${(bps / 1e6).toFixed(1)} MB/s`
  if (bps >= 1e3) return `${(bps / 1e3).toFixed(0)} KB/s`
  return `${Math.round(bps)} B/s`
}

export default function NetworkWidget({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<NetData | null>(null)
  const [rxHist, setRxHist] = useState<number[]>([])
  const [txHist, setTxHist] = useState<number[]>([])

  useEffect(() => {
    async function poll() {
      try {
        const d = await apiJson<NetData>('/api/system/network')
        setData(d)
        setRxHist(prev => [...prev.slice(-30), d.totalRx])
        setTxHist(prev => [...prev.slice(-30), d.totalTx])
      } catch {}
    }
    poll()
    const id = setInterval(poll, 1000)
    return () => clearInterval(id)
  }, [])

  const maxSpeed = Math.max(...rxHist, ...txHist, 1024)
  const ifaces = data ? Object.entries(data.interfaces) : []

  return (
    <DragWindow
      title="網路速度"
      onClose={onClose}
      width={260}
      initialX={window.innerWidth - 280}
      initialY={80}
    >
      <div className="p-3 bg-gray-900 space-y-2">
        {/* Speed cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <div className="text-xs text-blue-400 mb-0.5">↓ 下載</div>
            <div className="text-sm font-mono text-blue-300">{fmt(data?.totalRx ?? 0)}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <div className="text-xs text-orange-400 mb-0.5">↑ 上傳</div>
            <div className="text-sm font-mono text-orange-300">{fmt(data?.totalTx ?? 0)}</div>
          </div>
        </div>

        {/* Sparkline chart */}
        <div className="h-14 flex items-end gap-px bg-gray-800 rounded-lg overflow-hidden px-1 pb-1 pt-1">
          {Array.from({ length: 30 }, (_, i) => {
            const rx = rxHist[i] ?? 0
            const tx = txHist[i] ?? 0
            return (
              <div key={i} className="flex-1 flex flex-col-reverse gap-px h-full items-stretch">
                <div
                  className="bg-blue-500/70 rounded-sm"
                  style={{ height: `${Math.round((rx / maxSpeed) * 44)}px`, minHeight: rx > 0 ? '1px' : '0' }}
                />
                <div
                  className="bg-orange-500/70 rounded-sm"
                  style={{ height: `${Math.round((tx / maxSpeed) * 44)}px`, minHeight: tx > 0 ? '1px' : '0' }}
                />
              </div>
            )
          })}
        </div>

        {/* Interface breakdown */}
        {ifaces.length > 0 && (
          <div className="space-y-0.5">
            {ifaces.map(([iface, vals]) => (
              <div key={iface} className="flex items-center text-xs gap-1">
                <span className="font-mono text-gray-600 w-14 truncate">{iface}</span>
                <span className="text-blue-400 flex-1 text-right">{fmt(vals.rx)}</span>
                <span className="text-gray-700 px-0.5">/</span>
                <span className="text-orange-400 flex-1">{fmt(vals.tx)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DragWindow>
  )
}
