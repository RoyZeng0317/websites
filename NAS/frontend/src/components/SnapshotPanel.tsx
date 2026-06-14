import { useState, useEffect, useCallback } from 'react'
import { apiJson } from '../lib/api'
import toast from 'react-hot-toast'

interface Snapshot {
  id: string
  originalPath: string
  name: string
  createdAt: string
  size?: string
}

interface Props {
  onClose: () => void
  onRestored?: () => void
  filterPath?: string       // highlight/filter to a specific original path
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
    </svg>
  )
}

export default function SnapshotPanel({ onClose, onRestored, filterPath }: Props) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [filter, setFilter] = useState(filterPath ?? '')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiJson<{ snapshots: Snapshot[] }>('/api/snapshots')
      setSnapshots(data.snapshots)
    } catch {
      toast.error('無法載入快照清單')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function restore(snap: Snapshot) {
    setBusyId(snap.id)
    try {
      const data = await apiJson<{ restoredPath: string }>(`/api/snapshots/${snap.id}/restore`, {
        method: 'POST',
      })
      toast.success(`已還原至：${data.restoredPath}`)
      onRestored?.()
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? '還原失敗')
    } finally {
      setBusyId(null)
    }
  }

  async function remove(snap: Snapshot) {
    if (!confirm(`確定刪除快照「${snap.name} · ${fmt(snap.createdAt)}」？`)) return
    setBusyId(snap.id)
    try {
      await apiJson(`/api/snapshots/${snap.id}`, { method: 'DELETE' })
      toast.success('快照已刪除')
      setSnapshots(s => s.filter(x => x.id !== snap.id))
    } catch {
      toast.error('刪除失敗')
    } finally {
      setBusyId(null)
    }
  }

  const shown = filter.trim()
    ? snapshots.filter(s => s.originalPath.includes(filter.trim()))
    : snapshots

  const grouped = shown.reduce<Record<string, Snapshot[]>>((acc, s) => {
    const key = s.originalPath || '/'
    acc[key] = acc[key] ?? []
    acc[key].push(s)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
            </svg>
            <h2 className="text-base font-bold text-white">快照管理</h2>
            <span className="text-xs text-gray-500 ml-1">({snapshots.length} 個)</span>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl transition-colors">
            ×
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-800 shrink-0">
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="篩選路徑…"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : shown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600 gap-3">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
              </svg>
              <p className="text-sm">{filter ? '找不到符合的快照' : '尚無快照'}</p>
              <p className="text-xs text-gray-700">右鍵點擊資料夾 → 「建立快照」</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {Object.entries(grouped).map(([origPath, snaps]) => (
                <div key={origPath} className="px-5 py-3">
                  {/* Group header */}
                  <div className="flex items-center gap-2 mb-2">
                    <FolderIcon className="w-4 h-4 text-yellow-400 shrink-0"/>
                    <span className="text-xs text-gray-400 font-mono truncate">{origPath || '/'}</span>
                    <span className="text-xs text-gray-700 shrink-0">{snaps.length} 個快照</span>
                  </div>

                  <ul className="space-y-1.5">
                    {snaps.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(snap => {
                      const busy = busyId === snap.id
                      return (
                        <li key={snap.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/60 border border-gray-700/50">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm">{fmt(snap.createdAt)}</p>
                            {snap.size && (
                              <p className="text-gray-500 text-xs mt-0.5">{snap.size}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => restore(snap)}
                              disabled={busy}
                              title="還原到新資料夾"
                              className="text-xs px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors">
                              {busy ? '…' : '還原'}
                            </button>
                            <button
                              onClick={() => remove(snap)}
                              disabled={busy}
                              className="text-xs px-2.5 py-1 rounded-lg bg-gray-700 hover:bg-red-600 disabled:opacity-40 text-gray-400 hover:text-white transition-colors">
                              刪除
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800 shrink-0 flex items-center justify-between">
          <span className="text-xs text-gray-600">還原會在原資料夾旁建立新資料夾，不覆蓋原始內容</span>
          <button onClick={load} disabled={loading}
            className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            重新整理
          </button>
        </div>
      </div>
    </div>
  )
}
