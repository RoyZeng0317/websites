import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getForex, type ForexData } from '../api/stockApi'

const date = (t: number) => new Date(t * 1000).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
export default function ForexMarkets() {
  const [pair, setPair] = useState('TWD/HKD')
  const [period, setPeriod] = useState('5d')
  const [data, setData] = useState<ForexData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    let timer: number
    setData(null); setLoading(true); setError('')
    async function refresh() {
      try {
        const next = await getForex(pair, period, controller.signal)
        if (!controller.signal.aborted) { setData(next); setError('') }
      } catch {
        if (!controller.signal.aborted) setError('無法更新匯率；已有資料僅供歷史參考。請重試。')
      } finally {
        if (!controller.signal.aborted) { setLoading(false); timer = window.setTimeout(refresh, 60_000) }
      }
    }
    refresh()
    return () => { controller.abort(); window.clearTimeout(timer) }
  }, [pair, period, retry])
  const points = data?.points ?? []
  const first = points[0]?.rate
  const last = points[points.length - 1]?.rate
  const change = first && last ? (last / first - 1) * 100 : null
  const stale = data?.asOf && data.fetchedAt - data.asOf > (period === '5d' ? 1800 : 259200)
  return <section className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5 space-y-4">
    <h2 className="text-base font-semibold text-slate-100">外幣匯率與趨勢</h2>
    <div className="flex flex-wrap gap-3">
      <select aria-label="貨幣對" className="bg-slate-800 rounded p-2" value={pair} onChange={e => setPair(e.target.value)}>
        {['TWD/HKD', 'USD/HKD', 'TWD/USD', 'HKD/TWD', 'HKD/USD', 'USD/TWD'].map(p => <option key={p}>{p}</option>)}
      </select>
      <button type="button" onClick={() => setPair(pair.split('/').reverse().join('/'))}>⇄ 反向</button>
      <select aria-label="趨勢期間" className="bg-slate-800 rounded p-2" value={period} onChange={e => setPeriod(e.target.value)}>
        <option value="5d">近五交易日（五分鐘）</option><option value="1mo">近一月（日資料）</option><option value="1y">近一年（日資料）</option>
      </select>
    </div>
    <p className="text-xs text-slate-400">市場參考匯率，非銀行買賣價。每分鐘查詢；供應延遲未知，不保證逐筆即時。</p>
    {loading && <p role="status">匯率載入中…</p>}
    {error && <p role="alert" className="text-amber-400">{error} <button type="button" onClick={() => setRetry(v => v + 1)}>重試</button></p>}
    {!loading && data && !points.length && <p>此期間無可對齊的匯率資料，請切換期間。</p>}
    {last != null && <p className="text-xl">1 {pair.split('/')[0]} = {last.toFixed(6)} {pair.split('/')[1]}
      <span className={`ml-3 text-sm ${change != null && change >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{change == null ? '漲跌無資料' : `${change >= 0 ? '▲' : '▼'} ${change.toFixed(3)}%（相較區間首筆）`}</span></p>}
    {points.length > 1 && <div className="h-64" role="img" aria-label={`${pair}匯率歷史趨勢`}><ResponsiveContainer width="100%" height="100%">
      <LineChart data={points}><XAxis dataKey="timestamp" type="number" domain={['dataMin', 'dataMax']} tickFormatter={t => new Date(t * 1000).toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' })} />
        <YAxis domain={['auto', 'auto']} width={85} tickFormatter={v => Number(v).toFixed(4)} /><Tooltip labelFormatter={v => date(Number(v))} />
        <Line type="linear" dataKey="rate" name="匯率" stroke="#34d399" dot={false} isAnimationActive={false} />
      </LineChart></ResponsiveContainer></div>}
    {data && <div className="text-xs text-slate-400 space-y-1">
      <p>{data.source} · {data.interval === '5m' ? '五分鐘歷史資料' : '日歷史資料'}</p>
      <p>資料時間（台北）：{data.asOf ? date(data.asOf) : '無資料'}；查詢時間：{date(data.fetchedAt)}</p>
      {stale && <p className="text-amber-400">資料較舊／可能休市，來源未提供可驗證的市場狀態。</p>}
    </div>}
  </section>
}
