import { useEffect, useState } from 'react'
import { getEtfNav } from '../api/stockApi'
import type { EtfNavData } from '../types/stock'

interface Props {
  symbol: string
  currentPrice?: number
  premium?: number | null
  fairValue?: number | null
  fairValueMethod?: string | null
}

export default function ETFPremium({ symbol, currentPrice, premium: propPremium, fairValue: propFairValue, fairValueMethod }: Props) {
  const [data, setData] = useState<EtfNavData | null>(null)
  const [loading, setLoading] = useState(true)

  const hasPrecomputed = propPremium != null && propFairValue != null

  useEffect(() => {
    if (hasPrecomputed) {
      setLoading(false)
      return
    }
    setLoading(true)
    getEtfNav(symbol).then((res) => {
      setData(res)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [symbol, hasPrecomputed])

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">折溢價</h2>
        <div className="h-[120px] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (hasPrecomputed) {
    const price = currentPrice ?? 0
    const isPositive = propPremium! >= 0
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">折溢價</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">合理價</div>
            <div className="text-lg font-semibold text-slate-200">{propFairValue!.toFixed(2)}</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">市價</div>
            <div className="text-lg font-semibold text-slate-200">{price > 0 ? price.toFixed(2) : 'N/A'}</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">折溢價率</div>
            <div className={`text-lg font-semibold ${isPositive ? 'text-red-400' : 'text-emerald-400'}`}>
              {propPremium! >= 0 ? '+' : ''}{propPremium!.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 text-center">
          {fairValueMethod === 'pe_based' ? '合理價依 EPS × 產業平均本益比估算' :
           fairValueMethod === 'pb_based' ? '合理價依每股淨值推算' :
           '合理價依基本面估算'}
        </div>
      </div>
    )
  }

  if (!data || (data.currentNAV == null && data.history.length === 0)) {
    return null
  }

  const nav = data.currentNAV ?? 0
  const price = currentPrice ?? data.currentPrice ?? 0
  const premium = data.premium
  const isPositive = premium != null && premium >= 0
  const color = premium != null ? (premium >= 0 ? '#f87171' : '#34d399') : '#64748b'

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">折溢價</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-400 mb-1">淨值 (NAV)</div>
          <div className="text-lg font-semibold text-slate-200">{nav > 0 ? nav.toFixed(2) : 'N/A'}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-400 mb-1">市價</div>
          <div className="text-lg font-semibold text-slate-200">{price > 0 ? price.toFixed(2) : 'N/A'}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-400 mb-1">折溢價率</div>
          <div className={`text-lg font-semibold ${premium != null ? (isPositive ? 'text-red-400' : 'text-emerald-400') : 'text-slate-200'}`}>
            {premium != null ? `${isPositive ? '+' : ''}${premium.toFixed(2)}%` : 'N/A'}
          </div>
        </div>
      </div>

      {data.history.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs border-b border-slate-700">
                <th className="text-left py-1 pr-3">日期</th>
                <th className="text-right py-1 pr-3">淨值</th>
                <th className="text-right py-1 pr-3">市價</th>
                <th className="text-right py-1">折溢價率</th>
              </tr>
            </thead>
            <tbody>
              {data.history.slice(-30).map((r) => {
                const p = r.premium ?? 0
                return (
                  <tr key={r.date} className="border-b border-slate-700/50">
                    <td className="py-1 pr-3 text-slate-300">{r.date}</td>
                    <td className="py-1 pr-3 text-right text-slate-300">{r.nav != null ? r.nav.toFixed(2) : '-'}</td>
                    <td className="py-1 pr-3 text-right text-slate-300">{r.price != null ? r.price.toFixed(2) : '-'}</td>
                    <td className={`py-1 text-right ${p >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {r.premium != null ? `${p >= 0 ? '+' : ''}${p.toFixed(2)}%` : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
