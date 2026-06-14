import { useEffect, useState, useCallback } from 'react'
import { apiJson } from '../lib/api'
import toast from 'react-hot-toast'

interface TrashItem {
  trashName: string
  name: string
  originalPath: string
  deletedAt: string
  size?: number
  type: 'file' | 'folder'
}

interface Props {
  onClose: () => void
  onRestored?: () => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}

export default function TrashPanel({ onClose, onRestored }: Props) {
  const [items, setItems] = useState<TrashItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [emptyingAll, setEmptyingAll] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiJson<{ items: TrashItem[] }>('/api/trash')
      setItems(res.items)
    } catch {
      toast.error('無法載入回收桶')
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

  async function restore(item: TrashItem) {
    setBusyId(item.trashName)
    try {
      await apiJson('/api/trash/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trashName: item.trashName }),
      })
      toast.success(`已還原：${item.name}`)
      onRestored?.()
      await load()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  async function deletePermanent(item: TrashItem) {
    if (!confirm(`永久刪除「${item.name}」？此操作無法復原。`)) return
    setBusyId(item.trashName)
    try {
      await apiJson(`/api/trash/item?trashName=${encodeURIComponent(item.trashName)}`, { method: 'DELETE' })
      toast.success('已永久刪除')
      await load()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  async function emptyAll() {
    if (!items.length) return
    if (!confirm(`清空回收桶中的 ${items.length} 個項目？此操作無法復原。`)) return
    setEmptyingAll(true)
    try {
      await apiJson('/api/trash/all', { method: 'DELETE' })
      toast.success('回收桶已清空')
      setItems([])
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setEmptyingAll(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-xl flex flex-col max-h-[85vh] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            <span className="text-white font-semibold">回收桶</span>
            {items.length > 0 && (
              <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">{items.length}</span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600 gap-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <p className="text-sm">回收桶是空的</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {items.map(item => {
                const busy = busyId === item.trashName
                const deletedDate = item.deletedAt
                  ? new Date(item.deletedAt).toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                  : '—'
                return (
                  <li key={item.trashName} className="flex items-center gap-3 px-5 py-3">
                    {/* Icon */}
                    <div className="shrink-0">
                      {item.type === 'folder' ? (
                        <svg className="w-8 h-8 text-yellow-400/60" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{item.name}</p>
                      <p className="text-gray-600 text-xs truncate mt-0.5">
                        原路徑：{item.originalPath || '根目錄'}
                      </p>
                      <p className="text-gray-700 text-xs mt-0.5">
                        {deletedDate}
                        {item.size !== undefined && <span className="ml-2">{formatSize(item.size)}</span>}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => restore(item)}
                        disabled={busy || emptyingAll}
                        className="text-xs px-2.5 py-1.5 rounded bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-40 transition-colors"
                      >
                        {busy ? '…' : '還原'}
                      </button>
                      <button
                        onClick={() => deletePermanent(item)}
                        disabled={busy || emptyingAll}
                        className="text-xs px-2.5 py-1.5 rounded bg-gray-700 hover:bg-red-700 text-gray-300 hover:text-white disabled:opacity-40 transition-colors"
                      >
                        永久刪除
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-700 shrink-0 flex items-center justify-between">
          <button
            onClick={load}
            disabled={loading}
            className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors disabled:opacity-40"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新整理
          </button>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={emptyAll}
                disabled={emptyingAll || loading}
                className="text-xs px-3 py-1.5 rounded bg-red-800 hover:bg-red-700 text-white transition-colors disabled:opacity-40"
              >
                {emptyingAll ? '清空中…' : '清空回收桶'}
              </button>
            )}
            <button onClick={onClose} className="text-xs px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors">
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
