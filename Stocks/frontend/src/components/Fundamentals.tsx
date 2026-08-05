import type { StockInfo } from '../types/stock'
import { formatPercent, formatNumber } from '../api/stockApi'
import { TrendingUp, DollarSign, PieChart, BarChart3, Activity, Shield, Wallet } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine,
} from 'recharts'

interface Props {
  info: StockInfo
}

function fmt(v: number | null | undefined, decimals = 2): string {
  if (v == null) return 'N/A'
  return v.toFixed(decimals)
}

function pct(v: number | null | undefined): string {
  if (v == null) return 'N/A'
  return `${(v * 100).toFixed(2)}%`
}

const BAR_COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa']

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-emerald-400">{p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</p>
      ))}
    </div>
  )
}

function ProfitabilityChart({ info }: { info: StockInfo }) {
  const data = [
    { name: 'ROE', value: info.roe != null ? +(info.roe * 100).toFixed(2) : null },
    { name: 'ROA', value: info.roa != null ? +(info.roa * 100).toFixed(2) : null },
    { name: '利潤率', value: info.profitMargin != null ? +(info.profitMargin * 100).toFixed(2) : null },
    { name: '營業利益率', value: info.operatingMargin != null ? +(info.operatingMargin * 100).toFixed(2) : null },
  ].filter((d) => d.value != null)

  if (data.length === 0) return null

  return (
    <div className="bg-slate-800/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <BarChart3 size={18} />
        <h3 className="font-medium text-slate-200">獲利能力比較</h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} unit="%" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="百分比" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function ValuationChart({ info }: { info: StockInfo }) {
  const data = [
    { name: '本益比', value: info.peRatio },
    { name: '預估P/E', value: info.forwardPE },
    { name: '股價淨值比', value: info.priceToBook },
  ].filter((d): d is { name: string; value: number } => d.value != null)

  if (data.length === 0) return null

  return (
    <div className="bg-slate-800/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <TrendingUp size={18} />
        <h3 className="font-medium text-slate-200">估值指標比較</h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="倍數" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function Week52Chart({ info }: { info: StockInfo }) {
  const low = info.fiftyTwoWeekLow
  const high = info.fiftyTwoWeekHigh
  const current = info.currentPrice
  if (!low || !high || !current || low === high) return null

  const range = high - low
  const position = ((current - low) / range) * 100

  const data = [
    { name: '52週低', value: low },
    { name: '目前', value: current },
    { name: '52週高', value: high },
  ]

  return (
    <div className="bg-slate-800/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <Activity size={18} />
        <h3 className="font-medium text-slate-200">52週價格走勢</h3>
      </div>
      <div className="mb-3 flex justify-between text-xs text-slate-400">
        <span>低 {fmt(low)}</span>
        <span className="text-emerald-400 font-medium">目前 {fmt(current)} ({position.toFixed(0)}%)</span>
        <span>高 {fmt(high)}</span>
      </div>
      <div className="relative h-6 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${position}%`,
            background: `linear-gradient(90deg, #f87171 0%, #fbbf24 50%, #34d399 100%)`,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-emerald-400 shadow-lg"
          style={{ left: `calc(${position}% - 6px)` }}
        />
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={50} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="價格" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={i === 0 ? '#f87171' : i === 1 ? '#34d399' : '#60a5fa'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {info.fiftyTwoWeekChange != null && (
        <p className="text-xs text-slate-400 mt-2 text-center">
          52週變化: <span className={info.fiftyTwoWeekChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{pct(info.fiftyTwoWeekChange)}</span>
        </p>
      )}
    </div>
  )
}

export default function Fundamentals({ info }: Props) {
  const isETF = info.isETF === true || info.fundFamily != null || info.navPrice != null

  const cards = [
    ...(isETF ? [] : [{
      title: 'EPS (每股盈餘)',
      icon: <DollarSign size={18} />,
      items: [
        { label: 'EPS (TTM)', value: formatNumber(info.eps) },
        { label: '預估 EPS', value: formatNumber(info.forwardEps) },
      ],
    }]),
    {
      title: '殖利率與股利',
      icon: <PieChart size={18} />,
      items: [
        { label: '殖利率', value: info.dividendYield != null ? `${(info.dividendYield * 100).toFixed(2)}%` : 'N/A' },
        { label: '股利金額', value: info.dividendRate != null ? `$${info.dividendRate.toFixed(2)}` : 'N/A' },
        ...(isETF ? [] : [
          { label: '5年平均殖利率', value: info.fiveYearAvgDividendYield != null ? `${(info.fiveYearAvgDividendYield * 100).toFixed(2)}%` : 'N/A' },
          { label: '配息率', value: formatPercent(info.payoutRatio) },
        ] as { label: string; value: string }[]),
        { label: '除息日', value: info.exDividendDate ? new Date(info.exDividendDate).toLocaleDateString('zh-TW') : 'N/A' },
      ],
    },
    {
      title: '估值指標',
      icon: <TrendingUp size={18} />,
      items: [
        { label: '本益比 (P/E)', value: formatNumber(info.peRatio) },
        ...(isETF ? [] : [{ label: '預估 P/E', value: formatNumber(info.forwardPE) }] as { label: string; value: string }[]),
        { label: '股價淨值比 (P/B)', value: formatNumber(info.priceToBook) },
        ...(isETF ? [] : [
          { label: '每股淨值', value: formatNumber(info.bookValue) },
        ] as { label: string; value: string }[]),
        { label: 'β 值', value: formatNumber(info.beta) },
      ],
    },
    ...(isETF ? [] : [{
      title: '獲利能力',
      icon: <BarChart3 size={18} />,
      items: [
        { label: 'ROE (股東權益報酬率)', value: formatPercent(info.roe) },
        { label: 'ROA (資產報酬率)', value: formatPercent(info.roa) },
        { label: '利潤率', value: formatPercent(info.profitMargin) },
        { label: '營業利益率', value: formatPercent(info.operatingMargin) },
        { label: '營收', value: info.revenue != null ? `$${(info.revenue / 1e9).toFixed(2)}B` : 'N/A' },
      ],
    }] as { title: string; icon: JSX.Element; items: { label: string; value: string }[] }[]),
    {
      title: isETF ? 'ETF 表現' : '財務健康',
      icon: isETF ? <Activity size={18} /> : <Shield size={18} />,
      items: [
        ...(isETF ? [
          { label: '年初至今報酬', value: pct(info.ytdReturn) },
          { label: '3年平均報酬', value: pct(info.threeYearAverageReturn) },
          { label: '5年平均報酬', value: pct(info.fiveYearAverageReturn) },
        ] : [
          { label: '負債權益比', value: formatNumber(info.debtToEquity) },
        ] as { label: string; value: string }[]),
        { label: '52週高點', value: formatNumber(info.fiftyTwoWeekHigh) },
        { label: '52週低點', value: formatNumber(info.fiftyTwoWeekLow) },
        { label: '52週變化', value: formatPercent(info.fiftyTwoWeekChange) },
      ],
    },
    {
      title: isETF ? 'ETF 基本資料' : '交易資訊',
      icon: isETF ? <Wallet size={18} /> : <Activity size={18} />,
      items: [
        ...(isETF ? [
          { label: '基金規模', value: info.totalAssets != null ? `$${(info.totalAssets / 1e8).toFixed(0)} 億` : 'N/A' },
          { label: '淨值 (NAV)', value: fmt(info.navPrice) },
          { label: '費用率', value: info.annualReportExpenseRatio != null ? `${(info.annualReportExpenseRatio * 100).toFixed(2)}%` : 'N/A' },
          { label: '基金管理', value: info.fundFamily || 'N/A' },
          { label: '類別', value: info.category || 'N/A' },
        ] : [
          { label: '平均成交量', value: formatNumber(info.avgVolume) },
          { label: '營收/每股', value: formatNumber(info.revenuePerShare) },
        ] as { label: string; value: string }[]),
      ],
    },
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-200 mb-4">基本面分析</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              {card.icon}
              <h3 className="font-medium text-slate-200">{card.title}</h3>
            </div>
            <div className="space-y-3">
              {card.items.map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-sm font-medium text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!isETF && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <ProfitabilityChart info={info} />
          <ValuationChart info={info} />
          <Week52Chart info={info} />
        </div>
      )}
      {isETF && (
        <div className="grid grid-cols-1 gap-4 mt-4">
          <Week52Chart info={info} />
        </div>
      )}
    </div>
  )
}
