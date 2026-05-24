import { useState, useEffect } from 'react'
import { getInstitutional } from '../api/stockApi'
import type { InstitutionalRecord } from '../types/stock'
import { Building2, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  symbol: string
}

function formatVol(v: number): string {
  const abs = Math.abs(v)
  if (abs >= 1e8) return `${(v / 1e8).toFixed(1)}億`
  if (abs >= 1e4) return `${(v / 1e4).toFixed(0)}萬`
  return v.toLocaleString('en-US')
}

function NetBadge({ value }: { value: number }) {
  if (value > 0) return <span className="text-red-400 flex items-center gap-0.5"><TrendingUp size={14} />+{formatVol(value)}</span>
  if (value < 0) return <span className="text-emerald-400 flex items-center gap-0.5"><TrendingDown size={14} />{formatVol(value)}</span>
  return <span className="text-slate-400 flex items-center gap-0.5"><Minus size={14} />0</span>
}

export default function InstitutionalInvestors({ symbol }: Props) {
  const [data, setData] = useState<InstitutionalRecord[] | null>(null)
  const [loading, setLoading] = useState(true)
  const isTW = symbol.endsWith('.TW') || symbol.endsWith('.TWO')

  useEffect(() => {
    if (!isTW) { setLoading(false); return }
    setLoading(true)
    setData(null)
    getInstitutional(symbol)
      .then((d) => { setData(d.data) })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [symbol, isTW])

  if (!isTW) return null
  if (loading) return null
  if (!data || data.length === 0) return null

  const latest = data[data.length - 1]
  const prev = data.length > 1 ? data[data.length - 2] : null

  const rows = [
    { label: '外資', buy: latest.foreignBuy, sell: latest.foreignSell, net: latest.foreignNet },
    { label: '投信', buy: latest.itBuy, sell: latest.itSell, net: latest.itNet },
    { label: '自營商', buy: latest.dealerBuy, sell: latest.dealerSell, net: latest.dealerNet },
  ]

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
        <Building2 size={18} />
        三大法人買賣超
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700/50">
              <th className="text-left py-2 pr-4">日期</th>
              <th className="text-right px-3 py-2">買進</th>
              <th className="text-right px-3 py-2">賣出</th>
              <th className="text-right px-3 py-2">買賣超</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-slate-200 border-b border-slate-700/30">
              <td className="py-2 pr-4 text-slate-400">{latest.date}</td>
              <td />
              <td />
              <td />
            </tr>
            {rows.map((r) => (
              <tr key={r.label} className="text-slate-300 border-b border-slate-700/20">
                <td className="py-1.5 pr-4 pl-2 text-slate-400">{r.label}</td>
                <td className="text-right px-3 py-1.5 text-slate-200">{formatVol(r.buy)}</td>
                <td className="text-right px-3 py-1.5 text-slate-200">{formatVol(r.sell)}</td>
                <td className="text-right px-3 py-1.5"><NetBadge value={r.net} /></td>
              </tr>
            ))}
            <tr className="text-slate-200 font-medium">
              <td className="py-2 pr-4 pl-2 text-slate-200">合計</td>
              <td className="text-right px-3 py-2">{formatVol(latest.totalBuy)}</td>
              <td className="text-right px-3 py-2">{formatVol(latest.totalSell)}</td>
              <td className="text-right px-3 py-2"><NetBadge value={latest.totalNet} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {prev && (
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <h3 className="text-xs text-slate-500 mb-2">近 2 日比較</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">前日合計</div>
              <div className="text-sm text-slate-200"><NetBadge value={prev.totalNet} /></div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">當日合計</div>
              <div className="text-sm text-slate-200"><NetBadge value={latest.totalNet} /></div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">變化</div>
              <div className="text-sm"><NetBadge value={latest.totalNet - prev.totalNet} /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
