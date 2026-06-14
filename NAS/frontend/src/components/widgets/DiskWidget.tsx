import { useState, useEffect } from 'react'
import { apiJson } from '../../lib/api'
import DragWindow from './DragWindow'

interface SysInfo {
  hostname: string
  ip: string
  uptime: number
  memory: { total: number; free: number }
  disk: { total: number; used: number; free: number } | null
  disk1: { total: number; used: number; free: number } | null 
}

function fmtBytes(b: number): string {
  if (b >= 1099511627776) return `${(b / 1099511627776).toFixed(1)} TB`
  if (b >= 1073741824) return `${(b / 1073741824).toFixed(1)} GB`
  if (b >= 1048576) return `${(b / 1048576).toFixed(0)} MB`
  return `${Math.round(b / 1024)} KB`
}

function fmtUptime(sec: number): string {
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (d > 0) return `${d} 天 ${h} 時`
  if (h > 0) return `${h} 時 ${m} 分`
  return `${m} 分`
}

interface BarRowProps { label: string; used: number; total: number; color: string }
function BarRow({ label, used, total, color }: BarRowProps) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-500">{fmtBytes(used)} / {fmtBytes(total)}</span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-700 mt-0.5">{pct.toFixed(0)}%</div>
    </div>
  )
}

export default function DiskWidget({ onClose }: { onClose: () => void }) {
  const [info, setInfo] = useState<SysInfo | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const d = await apiJson<SysInfo>('/api/system/info')
        setInfo(d)
      } catch {}
    }
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [])

  const memUsed = info ? info.memory.total - info.memory.free : 0
  const memPct = info ? (memUsed / info.memory.total) * 100 : 0
  const diskPct = info?.disk ? (info.disk.used / info.disk.total) * 100 : 0
  const disk1Pct = info?.disk1 ? (info.disk1.used / info.disk1.total) * 100 : 0

  return (
    <DragWindow
      title="系統狀態"
      onClose={onClose}
      width={260}
      initialX={window.innerWidth - 280}
      initialY={310}
    >
      <div className="p-3 bg-gray-900 space-y-3">
        {info?.disk && (
          <BarRow
            label="磁碟空間"
            used={info.disk.used}
            total={info.disk.total}
            color={diskPct > 90 ? 'bg-red-400' : diskPct > 75 ? 'bg-yellow-400' : 'bg-orange-400'}
          />
        )}
        
        {info?.disk1 && (
          <BarRow
            label="sda1"
            used={info.disk1.used}
            total={info.disk1.total}
            color={disk1Pct > 90 ? 'bg-red-400' : disk1Pct > 75 ? 'bg-yellow-400' : 'bg-green-400'}
          />
        )}

        <BarRow
          label="記憶體"
          used={memUsed}
          total={info?.memory.total ?? 1}
          color={memPct > 90 ? 'bg-red-400' : memPct > 75 ? 'bg-yellow-400' : 'bg-blue-400'}
        />

        {info && (
          <div className="space-y-1 pt-1 border-t border-gray-800 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">主機名稱</span>
              <span className="text-gray-400 font-mono">{info.hostname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IP 位址</span>
              <span className="text-gray-400 font-mono">{info.ip}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">運行時間</span>
              <span className="text-gray-400">{fmtUptime(info.uptime)}</span>
            </div>
          </div>
        )}

        {!info && (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </DragWindow>
  )
}
