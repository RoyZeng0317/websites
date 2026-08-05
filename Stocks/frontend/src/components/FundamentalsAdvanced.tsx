import type { StockInfo } from '../types/stock'
import { formatNumber } from '../api/stockApi'
import { Shield, TrendingDown, BarChart3, DollarSign, Activity, AlertTriangle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'

interface Props { info: StockInfo }

function fmt(v: number | null | undefined, d = 2): string {
  if (v == null) return 'N/A'
  return v.toFixed(d)
}
function pct(v: number | null | undefined): string {
  if (v == null) return 'N/A'
  return `${(v * 100).toFixed(2)}%`
}
function money(v: number | null | undefined): string {
  if (v == null) return 'N/A'
  if (Math.abs(v) >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (Math.abs(v) >= 1e8) return `$${(v / 1e8).toFixed(0)}億`
  if (Math.abs(v) >= 1e4) return `$${(v / 1e4).toFixed(0)}萬`
  return `$${v.toLocaleString()}`
}

function healthColor(v: number | null | undefined, good: number, warn: number, lower = false): string {
  if (v == null) return 'text-slate-400'
  if (lower ? v <= good : v >= good) return 'text-emerald-400'
  if (lower ? v <= warn : v >= warn) return 'text-yellow-400'
  return 'text-rose-400'
}

function healthBarColor(v: number | null | undefined, good: number, warn: number, lower = false): string {
  if (v == null) return '#64748b'
  if (lower ? v <= good : v >= good) return '#34d399'
  if (lower ? v <= warn : v >= warn) return '#fbbf24'
  return '#f87171'
}

const CHART_COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#2dd4bf']

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-emerald-400">{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</p>
      ))}
    </div>
  )
}

function AssetStructureChart({ info }: { info: StockInfo }) {
  const data = [
    { name: '總資產', value: info.totalAssets },
    { name: '總負債', value: info.totalLiabilities },
    { name: '權益', value: info.totalEquity },
    { name: '流動資產', value: info.currentAssets },
    { name: '流動負債', value: info.currentLiabilities },
  ].filter((d): d is { name: string; value: number } => d.value != null && d.value > 0)

  if (data.length === 0) return null

  return (
    <div className="bg-slate-800/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <BarChart3 size={18} />
        <h3 className="font-medium text-slate-200">資產結構</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: number) => v >= 1e9 ? `${(v / 1e9).toFixed(0)}B` : v >= 1e8 ? `${(v / 1e8).toFixed(0)}億` : `${(v / 1e4).toFixed(0)}萬`} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" name="金額" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function IncomeChart({ info }: { info: StockInfo }) {
  const data = [
    { name: '營收', value: info.revenue },
    { name: '營業成本', value: info.costOfRevenue },
    { name: '毛利', value: info.grossProfit },
    { name: '營業利益', value: info.operatingIncome },
    { name: '淨利', value: info.netIncome },
  ].filter((d): d is { name: string; value: number } => d.value != null)

  if (data.length === 0) return null

  return (
    <div className="bg-slate-800/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <DollarSign size={18} />
        <h3 className="font-medium text-slate-200">損益表</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: number) => v >= 1e9 ? `${(v / 1e9).toFixed(1)}B` : v >= 1e8 ? `${(v / 1e8).toFixed(0)}億` : `${(v / 1e4).toFixed(0)}萬`} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" name="金額" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function MarginChart({ info }: { info: StockInfo }) {
  const data = [
    { name: '毛利率', value: info.grossMargins != null ? +(info.grossMargins * 100).toFixed(2) : null, good: 30, warn: 15 },
    { name: '營業利益率', value: info.operatingMargin != null ? +(info.operatingMargin * 100).toFixed(2) : null, good: 15, warn: 5 },
    { name: '淨利率', value: info.profitMargin != null ? +(info.profitMargin * 100).toFixed(2) : null, good: 10, warn: 3 },
  ].filter((d): d is { name: string; value: number; good: number; warn: number } => d.value != null)

  if (data.length === 0) return null

  return (
    <div className="bg-slate-800/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <TrendingDown size={18} />
        <h3 className="font-medium text-slate-200">獲利率比較</h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} unit="%" />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" name="百分比" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={healthBarColor(d.value, d.good, d.warn)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function HealthChart({ info }: { info: StockInfo }) {
  const data = [
    { name: '流動比率', value: info.currentRatio, good: 1.5, warn: 1.0 },
    { name: '速動比率', value: info.quickRatio, good: 1.0, warn: 0.7 },
  ].filter((d): d is { name: string; value: number; good: number; warn: number } => d.value != null)

  if (data.length === 0) return null

  return (
    <div className="bg-slate-800/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <Shield size={18} />
        <h3 className="font-medium text-slate-200">財務健康指標</h3>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" name="比率" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={healthBarColor(d.value, d.good, d.warn)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 justify-center">
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> 良好
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> 警戒
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> 危險
        </span>
      </div>
    </div>
  )
}

