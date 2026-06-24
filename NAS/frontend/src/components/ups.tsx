import { useState, useEffect, useCallback } from 'react'
import { apiJson } from '../lib/api'

interface UpsInfo {
  connected: boolean
  driver?: 'nut' | 'apcupsd'
  model?: string
  manufacturer?: string
  status?: string
  statusLabel?: string
  batteryPct?: number | null
  batteryVoltage?: number | null
  runtimeMin?: number | null
  loadPct?: number | null
  inputVoltage?: number | null
  outputVoltage?: number | null
  temperature?: number | null
}

interface Props { onClose: () => void }

function StatusBadge({ status }: { status: string }) {
  const online   = status.includes('OL') && !status.includes('OB')
  const onBatt   = status.includes('OB')
  const lowBatt  = status.includes('LB')
  const charging = status.includes('CHRG')

  let cls = 'bg-gray-500/20 text-gray-400', dot = 'bg-gray-400'
  if (lowBatt)          { cls = 'bg-red-500/20 text-red-400';     dot = 'bg-red-400 animate-pulse' }
  else if (onBatt)      { cls = 'bg-yellow-500/20 text-yellow-300'; dot = 'bg-yellow-400 animate-pulse' }
  else if (online || charging) { cls = 'bg-green-500/20 text-green-400'; dot = 'bg-green-400' }

  const label = lowBatt ? 'Low Battery' : onBatt ? 'On Battery' : online ? 'On AC' : charging ? 'Charging' : 'Unknown'

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

function BatteryBar({ pct }: { pct: number }) {
  const bar = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-400' : 'bg-red-500'
  const txt = pct > 50 ? 'text-green-400' : pct > 20 ? 'text-yellow-400' : 'text-red-400'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-gray-700/70 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${bar}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-sm font-bold tabular-nums w-10 text-right ${txt}`}>{pct.toFixed(0)}%</span>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gray-800/60 rounded-xl px-4 py-3">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-white tabular-nums">{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function UpsPanel({ onClose }: Props) {
  const [data, setData]     = useState<UpsInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setData(await apiJson<UpsInfo>('/api/system/ups'))
    } catch {
      setData({ connected: false })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const stats: { label: string; value: string; sub?: string }[] = []
  if (data?.runtimeMin  != null) stats.push({ label: 'Runtime Est.', value: `${data.runtimeMin} min` })
  if (data?.loadPct     != null) stats.push({ label: 'Load', value: `${data.loadPct.toFixed(0)}%` })
  if (data?.inputVoltage  != null) stats.push({ label: 'Input Voltage', value: `${data.inputVoltage.toFixed(1)} V` })
  if (data?.outputVoltage != null) stats.push({ label: 'Output Voltage', value: `${data.outputVoltage.toFixed(1)} V` })
  if (data?.batteryVoltage != null) stats.push({ label: 'Battery Voltage', value: `${data.batteryVoltage.toFixed(1)} V` })
  if (data?.temperature    != null) stats.push({ label: 'Temperature', value: `${data.temperature.toFixed(1)} °C` })

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
            </svg>
            <h2 className="text-base font-bold text-white">UPS System</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} disabled={loading}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-40">
              Refresh
            </button>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl transition-colors">
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-14">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : !data?.connected ? (
            <div className="flex flex-col items-center py-14 gap-3">
              <svg className="w-14 h-14 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
              </svg>
              <p className="text-sm text-gray-400 font-medium">No UPS detected</p>
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                Please ensure NUT (<code className="text-gray-500">upsd</code>) or apcupsd is installed on the Pi<br/>
                and a USB UPS is connected
              </p>
            </div>
          ) : (
            <>
              {/* Device */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{data.model || 'UPS Device'}</p>
                  {data.manufacturer && <p className="text-xs text-gray-500 mt-0.5">{data.manufacturer}</p>}
                </div>
                {data.status && <StatusBadge status={data.status} />}
              </div>

              {/* Battery */}
              {data.batteryPct != null && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Battery</p>
                  <BatteryBar pct={data.batteryPct} />
                </div>
              )}

              {/* Stats grid */}
              {stats.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {stats.map(s => <StatCard key={s.label} {...s} />)}
                </div>
              )}

              {/* Driver tag */}
              <p className="text-xs text-gray-600 text-right pt-1">
                Driver: {data.driver === 'nut' ? 'NUT (Network UPS Tools)' : 'apcupsd'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
