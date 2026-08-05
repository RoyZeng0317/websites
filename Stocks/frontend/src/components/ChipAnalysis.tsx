import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MarginData {
  date: string
  marginBuy?: number
  marginSell?: number
  marginBalance?: number
  shortSell?: number
  shortBuyback?: number
  shortBalance?: number
}

interface InstData {
  date: string
  foreign: number
  trust: number
  dealer: number
}

interface Chips {
  symbol: string
  margin: MarginData[]
  institutional: InstData[]
}

interface Props { symbol: string }

function fmtNum(v: number | undefined): string {
  if (v == null) return '-'
  return v.toLocaleString()
}

function fmtDelta(v: number | undefined): string {
  if (v == null) return ''
  const sign = v >= 0 ? '+' : ''
  return `${sign}${v.toLocaleString()}`
}

function deltaColor(v: number | undefined): string {
  if (v == null) return 'text-slate-500'
  return v >= 0 ? 'text-emerald-400' : 'text-rose-400'
}

export default function ChipAnalysis({ symbol }: Props) {
  const [data, setData] = useState<Chips | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/stock/${symbol}/chips`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [symbol])

  if (loading) return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-3">籌碼面分析</h2>
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <div className="w-4 h-4 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        載入中...
      </div>
    </div>
  )

  if (!data || (!data.margin.length && !data.institutional.length)) return null

  const inst = data.institutional[0]
  const prevInst = data.institutional[1]
  const margin = data.margin[0]

  const totalInstFlow = inst ? inst.foreign + inst.trust + inst.dealer : 0
  const prevTotalInstFlow = prevInst ? prevInst.foreign + prevInst.trust + prevInst.dealer : 0
  const instTrend = totalInstFlow - prevTotalInstFlow

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={18} className="text-emerald-400" />
        <h2 className="text-lg font-semibold text-slate-200">籌碼面分析</h2>
      </div>

      {/* Institutional flow summary */}
      {inst && (
        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-2">三大法人買賣超（{inst.date}）</div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="bg-slate-900/50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-500 mb-1">外資</div>
              <div className={`text-sm font-medium ${deltaColor(inst.foreign)}`}>{fmtDelta(inst.foreign)}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-500 mb-1">投信</div>
              <div className={`text-sm font-medium ${deltaColor(inst.trust)}`}>{fmtDelta(inst.trust)}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-500 mb-1">自營商</div>
              <div className={`text-sm font-medium ${deltaColor(inst.dealer)}`}>{fmtDelta(inst.dealer)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-slate-900/50 rounded-lg px-3 py-2">
            <span className="text-xs text-slate-400">法人合計</span>
            <div className="flex items-center gap-2">
              {totalInstFlow >= 0 ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-rose-400" />}
              <span className={`text-sm font-medium ${deltaColor(totalInstFlow)}`}>{fmtDelta(totalInstFlow)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Margin trading */}
      {margin && (margin.marginBalance != null || margin.shortBalance != null) && (
        <div>
          <div className="text-xs text-slate-500 mb-2">融資融券餘額</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">融資餘額</div>
              <div className="text-sm font-medium text-slate-200">{fmtNum(margin.marginBalance)}</div>
              {margin.marginBuy != null && margin.marginSell != null && (
                <div className="text-xs text-slate-600 mt-1">
                  買 {fmtNum(margin.marginBuy)} / 賣 {fmtNum(margin.marginSell)}
                </div>
              )}
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-1">融券餘額</div>
              <div className="text-sm font-medium text-slate-200">{fmtNum(margin.shortBalance)}</div>
              {margin.shortSell != null && margin.shortBuyback != null && (
                <div className="text-xs text-slate-600 mt-1">
                  賣 {fmtNum(margin.shortSell)} / 回補 {fmtNum(margin.shortBuyback)}
                </div>
              )}
            </div>
          </div>
          {margin.marginBalance != null && margin.shortBalance != null && margin.shortBalance > 0 && (
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <Minus size={12} />
              資券比 {(margin.marginBalance / margin.shortBalance).toFixed(1)}
            </div>
          )}
        </div>
      )}

      {/* Historical institutional flow */}
      {data.institutional.length > 1 && (
        <div className="mt-4">
          <div className="text-xs text-slate-500 mb-2">法人買賣超歷史（近 {data.institutional.length} 日）</div>
          <div className="flex items-end gap-1 h-16">
            {data.institutional.slice(0, 10).reverse().map((d, i) => {
              const total = d.foreign + d.trust + d.dealer
              const maxAbs = Math.max(...data.institutional.slice(0, 10).map(x => Math.abs(x.foreign + x.trust + x.dealer)), 1)
              const h = Math.abs(total) / maxAbs * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded ${total >= 0 ? 'bg-emerald-500/60' : 'bg-rose-500/60'}`}
                    style={{ height: `${Math.max(h, 4)}%` }}
                  />
                  <div className="text-[9px] text-slate-600">{d.date.slice(4)}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-600 mt-3">資料來源：TWSE T86/MI_MARGN</p>
    </div>
  )
}
