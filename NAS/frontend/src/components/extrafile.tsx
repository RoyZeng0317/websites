import { useState, useEffect, useCallback } from 'react'
import { apiJson } from '../lib/api'
import toast from 'react-hot-toast'

interface DupeFile {
  path: string
  name: string
  size: number
  modifiedAt: string
}

interface DupeGroup {
  hash: string
  size: number
  files: DupeFile[]
}

interface Props {
  onClose: () => void
}

function fmtBytes(b: number) {
  if (b >= 1e12) return (b / 1e12).toFixed(1) + ' TB'
  if (b >= 1e9)  return (b / 1e9).toFixed(1)  + ' GB'
  if (b >= 1e6)  return (b / 1e6).toFixed(1)  + ' MB'
  if (b >= 1e3)  return (b / 1e3).toFixed(1)  + ' KB'
  return b + ' B'
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function FileIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  )
}

export default function ExtraFilePanel({ onClose }: Props) {
  const [scanning, setScanning]     = useState(false)
  const [groups, setGroups]         = useState<DupeGroup[]>([])
  const [scanned, setScanned]       = useState<number | null>(null)
  // keepPath[hash] = path of file to keep
  const [keepMap, setKeepMap]       = useState<Record<string, string>>({})
  const [busyHash, setBusyHash]     = useState<string | null>(null)
  const [doneHashes, setDoneHashes] = useState<Set<string>>(new Set())

  const scan = useCallback(async () => {
    setScanning(true)
    setGroups([])
    setScanned(null)
    setKeepMap({})
    setDoneHashes(new Set())
    try {
      const data = await apiJson<{ groups: DupeGroup[]; scanned: number }>('/api/files/duplicates')
      setGroups(data.groups)
      setScanned(data.scanned)
      // Default: keep the newest file (index 0, already sorted newest-first)
      const defaults: Record<string, string> = {}
      for (const g of data.groups) defaults[g.hash] = g.files[0].path
      setKeepMap(defaults)
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? '掃描失敗')
    } finally {
      setScanning(false)
    }
  }, [])

  useEffect(() => { scan() }, [scan])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function deleteOthers(group: DupeGroup) {
    const keep = keepMap[group.hash]
    const toDelete = group.files.filter(f => f.path !== keep)
    if (toDelete.length === 0) return

    setBusyHash(group.hash)
    let failed = 0
    for (const f of toDelete) {
      try {
        await apiJson(`/api/files?path=${encodeURIComponent(f.path)}`, { method: 'DELETE' })
      } catch {
        failed++
      }
    }
    setBusyHash(null)

    if (failed === 0) {
      toast.success(`已刪除 ${toDelete.length} 個重複檔案`)
      setDoneHashes(prev => new Set([...prev, group.hash]))
    } else {
      toast.error(`${failed} 個檔案刪除失敗`)
    }
  }

  async function deleteAllOthers() {
    const pending = groups.filter(g => !doneHashes.has(g.hash))
    if (pending.length === 0) return
    const totalExtra = pending.reduce((acc, g) => acc + g.files.length - 1, 0)
    if (!confirm(`確定清理全部 ${pending.length} 組重複檔案，共刪除 ${totalExtra} 個多餘副本？`)) return

    let deleted = 0, failed = 0
    for (const g of pending) {
      const keep = keepMap[g.hash]
      for (const f of g.files) {
        if (f.path === keep) continue
        try {
          await apiJson(`/api/files?path=${encodeURIComponent(f.path)}`, { method: 'DELETE' })
          deleted++
        } catch { failed++ }
      }
      setDoneHashes(prev => new Set([...prev, g.hash]))
    }
    if (failed === 0) toast.success(`已清理完成，共刪除 ${deleted} 個多餘副本`)
    else toast.error(`完成，但 ${failed} 個檔案失敗`)
  }

  const pendingGroups  = groups.filter(g => !doneHashes.has(g.hash))
  const resolvedGroups = groups.filter(g => doneHashes.has(g.hash))
  const totalWaste     = pendingGroups.reduce((acc, g) => acc + g.size * (g.files.length - 1), 0)

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <h2 className="text-base font-bold text-white">多餘檔案偵測</h2>
            {scanned !== null && !scanning && (
              <span className="text-xs text-gray-500">
                掃描了 {scanned} 個檔案
                {pendingGroups.length > 0 && (
                  <>，找到 <span className="text-orange-400 font-semibold">{pendingGroups.length}</span> 組重複</>
                )}
              </span>
            )}
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl transition-colors">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Scanning */}
          {scanning && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"/>
              <p className="text-gray-400 text-sm">正在掃描重複檔案…</p>
              <p className="text-gray-600 text-xs">依檔案大小 + MD5 雜湊值比對</p>
            </div>
          )}

          {/* No duplicates */}
          {!scanning && groups.length === 0 && scanned !== null && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
              <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-sm text-gray-400">太棒了！未發現重複檔案</p>
            </div>
          )}

          {/* Waste summary */}
          {!scanning && pendingGroups.length > 0 && (
            <div className="mx-5 mt-4 mb-2 px-4 py-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-300 font-medium">
                  {pendingGroups.length} 組重複檔案，可釋放約 <span className="font-bold">{fmtBytes(totalWaste)}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">預設保留最新版本，你可以點選其他檔案變更</p>
              </div>
              <button
                onClick={deleteAllOthers}
                className="shrink-0 text-sm px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition-colors">
                全部清理
              </button>
            </div>
          )}

          {/* Groups */}
          {!scanning && pendingGroups.length > 0 && (
            <div className="divide-y divide-gray-800 px-5 pb-4">
              {pendingGroups.map(group => {
                const busy = busyHash === group.hash
                const keep = keepMap[group.hash]
                const extraCount = group.files.length - 1

                return (
                  <div key={group.hash} className="py-4">
                    {/* Group header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-mono">
                        {group.hash.slice(0, 8)}
                      </span>
                      <span className="text-xs text-gray-500">{fmtBytes(group.size)}</span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs text-gray-500">{group.files.length} 個副本</span>
                      <div className="flex-1"/>
                      <button
                        onClick={() => deleteOthers(group)}
                        disabled={busy}
                        className="text-xs px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-500 disabled:opacity-40 text-white transition-colors flex items-center gap-1">
                        {busy ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        )}
                        刪除其他 {extraCount} 個
                      </button>
                    </div>

                    {/* File list */}
                    <ul className="space-y-1.5">
                      {group.files.map((f, i) => {
                        const isKeep = keep === f.path
                        return (
                          <li key={f.path}
                            onClick={() => setKeepMap(m => ({ ...m, [group.hash]: f.path }))}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                              isKeep
                                ? 'bg-green-500/10 border-green-500/30'
                                : 'bg-gray-800/50 border-gray-700/40 hover:border-gray-600/60'
                            }`}>
                            {/* Radio */}
                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                              isKeep ? 'border-green-500 bg-green-500' : 'border-gray-600'
                            }`}>
                              {isKeep && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                            </div>

                            {/* Icon + info */}
                            <div className={`mt-0.5 ${isKeep ? 'text-green-400' : 'text-gray-500'}`}>
                              <FileIcon/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isKeep ? 'text-green-300' : 'text-gray-300'}`}>
                                {f.name}
                              </p>
                              <p className="text-xs text-gray-500 font-mono truncate mt-0.5" title={f.path}>
                                {f.path}
                              </p>
                              <p className="text-xs text-gray-600 mt-0.5">{fmtDate(f.modifiedAt)}</p>
                            </div>
                            {/* Badge */}
                            <div className="shrink-0 mt-0.5">
                              {isKeep ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">保留</span>
                              ) : i === 0 ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">最新</span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">刪除</span>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}

          {/* Resolved groups */}
          {!scanning && resolvedGroups.length > 0 && (
            <div className="px-5 pb-4">
              <p className="text-xs text-gray-600 mb-2">已完成 ({resolvedGroups.length} 組)</p>
              <div className="space-y-1.5">
                {resolvedGroups.map(g => (
                  <div key={g.hash}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/30 border border-gray-800">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    <span className="text-xs text-gray-500 font-mono">{g.hash.slice(0, 8)}</span>
                    <span className="text-xs text-gray-600">{g.files[0].name}</span>
                    <span className="text-xs text-gray-700 ml-auto">已清理 {g.files.length - 1} 個</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800 shrink-0 flex items-center justify-between">
          <span className="text-xs text-gray-600">刪除的檔案會移至回收桶，可還原</span>
          <button
            onClick={scan}
            disabled={scanning}
            className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1.5 transition-colors disabled:opacity-40">
            <svg className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            重新掃描
          </button>
        </div>
      </div>
    </div>
  )
}
