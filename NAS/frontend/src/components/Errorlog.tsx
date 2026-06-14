import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { apiJson } from '../lib/api'

interface Props {
  onClose: () => void
}

interface LogEntry {
  id: number
  task_id?: string
  task_name: string
  type: string
  status: string
  message?: string
  duration_ms?: number
  created_at: string
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function fmtDuration(ms?: number) {
  if (!ms) return ''
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

export default function ErrorlogPanel({ onClose }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [clearing, setClearing] = useState(false)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '200' })
      if (filterType)   params.set('type',   filterType)
      if (filterStatus) params.set('status', filterStatus)
      const data = await apiJson<LogEntry[]>(`/api/schedule/logs?${params}`)
      setLogs(data)
    } catch { toast.error('無法載入記錄') }
    finally { setLoading(false) }
  }, [filterType, filterStatus])

  useEffect(() => { load() }, [load])

  async function clearAll() {
    if (!confirm('確定要清除所有執行記錄？')) return
    setClearing(true)
    try {
      await apiJson('/api/schedule/logs', { method: 'DELETE' })
      setLogs([])
      toast.success('記錄已清除')
    } catch (err) { toast.error((err as Error).message) }
    finally { setClearing(false) }
  }

  function toggleExpand(id: number) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const errorCount = logs.filter(l => l.status === 'error').length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-semibold">執行記錄</h2>
            {errorCount > 0 && (
              <span className="text-xs bg-red-900/50 text-red-400 border border-red-800 rounded px-2 py-0.5">
                {errorCount} 個錯誤
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-700 shrink-0 flex-wrap">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500"
          >
            <option value="">全部類型</option>
            <option value="backup">備份</option>
            <option value="update">更新</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500"
          >
            <option value="">全部狀態</option>
            <option value="success">成功</option>
            <option value="error">失敗</option>
          </select>
          <button
            onClick={load}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
            title="重新整理"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <div className="flex-1" />
          <button
            onClick={clearAll}
            disabled={clearing || logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:text-white hover:bg-red-900/50 disabled:opacity-40 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            清除記錄
          </button>
        </div>

        {/* Log list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-500 text-sm">載入中...</div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-600">
              <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
              </svg>
              <span className="text-sm">沒有符合的記錄</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {logs.map(log => (
                <div key={log.id} className="px-5 py-3 hover:bg-gray-800/40 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Status icon */}
                    <div className="shrink-0 mt-0.5">
                      {log.status === 'success'
                        ? <div className="w-5 h-5 rounded-full bg-green-900/50 border border-green-700 flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                        : <div className="w-5 h-5 rounded-full bg-red-900/50 border border-red-700 flex items-center justify-center">
                            <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{log.task_name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${log.type === 'backup' ? 'bg-blue-900/40 text-blue-400' : 'bg-purple-900/40 text-purple-400'}`}>
                          {log.type === 'backup' ? '備份' : '更新'}
                        </span>
                        {log.duration_ms !== undefined && log.duration_ms !== null && (
                          <span className="text-xs text-gray-600">{fmtDuration(log.duration_ms)}</span>
                        )}
                        <span className="text-xs text-gray-600 ml-auto">{fmtTime(log.created_at)}</span>
                      </div>

                      {log.message && (
                        <div className="mt-1">
                          <button
                            onClick={() => toggleExpand(log.id)}
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                          >
                            {expanded.has(log.id) ? '▲ 收起' : '▼ 展開訊息'}
                          </button>
                          {expanded.has(log.id) && (
                            <pre className="mt-1.5 text-xs text-gray-400 bg-gray-900 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-words font-mono max-h-40 overflow-y-auto">
                              {log.message}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {logs.length > 0 && (
          <div className="px-5 py-2.5 border-t border-gray-700 shrink-0 text-xs text-gray-600">
            共 {logs.length} 筆記錄
          </div>
        )}
      </div>
    </div>
  )
}