export default function FundamentalsAdvanced({ info }: Props) {
  const isETF = info.isETF === true || info.fundFamily != null || info.navPrice != null
  if (isETF) return null

  const cards = [
    {
      title: '財務健康（進階）',
      icon: <Shield size={18} />,
      items: [
        { label: '流動比率', value: fmt(info.currentRatio, 2), color: healthColor(info.currentRatio, 1.5, 1.0) },
        { label: '速動比率', value: fmt(info.quickRatio, 2), color: healthColor(info.quickRatio, 1.0, 0.7) },
        { label: '負債比率', value: pct(info.debtRatio), color: healthColor(info.debtRatio, 0.5, 0.7, true) },
        { label: '負債權益比', value: fmt(info.debtToEquity, 2), color: healthColor(info.debtToEquity, 1.0, 2.0, true) },
      ],
    },
    {
      title: '資產結構',
      icon: <BarChart3 size={18} />,
      items: [
        { label: '總資產', value: money(info.totalAssets) },
        { label: '總負債', value: money(info.totalLiabilities) },
        { label: '權益總額', value: money(info.totalEquity) },
        { label: '流動資產', value: money(info.currentAssets) },
        { label: '流動負債', value: money(info.currentLiabilities) },
        { label: '存貨', value: money(info.inventory) },
      ],
    },
    {
      title: '損益表',
      icon: <DollarSign size={18} />,
      items: [
        { label: '營業收入', value: money(info.revenue) },
        { label: '營業成本', value: money(info.costOfRevenue) },
        { label: '營業毛利', value: money(info.grossProfit) },
        { label: '營業利益', value: money(info.operatingIncome) },
        { label: '稅後淨利', value: money(info.netIncome) },
        { label: '毛利率', value: pct(info.grossMargins), color: healthColor(info.grossMargins, 0.3, 0.15) },
        { label: '營業利益率', value: pct(info.operatingMargin), color: healthColor(info.operatingMargin, 0.15, 0.05) },
        { label: '淨利率', value: pct(info.profitMargin), color: healthColor(info.profitMargin, 0.1, 0.03) },
      ],
    },
    {
      title: '月營收',
      icon: <Activity size={18} />,
      items: [
        { label: '最新月營收', value: money(info.latestRevenue) },
        { label: '營收年增率 (YoY)', value: pct(info.revenueGrowthYoY), color: healthColor(info.revenueGrowthYoY, 0.1, 0) },
        { label: '營收年度', value: info.revenueYear || 'N/A' },
        { label: '營收月份', value: info.revenueMonth || 'N/A' },
      ],
    },
    {
      title: '獲利能力',
      icon: <TrendingDown size={18} />,
      items: [
        { label: 'ROE (股東權益報酬率)', value: pct(info.roe), color: healthColor(info.roe, 0.15, 0.08) },
        { label: 'ROA (資產報酬率)', value: pct(info.roa), color: healthColor(info.roa, 0.08, 0.03) },
        { label: 'EPS (每股盈餘)', value: formatNumber(info.eps) },
        { label: '預估 EPS', value: formatNumber(info.forwardEps) },
        { label: '每股淨值', value: formatNumber(info.bookValue) },
      ],
    },
  ]

  const warnings: string[] = []
  if (info.currentRatio != null && info.currentRatio < 1.0) warnings.push('流動比率低於 1.0，短期償債能力可能不足')
  if (info.debtRatio != null && info.debtRatio > 0.7) warnings.push('負債比率超過 70%，財務槓桿偏高')
  if (info.grossMargins != null && info.grossMargins < 0.1) warnings.push('毛利率低於 10%，獲利空間有限')
  if (info.revenueGrowthYoY != null && info.revenueGrowthYoY < -0.1) warnings.push('月營收年減超過 10%，需關注營運趨勢')

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-200 mb-4">基本面進階分析</h2>
      {warnings.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">財務警示</span>
          </div>
          <ul className="space-y-1">
            {warnings.map((w, i) => (
              <li key={i} className="text-xs text-slate-400 leading-relaxed">• {w}</li>
            ))}
          </ul>
        </div>
      )}
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
                  <span className={`text-sm font-medium ${(item as { color?: string }).color || 'text-slate-200'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <AssetStructureChart info={info} />
        <IncomeChart info={info} />
        <HealthChart info={info} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <MarginChart info={info} />
      </div>
    </div>
  )
}
