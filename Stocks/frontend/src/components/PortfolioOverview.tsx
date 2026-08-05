import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { Download, Landmark, RefreshCw, ShieldCheck } from 'lucide-react'
import { formatCurrency, getBatchPrices } from '../api/stockApi'
import { auth } from '../firebase'
import { getShareCount, loadHoldings, type HoldingDoc } from '../utils/holdings'
import { BANK_FEES, getFeeTier, feeMarkupRate } from '../data/bankFees'
import { getDefaultBank, setDefaultBank } from '../utils/feeSettings'

interface HoldingRow extends HoldingDoc {
  livePrice: number
}

function effectiveBuyPrice(item: HoldingDoc, bank: string): number {
  if (!bank || item.currency !== 'TWD') return item.buyPrice
  const tier = getFeeTier(bank, item.symbol.startsWith('00'), item.quantity % 1000 !== 0)
  return tier == null ? item.buyPrice : item.buyPrice * (1 + feeMarkupRate(tier))
}

function exportToCSV(items: HoldingRow[], bank: string) {
  const header = ['股票代號', '公司名稱', '買入價格', '股數', '現價', '成本', '市值', '損益', '損益率', '幣別']
  const rows = items.map((item) => {
    const shares = getShareCount(item)
    const cost = effectiveBuyPrice(item, bank) * shares
    const value = item.livePrice * shares
    const profit = value - cost
    return [item.symbol, `"${item.companyName}"`, item.buyPrice.toFixed(4), shares.toString(), item.livePrice.toFixed(4), cost.toFixed(2), value.toFixed(2), profit.toFixed(2), `${((cost > 0 ? profit / cost : 0) * 100).toFixed(2)}%`, item.currency || 'USD']
  })
  const url = URL.createObjectURL(new Blob(['﻿' + [header, ...rows].map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `portfolio_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function PortfolioOverview() {
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<HoldingRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bank, setBank] = useState(() => getDefaultBank())
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  useEffect(() => {
    let cancelled = false
    async function fetchPortfolio() {
      if (!user) { setItems([]); setError(''); setUpdatedAt(null); return }
      setLoading(true); setError('')
      try {
        const holdings = await loadHoldings(user.uid)
        if (cancelled) return
        if (!holdings.length) { setItems([]); setUpdatedAt(new Date()); return }
        const prices = await getBatchPrices([...new Set(holdings.map((holding) => holding.symbol))])
        if (!cancelled) {
          setItems(holdings.map((holding) => ({ ...holding, livePrice: prices[holding.symbol]?.price || holding.buyPrice })))
          setUpdatedAt(new Date())
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase()
          setError(message.includes('permission') || message.includes('firestore') ? 'Firestore 權限不足，請重新登入後再試。' : '讀取持股資料失敗，後端伺服器可能暫時無法連線，請稍後再試。')
          setItems([])
        }
      } finally { if (!cancelled) setLoading(false) }
    }
    fetchPortfolio()
    return () => { cancelled = true }
  }, [user])

  const totalsByCurrency = useMemo(() => Object.values(items.reduce<Record<string, { cost: number; value: number; currency: string }>>((all, item) => {
    const currency = item.currency || 'USD'
    const shares = getShareCount(item)
    const current = all[currency] || { cost: 0, value: 0, currency }
    current.cost += effectiveBuyPrice(item, bank) * shares
    current.value += item.livePrice * shares
    all[currency] = current
    return all
  }, {})), [items, bank])

  if (!user) return <SignedOutState />

  const totalShares = items.reduce((sum, item) => sum + getShareCount(item), 0)
  const stamp = updatedAt ? new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit' }).format(updatedAt) : '—'

  return (
    <section id="portfolio-overview" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/55 shadow-[0_24px_70px_rgba(2,6,23,0.32)]">
      <div className="border-b border-slate-800 bg-[linear-gradient(110deg,rgba(15,23,42,.98),rgba(20,42,51,.72))] px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> PORTFOLIO CONTROL</div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">資產控制台</h1>
            <p className="mt-1 text-sm text-slate-400">{user.email || user.uid} ・ 報價更新於 {stamp}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/45 px-3 py-2 text-xs text-slate-400">
              <Landmark size={14} className="text-slate-500" />
              <span>台股手續費</span>
              <select value={bank} onChange={(event) => { setBank(event.target.value); setDefaultBank(event.target.value) }} className="bg-transparent font-medium text-slate-200 outline-none">
                <option value="" className="bg-slate-900">不計算</option>
                {BANK_FEES.map((item) => <option key={item.bank} value={item.bank} className="bg-slate-900">{item.bank}</option>)}
              </select>
            </label>
            <button onClick={() => exportToCSV(items, bank)} type="button" disabled={!items.length} className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[.98]"><Download size={14} /> 匯出報表</button>
          </div>
        </div>
      </div>

      <div className="grid divide-y divide-slate-800 border-b border-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <SummaryMetric label="持有標的" value={`${items.length} 筆`} detail={`${totalShares.toLocaleString('en-US')} 股`} />
        <SummaryMetric label="資料狀態" value={loading ? '同步中' : '已同步'} detail={loading ? '正在更新即時報價' : '價格已載入'} accent={loading ? 'text-amber-300' : 'text-emerald-300'} />
        <SummaryMetric label="成本模型" value={bank || '未套用'} detail={bank ? '已含台股手續費估算' : '以原始買入成本計算'} />
      </div>

      <div className="p-5 sm:p-7">
        {loading ? <LoadingState /> : error ? <ErrorState message={error} /> : items.length === 0 ? <EmptyState /> : <>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-100">部位明細</h2><span className="text-xs text-slate-500">點選標的查看完整分析</span></div>
          <div className="mb-5 grid gap-3 lg:grid-cols-2">
            {totalsByCurrency.map((group) => <CurrencySummary key={group.currency} group={group} />)}
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-slate-950/65 text-[11px] font-medium uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">標的</th><th className="px-4 py-3 text-right">現價</th><th className="px-4 py-3 text-right">持有股數</th><th className="px-4 py-3 text-right">成本</th><th className="px-4 py-3 text-right">市值</th><th className="px-4 py-3 text-right">未實現損益</th></tr></thead>
              <tbody className="divide-y divide-slate-800/80">{items.map((item) => <HoldingTableRow key={item.id} item={item} bank={bank} />)}</tbody>
            </table>
          </div>
        </>}
      </div>
    </section>
  )
}

function SummaryMetric({ label, value, detail, accent = 'text-slate-100' }: { label: string; value: string; detail: string; accent?: string }) { return <div className="px-5 py-4 sm:px-6"><div className="text-xs text-slate-500">{label}</div><div className={`mt-1 text-lg font-semibold ${accent}`}>{value}</div><div className="mt-1 text-xs text-slate-500">{detail}</div></div> }
function CurrencySummary({ group }: { group: { cost: number; value: number; currency: string } }) { const profit = group.value - group.cost; const positive = profit >= 0; const ratio = group.cost ? profit / group.cost : 0; return <div className="rounded-xl border border-slate-800 bg-slate-950/35 p-4"><div className="flex items-start justify-between"><div><div className="text-xs text-slate-500">{group.currency} 未實現損益</div><div className={`mt-1 text-xl font-semibold ${positive ? 'text-red-400' : 'text-emerald-400'}`}>{positive ? '+' : ''}{formatCurrency(profit, group.currency)}</div></div><div className={`rounded-md px-2 py-1 text-xs font-semibold ${positive ? 'bg-red-400/10 text-red-300' : 'bg-emerald-400/10 text-emerald-300'}`}>{positive ? '+' : ''}{(ratio * 100).toFixed(2)}%</div></div><div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-3"><MiniMetric label="投入成本" value={formatCurrency(group.cost, group.currency)} /><MiniMetric label="總市值" value={formatCurrency(group.value, group.currency)} /></div></div> }
function MiniMetric({ label, value }: { label: string; value: string }) { return <div><div className="text-[11px] text-slate-500">{label}</div><div className="mt-1 text-sm font-medium text-slate-200">{value}</div></div> }
function HoldingTableRow({ item, bank }: { item: HoldingRow; bank: string }) { const shares = getShareCount(item); const adjusted = effectiveBuyPrice(item, bank); const cost = adjusted * shares; const value = item.livePrice * shares; const profit = value - cost; const positive = profit >= 0; const ratio = cost ? profit / cost : 0; return <tr className="group bg-slate-900/20 transition hover:bg-slate-800/55"><td className="px-4 py-4"><Link to={`/stock/${item.symbol}`} className="block"><div className="font-medium text-slate-100 group-hover:text-emerald-300">{item.companyName}</div><div className="mt-1 font-mono text-xs text-slate-500">{item.symbol}{adjusted !== item.buyPrice && ' ・ 含手續費'}</div></Link></td><td className="px-4 py-4 text-right font-medium text-slate-200">{formatCurrency(item.livePrice, item.currency)}</td><td className="px-4 py-4 text-right text-slate-300">{shares.toLocaleString('en-US')}</td><td className="px-4 py-4 text-right text-slate-400">{formatCurrency(cost, item.currency)}</td><td className="px-4 py-4 text-right font-medium text-slate-200">{formatCurrency(value, item.currency)}</td><td className={`px-4 py-4 text-right font-medium ${positive ? 'text-red-400' : 'text-emerald-400'}`}><div>{positive ? '+' : ''}{formatCurrency(profit, item.currency)}</div><div className="mt-1 text-xs opacity-80">{positive ? '+' : ''}{(ratio * 100).toFixed(2)}%</div></td></tr> }
function LoadingState() { return <div className="space-y-3" aria-label="讀取持股中"><div className="h-28 animate-pulse rounded-xl bg-slate-800/60" /><div className="h-56 animate-pulse rounded-xl bg-slate-800/40" /></div> }
function ErrorState({ message }: { message: string }) { return <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-5 py-8 text-center"><div className="text-sm font-medium text-rose-200">無法載入控制台</div><p className="mt-2 text-sm text-slate-400">{message}</p></div> }
function EmptyState() { return <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/25 px-6 py-12 text-center"><ShieldCheck size={24} className="mx-auto text-emerald-400" /><div className="mt-3 text-sm font-medium text-slate-200">尚未建立持股部位</div><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">前往個股頁輸入買入價格與股數後，系統會將你的部位與即時報價集中在這裡。</p></div> }
function SignedOutState() { return <section className="rounded-2xl border border-slate-800 bg-slate-900/55 px-6 py-12 text-center"><RefreshCw size={24} className="mx-auto text-emerald-400" /><h1 className="mt-3 text-xl font-semibold text-slate-100">登入以啟用資產控制台</h1><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">登入後即可跨裝置同步持股、追蹤即時報酬並匯出交易明細。</p></section> }
