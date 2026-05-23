import type { StockInfo, RealtimePrice } from '../types/stock'
import { useEffect, useRef, useState } from 'react'
import { createPriceWebSocket } from '../api/stockApi'
import { Globe, Users, TrendingUp, DollarSign } from 'lucide-react'

interface Props {
  info: StockInfo
}

export default function StockHeader({ info }: Props) {
  const [rt, setRt] = useState<RealtimePrice | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    wsRef.current = createPriceWebSocket(info.symbol, (data) => {
      setRt(data)
    })
    return () => {
      wsRef.current?.close()
    }
  }, [info.symbol])

  const price = rt?.price ?? info.currentPrice
  const change = rt?.change ?? info.change
  const changePct = rt?.changePercent ?? info.changePercent
  const isTw = info.symbol.endsWith('.TW') || info.symbol.endsWith('.TWO')
  const isPositive = change >= 0
  const upColor = isTw ? 'text-red-400' : 'text-emerald-400'
  const downColor = isTw ? 'text-emerald-400' : 'text-red-400'
  const upBg = isTw ? 'bg-red-400/10' : 'bg-emerald-400/10'
  const downBg = isTw ? 'bg-emerald-400/10' : 'bg-red-400/10'
  const colorClass = isPositive ? upColor : downColor
  const bgClass = isPositive ? upBg : downBg

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-100">{info.nameCn || info.name}</h1>
              <span className="text-sm text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{info.symbol}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {info.exchange}
              </span>
            </div>
            {info.nameEn && info.nameEn !== (info.nameCn || info.name) && (
              <div className="text-xs text-slate-400 mt-0.5">{info.nameEn}</div>
            )}
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl font-bold text-slate-100">
              {price.toFixed(2)}
            </span>
            <span className="text-slate-400 text-sm">{info.currency}</span>
            <span className={`text-lg font-medium ${colorClass}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}
            </span>
            <span className={`text-sm px-2 py-0.5 rounded ${bgClass} ${colorClass}`}>
              {isPositive ? '+' : ''}{changePct.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox label="開盤" value={info.open.toFixed(2)} />
          <StatBox label="最高" value={info.dayHigh.toFixed(2)} />
          <StatBox label="最低" value={info.dayLow.toFixed(2)} />
          <StatBox label="昨日收盤" value={info.previousClose.toFixed(2)} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard icon={<TrendingUp size={16} />} label="市值" value={formatMarketCap(info.marketCap)} />
        <InfoCard icon={<Users size={16} />} label="成交量" value={formatVolume(info.volume)} />
        <InfoCard icon={<Globe size={16} />} label="產業" value={info.sector || 'N/A'} />
        <InfoCard icon={<DollarSign size={16} />} label="配息配股" value={info.dividendFrequency || 'N/A'} />
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-center">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-medium text-slate-200">{value}</div>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800/30 rounded-lg px-4 py-3">
      <div className="text-slate-400">{icon}</div>
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-medium text-slate-200">{value}</div>
      </div>
    </div>
  )
}

function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`
  return `$${(cap / 1e3).toFixed(1)}K`
}

function formatVolume(v: number): string {
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`
  return v.toLocaleString()
}
