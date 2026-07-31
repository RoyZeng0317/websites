import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../../firebase'
import {
  deleteNewsForDate,
  getNewsForDate,
  getRulesConfig,
  listNewsDates,
  listWorkflowRuns,
  saveNewsForDate,
  saveRulesConfig,
  type AdminNewsData,
  type GithubCommitResult,
  type NewsDateSummary,
  type RulesConfig,
  type WorkflowRun,
} from '../../api/adminNewsApi'
import { RefreshCw, Trash2, Save, ExternalLink, Plus, X, ShieldAlert, Copy, Check } from 'lucide-react'

type TabId = 'news' | 'rules' | 'runs'

function GithubResultNote({ result }: { result: GithubCommitResult | null }) {
  if (!result) return null
  if (result.committed) {
    return <p className="text-xs text-emerald-400">已 commit 回 GitHub（{result.commit_sha?.slice(0, 7)}）。</p>
  }
  return (
    <p className="text-xs text-amber-400">
      未 commit 回 GitHub（{result.reason ?? '未知原因'}）——本地已生效，但下次部署/pipeline 執行前可能被覆蓋。
    </p>
  )
}

// 讓本地 StockInfoEditor.py（tkinter 桌面工具）能拿到 Firebase ID Token 當
// Bearer token 呼叫 /api/admin/stock/*。Token 效期約 1 小時，工具端過期後重貼一次即可。
function CopyTokenButton({ user }: { user: User }) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  async function handleCopy() {
    setError('')
    try {
      const token = await user.getIdToken()
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-400">{error}</span>}
      <button
        onClick={() => void handleCopy()}
        title="複製後貼到本地 StockInfoEditor.py 桌面工具（效期約 1 小時）"
        className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-emerald-500/40"
      >
        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        {copied ? '已複製' : '複製管理員 Token'}
      </button>
    </div>
  )
}

export default function NewsAdminPanel() {
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [tab, setTab] = useState<TabId>('news')

  useEffect(() => {
    return onAuthStateChanged(auth, (next) => {
      setUser(next)
      setAuthChecked(true)
    })
  }, [])

  if (!authChecked) {
    return <div className="text-sm text-slate-500">載入中...</div>
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-12 text-center">
        <ShieldAlert size={28} className="text-slate-500" />
        <p className="text-sm text-slate-300">此頁僅限管理員使用，請先登入 Google 帳號。</p>
        <button
          onClick={() => void signInWithPopup(auth, googleProvider)}
          className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          使用 Google 登入
        </button>
      </div>
    )
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'news', label: '新聞管理' },
    { id: 'rules', label: '關鍵字規則' },
    { id: 'runs', label: '執行紀錄' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === t.id
                ? 'bg-emerald-400/15 text-emerald-300'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <CopyTokenButton user={user} />
      </div>

      {tab === 'news' && <NewsManageTab />}
      {tab === 'rules' && <RulesTab />}
      {tab === 'runs' && <RunsTab />}
    </div>
  )
}

// ── 新聞管理（依日期瀏覽/編輯/刪除） ─────────────────────────────────────

