import { useState, useEffect } from 'react'
import { Newspaper, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react'

interface Article {
  title: string
  link: string
  source: string
  pubdate: string | null
  summary: string
  additional_sources: string[]
}

interface NewsGroup {
  group: string
  keywords: string[]
  article_count: number
  articles: Article[]
}

interface NewsData {
  date: string
  generated_at: string
  group_count: number
  total_articles: number
  groups: NewsGroup[]
}

const SOURCE_LABELS: Record<string, string> = {
  yahoo: 'Yahoo奇摩股市',
  cnyes: '鉅亨網',
  udn: '經濟日報',
  ctee: '工商時報',
  ptt: 'PTT Stock板',
  youtube: '57東森財經新聞',
}

const UNCLASSIFIED_GROUP = '大盤/未分類'
// 分組名稱格式為「代號 簡稱」（例如「2881 富邦金」），大盤/未分類例外
const TICKER_GROUP_RE = /^(\d{4,6}[A-Za-z-]*)\s+(.+)$/

function formatTime(pubdate: string | null): string {
  if (!pubdate) return ''
  const d = new Date(pubdate)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const NEWS_API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export default function News() {
  const [data, setData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchNews() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${NEWS_API_BASE}/news`)
      if (!res.ok) throw new Error(res.status === 404 ? '近 7 日無可用新聞資料' : `載入失敗（${res.status}）`)
      const json = await res.json() as NewsData
      if (!Array.isArray(json.groups)) throw new Error('新聞資料格式錯誤')
      setData(json)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      console.error('[News] 載入失敗:', msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchNews() }, [])

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper size={15} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-300">新聞快訊</span>
          {data && <span className="text-xs text-slate-600">{data.date}</span>}
        </div>
        <button
          onClick={() => void fetchNews()}
          disabled={loading}
          className={`transition-colors ${loading ? 'text-slate-500 animate-spin' : 'text-slate-600 hover:text-slate-400'}`}
          title="重新整理"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {data && !loading && !error && (
        <p className="text-xs text-slate-600">
          共 {data.total_articles} 篇 · {data.group_count} 組
        </p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          <div className="h-16 rounded-xl bg-slate-800/50 animate-pulse" />
          <div className="h-16 rounded-xl bg-slate-800/50 animate-pulse" />
          <div className="h-16 rounded-xl bg-slate-800/50 animate-pulse" />
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3">
          <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm text-red-400 font-medium">無法載入新聞資料</p>
            <p className="text-xs text-red-500/80 font-mono">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && data && (
        <div className="space-y-3">
          {data.groups.map(group => {
            const match = group.group !== UNCLASSIFIED_GROUP ? TICKER_GROUP_RE.exec(group.group) : null
            return (
              <div
                key={group.group}
                className="rounded-xl border border-slate-800 bg-slate-800/30 px-3 py-2.5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {match ? (
                      <>
                        <span className="text-xs font-mono text-slate-500 shrink-0">{match[1]}</span>
                        <span className="text-sm text-slate-200 truncate">{match[2]}</span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-300">{group.group}</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-600 shrink-0">{group.article_count} 篇</span>
                </div>

                {group.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {group.keywords.map(kw => (
                      <span key={kw} className="text-xs text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-1.5">
                  {group.articles.map(article => (
                    <a
                      key={article.link}
                      href={article.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg px-2 py-1.5 hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex items-start gap-1.5">
                        <span className="text-xs text-slate-300 leading-snug flex-1">{article.title}</span>
                        <ExternalLink size={11} className="text-slate-600 flex-shrink-0 mt-0.5" />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600">
                        <span>{SOURCE_LABELS[article.source] ?? article.source}</span>
                        {formatTime(article.pubdate) && (
                          <>
                            <span>·</span>
                            <span>{formatTime(article.pubdate)}</span>
                          </>
                        )}
                        {article.additional_sources.length > 0 && (
                          <>
                            <span>·</span>
                            <span>另有 {article.additional_sources.length} 則相關報導</span>
                          </>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
