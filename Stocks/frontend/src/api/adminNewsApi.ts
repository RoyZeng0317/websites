import { auth } from '../firebase'

const BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export interface AdminArticle {
  title: string
  link: string
  source: string
  pubdate: string | null
  summary: string
  additional_sources: string[]
}

export interface AdminNewsGroup {
  group: string
  keywords: string[]
  article_count: number
  articles: AdminArticle[]
}

export interface AdminNewsData {
  date: string
  generated_at: string
  group_count: number
  total_articles: number
  groups: AdminNewsGroup[]
}

export interface NewsDateSummary {
  date: string
  valid: boolean
  generated_at?: string | null
  group_count?: number | null
  total_articles?: number | null
}

export interface RulesConfig {
  source: 'default' | 'override'
  financial_keywords: string[]
  false_positive_phrases: Record<string, string[]>
  core_market_exclude: string[]
  unclassified_min_core_hits: number
}

export interface WorkflowRun {
  id: number
  run_number: number
  status: string
  conclusion: string | null
  event: string
  created_at: string
  run_started_at: string | null
  updated_at: string
  html_url: string
}

export interface GithubCommitResult {
  committed: boolean
  reason?: string
  commit_sha?: string
}

async function authHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser
  if (!user) throw new Error('請先登入')
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const body = await res.json()
      if (body?.detail) detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail)
    } catch {
      // 非 JSON 錯誤內容（例如伺服器整個掛掉回傳 HTML），沿用預設訊息
    }
    throw new Error(detail)
  }
  return res.json()
}

export async function listNewsDates(): Promise<NewsDateSummary[]> {
  const headers = await authHeaders()
  const res = await fetch(`${BASE}/admin/news/dates`, { headers })
  return handle(res)
}

export async function getNewsForDate(date: string): Promise<AdminNewsData> {
  const headers = await authHeaders()
  const res = await fetch(`${BASE}/admin/news/${date}`, { headers })
  return handle(res)
}

export async function saveNewsForDate(
  date: string,
  data: AdminNewsData
): Promise<{ ok: boolean; github: GithubCommitResult; data: AdminNewsData }> {
  const headers = await authHeaders()
  const res = await fetch(`${BASE}/admin/news/${date}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })
  return handle(res)
}

export async function deleteNewsForDate(
  date: string
): Promise<{ ok: boolean; github: GithubCommitResult }> {
  const headers = await authHeaders()
  const res = await fetch(`${BASE}/admin/news/${date}`, { method: 'DELETE', headers })
  return handle(res)
}

export async function getRulesConfig(): Promise<RulesConfig> {
  const headers = await authHeaders()
  const res = await fetch(`${BASE}/admin/news/config/rules`, { headers })
  return handle(res)
}

export async function saveRulesConfig(
  data: Omit<RulesConfig, 'source'>
): Promise<{ ok: boolean; github: GithubCommitResult; data: RulesConfig }> {
  const headers = await authHeaders()
  const res = await fetch(`${BASE}/admin/news/config/rules`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })
  return handle(res)
}

export async function listWorkflowRuns(): Promise<WorkflowRun[]> {
  const headers = await authHeaders()
  const res = await fetch(`${BASE}/admin/news/runs`, { headers })
  return handle(res)
}