function NewsManageTab() {
  const [dates, setDates] = useState<NewsDateSummary[] | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [data, setData] = useState<AdminNewsData | null>(null)
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [githubResult, setGithubResult] = useState<GithubCommitResult | null>(null)

  async function loadDates(preselect?: string) {
    setError('')
    try {
      const list = await listNewsDates()
      setDates(list)
      const fallback = preselect ?? list[0]?.date ?? ''
      if (fallback) void loadDate(fallback)
      else {
        setSelectedDate('')
        setData(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  async function loadDate(date: string) {
    setLoading(true)
    setError('')
    setGithubResult(null)
    try {
      const news = await getNewsForDate(date)
      setSelectedDate(date)
      setData(news)
      setDirty(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function removeArticle(groupIdx: number, articleIdx: number) {
    if (!data) return
    const groups = data.groups.map((g, gi) => {
      if (gi !== groupIdx) return g
      const articles = g.articles.filter((_, ai) => ai !== articleIdx)
      return { ...g, articles, article_count: articles.length }
    })
    setData({ ...data, groups })
    setDirty(true)
  }

  function removeGroup(groupIdx: number) {
    if (!data) return
    setData({ ...data, groups: data.groups.filter((_, gi) => gi !== groupIdx) })
    setDirty(true)
  }

  function editArticleField(
    groupIdx: number,
    articleIdx: number,
    field: 'title' | 'summary',
    value: string
  ) {
    if (!data) return
    const groups = data.groups.map((g, gi) => {
      if (gi !== groupIdx) return g
      const articles = g.articles.map((a, ai) => (ai === articleIdx ? { ...a, [field]: value } : a))
      return { ...g, articles }
    })
    setData({ ...data, groups })
    setDirty(true)
  }

  async function handleSave() {
    if (!data || !selectedDate) return
    setSaving(true)
    setError('')
    setGithubResult(null)
    try {
      const res = await saveNewsForDate(selectedDate, data)
      setData(res.data)
      setGithubResult(res.github)
      setDirty(false)
      void loadDates(selectedDate)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteDate() {
    if (!selectedDate) return
    if (!window.confirm(`確定要刪除 ${selectedDate} 整天的新聞資料嗎？此操作會同時從 GitHub 上移除（若有設定），無法復原。`)) {
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await deleteNewsForDate(selectedDate)
      setGithubResult(res.github)
      await loadDates()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedDate}
          onChange={(e) => void loadDate(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200"
        >
          {(dates ?? []).map((d) => (
            <option key={d.date} value={d.date}>
              {d.date}
              {!d.valid ? '（格式錯誤）' : ''}
              {d.total_articles != null ? ` · ${d.total_articles} 篇` : ''}
            </option>
          ))}
        </select>
        <button
          onClick={() => void loadDates(selectedDate)}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-500 disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          重新整理
        </button>
        <div className="flex-1" />
        <button
          onClick={handleSave}
          disabled={!dirty || saving || !data}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save size={14} />
          {saving ? '儲存中...' : '儲存變更'}
        </button>
        <button
          onClick={handleDeleteDate}
          disabled={!selectedDate || saving}
          className="flex items-center gap-1.5 rounded-lg border border-red-900/50 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-950/30 disabled:opacity-40"
        >
          <Trash2 size={14} />
          刪除本日
        </button>
      </div>

      <GithubResultNote result={githubResult} />
      {error && (
        <div className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {data && (
        <p className="text-xs text-slate-500">
          {data.date} · 共 {data.total_articles} 篇 · {data.group_count} 組 · 產生於 {data.generated_at}
          {dirty && <span className="ml-2 text-amber-400">（尚未儲存）</span>}
        </p>
      )}

      <div className="space-y-3">
        {data?.groups.map((group, groupIdx) => (
          <div key={`${group.group}-${groupIdx}`} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-200">{group.group}</span>
                <span className="text-xs text-slate-500">{group.articles.length} 篇</span>
              </div>
              <button
                onClick={() => removeGroup(groupIdx)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-400 transition hover:bg-red-950/30"
              >
                <Trash2 size={12} />
                刪除整組
              </button>
            </div>

            <div className="space-y-2">
              {group.articles.map((article, articleIdx) => (
                <div key={article.link} className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <input
                      value={article.title}
                      onChange={(e) => editArticleField(groupIdx, articleIdx, 'title', e.target.value)}
                      className="flex-1 rounded border border-slate-800 bg-slate-900 px-2 py-1 text-sm text-slate-200 focus:border-emerald-500/50 focus:outline-none"
                    />
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 text-slate-600 hover:text-slate-400"
                      title="開啟原文"
                    >
                      <ExternalLink size={13} />
                    </a>
                    <button
                      onClick={() => removeArticle(groupIdx, articleIdx)}
                      className="mt-1 text-slate-600 hover:text-red-400"
                      title="刪除這篇"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <textarea
                    value={article.summary}
                    onChange={(e) => editArticleField(groupIdx, articleIdx, 'summary', e.target.value)}
                    rows={2}
                    className="w-full resize-y rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-400 focus:border-emerald-500/50 focus:outline-none"
                  />
                  <div className="text-xs text-slate-600">
                    {article.source} · {article.pubdate ?? '無日期'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {data && data.groups.length === 0 && (
          <p className="text-sm text-slate-500">這天沒有任何分組了（已全部刪除，儲存後檔案會保留空的 groups）。</p>
        )}
      </div>
    </div>
  )
}

// ── 財經關鍵字/規則設定 ──────────────────────────────────────────────────

function RulesTab() {
  const [config, setConfig] = useState<RulesConfig | null>(null)
  const [newKeyword, setNewKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [githubResult, setGithubResult] = useState<GithubCommitResult | null>(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      setConfig(await getRulesConfig())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function addKeyword() {
    const kw = newKeyword.trim()
    if (!kw || !config || config.financial_keywords.includes(kw)) return
    setConfig({ ...config, financial_keywords: [...config.financial_keywords, kw] })
    setNewKeyword('')
  }

  function removeKeyword(kw: string) {
    if (!config) return
    setConfig({
      ...config,
      financial_keywords: config.financial_keywords.filter((k) => k !== kw),
      core_market_exclude: config.core_market_exclude.filter((k) => k !== kw),
      false_positive_phrases: Object.fromEntries(
        Object.entries(config.false_positive_phrases).filter(([k]) => k !== kw)
      ),
    })
  }

  function toggleExclude(kw: string) {
    if (!config) return
    const excluded = config.core_market_exclude.includes(kw)
    setConfig({
      ...config,
      core_market_exclude: excluded
        ? config.core_market_exclude.filter((k) => k !== kw)
        : [...config.core_market_exclude, kw],
    })
  }

  function setPhrases(kw: string, raw: string) {
    if (!config) return
    const phrases = raw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
    const next = { ...config.false_positive_phrases }
    if (phrases.length === 0) delete next[kw]
    else next[kw] = phrases
    setConfig({ ...config, false_positive_phrases: next })
  }

  async function handleSave() {
    if (!config) return
    setSaving(true)
    setError('')
    setGithubResult(null)
    try {
      const res = await saveRulesConfig({
        financial_keywords: config.financial_keywords,
        false_positive_phrases: config.false_positive_phrases,
        core_market_exclude: config.core_market_exclude,
        unclassified_min_core_hits: config.unclassified_min_core_hits,
      })
      setConfig(res.data)
      setGithubResult(res.github)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-slate-500">載入中...</p>
  if (error && !config) {
    return <div className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-400">{error}</div>
  }
  if (!config) return null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          目前來源：{config.source === 'override' ? '已自訂（rules_config.json）' : '內建預設值（尚未自訂過）'}
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? '儲存中...' : '儲存規則'}
        </button>
      </div>

      <GithubResultNote result={githubResult} />
      {error && (
        <div className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-200">財經關鍵字（financial_keywords）</h3>
        <p className="text-xs text-slate-500">
          標題/內文命中任一關鍵字才視為財經新聞。勾選「排除」的關鍵字不會用於「大盤/未分類」分組的嚴格複檢（見下方核心命中門檻）。
        </p>
        <div className="flex flex-wrap gap-1.5">
          {config.financial_keywords.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300"
            >
              <label className="flex items-center gap-1 cursor-pointer" title="排除於核心市場關鍵字">
                <input
                  type="checkbox"
                  checked={config.core_market_exclude.includes(kw)}
                  onChange={() => toggleExclude(kw)}
                  className="accent-amber-400"
                />
                {kw}
              </label>
              <button onClick={() => removeKeyword(kw)} className="text-slate-600 hover:text-red-400">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
            placeholder="新增關鍵字"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 focus:border-emerald-500/50 focus:outline-none"
          />
          <button
            onClick={addKeyword}
            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-emerald-500/40"
          >
            <Plus size={13} />
            新增
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-200">未分類新聞的核心命中門檻</h3>
        <p className="text-xs text-slate-500">
          「大盤/未分類」分組（沒比對到任何實際上市櫃公司）的文章，未被排除的關鍵字有效命中次數需達到這個數字才放行。
        </p>
        <input
          type="number"
          min={1}
          value={config.unclassified_min_core_hits}
          onChange={(e) =>
            setConfig({ ...config, unclassified_min_core_hits: Math.max(1, Number(e.target.value) || 1) })
          }
          className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 focus:border-emerald-500/50 focus:outline-none"
        />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-200">已知誤配複合詞（false_positive_phrases）</h3>
        <p className="text-xs text-slate-500">
          例如「指數」命中「空氣品質指數」不該算數——每個關鍵字可填多個誤配詞，用逗號分隔。
        </p>
        <div className="space-y-1.5">
          {config.financial_keywords.map((kw) => (
            <div key={kw} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-xs text-slate-400">{kw}</span>
              <input
                defaultValue={(config.false_positive_phrases[kw] ?? []).join(', ')}
                onBlur={(e) => setPhrases(kw, e.target.value)}
                placeholder="例：空氣品質指數, 幸福指數"
                className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── 管線執行紀錄（GitHub Actions） ───────────────────────────────────────

function statusColor(run: WorkflowRun) {
  if (run.status !== 'completed') return 'text-amber-400 bg-amber-400/10'
  if (run.conclusion === 'success') return 'text-emerald-400 bg-emerald-400/10'
  return 'text-red-400 bg-red-400/10'
}

function statusLabel(run: WorkflowRun) {
  if (run.status !== 'completed') return run.status === 'in_progress' ? '執行中' : run.status
  return run.conclusion === 'success' ? '成功' : run.conclusion ?? '失敗'
}

function formatDuration(run: WorkflowRun) {
  if (!run.run_started_at || run.status !== 'completed') return '—'
  const ms = new Date(run.updated_at).getTime() - new Date(run.run_started_at).getTime()
  if (!Number.isFinite(ms) || ms < 0) return '—'
  const sec = Math.round(ms / 1000)
  return sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`
}

function RunsTab() {
  const [runs, setRuns] = useState<WorkflowRun[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      setRuns(await listWorkflowRuns())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const rows = useMemo(() => runs ?? [], [runs])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">Stocks News Automation（.github/workflows/news-automation.yml）最近執行紀錄</p>
        <button
          onClick={() => void load()}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-500 disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          重新整理
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-left text-xs text-slate-500">
              <th className="px-3 py-2 font-medium">狀態</th>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">觸發事件</th>
              <th className="px-3 py-2 font-medium">時間</th>
              <th className="px-3 py-2 font-medium">耗時</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((run) => (
              <tr key={run.id} className="border-b border-slate-800/60 last:border-0">
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(run)}`}>
                    {statusLabel(run)}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-400">#{run.run_number}</td>
                <td className="px-3 py-2 text-slate-400">{run.event}</td>
                <td className="px-3 py-2 text-slate-400">{new Date(run.created_at).toLocaleString('zh-TW')}</td>
                <td className="px-3 py-2 text-slate-400">{formatDuration(run)}</td>
                <td className="px-3 py-2">
                  <a
                    href={run.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-400"
                  >
                    查看紀錄 <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && !error && (
          <p className="px-3 py-6 text-center text-sm text-slate-500">尚無執行紀錄</p>
        )}
      </div>
    </div>
  )
}
