import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiJson } from '../lib/api'
import toast from 'react-hot-toast'

interface Container {
  ID: string
  Names: string
  Image: string
  Status: string
  State: string
  Ports: string
  RunningFor: string
}

function StatusDot({ state }: { state: string }) {
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${
      state === 'running' ? 'bg-green-400 shadow-[0_0_6px_#4ade80]' : 'bg-gray-600'
    }`} />
  )
}

function firstHostPort(ports: string): number | null {
  const m = ports?.match(/(?:0\.0\.0\.0|::):(\d+)->/)
  return m ? parseInt(m[1]) : null
}

interface Props {
  onClose?: () => void
}

export default function Docker({ onClose }: Props) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)
  const [unavailReason, setUnavailReason] = useState('')
  const [actionId, setActionId] = useState<string | null>(null)
  const [pullId, setPullId] = useState<string | null>(null)

  useEffect(() => {
    if (user && user.role !== 'admin') onClose?.()
  }, [user, onClose])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiJson<{ apps: Container[]; unavailable?: boolean; reason?: string }>('/api/apps')
      setContainers(data.apps.filter(a => !a.ID.startsWith('pm2_')))
      setUnavailable(!!data.unavailable)
      setUnavailReason(data.reason ?? '')
    } catch {
      setUnavailable(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function doAction(id: string, action: string) {
    setActionId(id)
    try {
      await apiJson(`/api/apps/${encodeURIComponent(id)}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      toast.success({ start: 'Started', stop: 'Stopped', restart: 'Restarted' }[action] ?? 'Done')
      await load()
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? 'Operation failed')
    } finally {
      setActionId(null)
    }
  }

  async function doPull(id: string) {
    setPullId(id)
    try {
      const data = await apiJson<{ ok: boolean; updated: boolean; image: string }>(
        `/api/apps/${encodeURIComponent(id)}/pull`, { method: 'POST' }
      )
      if (data.updated) { toast.success(`${data.image} updated`); await load() }
      else toast.success(`${data.image} already up to date`)
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? 'Update failed')
    } finally {
      setPullId(null)
    }
  }

  const statusLabel = (c: Container) => {
    if (c.State === 'running') return 'Running'
    if (c.State === 'exited') return 'Stopped'
    if (c.State === 'paused') return 'Paused'
    return c.State
  }

  const runningCount = containers.filter(c => c.State === 'running').length

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 shrink-0">
        <button onClick={() => onClose?.()} className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-orange-400">Docker Containers</h1>
        <button onClick={load} className="text-sm text-gray-400 hover:text-white transition-colors">Refresh</button>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : unavailable ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
            <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="text-sm">
              {unavailReason === 'permission'
                ? 'Insufficient Docker permissions'
                : unavailReason === 'not_installed'
                  ? 'Docker not installed'
                  : 'Docker service not running'}
            </p>
          </div>
        ) : containers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
            <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="text-sm">No Docker containers</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm px-1">
              <p className="text-gray-400">
                <span className="text-white font-medium">{containers.length}</span> containers total, <span className="text-green-400">{runningCount}</span> running
              </p>
            </div>

            <div className="space-y-2">
              {containers.map(c => {
                const shortId = c.ID?.length > 12 ? c.ID.slice(0, 12) : c.ID
                const port = firstHostPort(c.Ports)
                const busy = actionId === c.ID
                return (
                  <div key={c.ID} className="bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden">
                    <div className="flex items-start gap-3 p-4">
                      <div className="pt-0.5">
                        <StatusDot state={c.State} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white text-sm truncate max-w-[240px]">
                            {c.Names?.replace(/^\//, '')}
                          </span>
                          <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${
                            c.State === 'running'
                              ? 'bg-green-500/15 text-green-400'
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                            {statusLabel(c)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono space-x-3">
                          <span title="Image">{c.Image}</span>
                          <span title="Container ID">{shortId}</span>
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-3 flex-wrap">
                          {port && (
                            <a href={`http://${window.location.hostname}:${port}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-orange-400 hover:text-orange-300 underline underline-offset-2 decoration-orange-400/30"
                            >
                              :{port}
                            </a>
                          )}
                          <span className="text-gray-600">{c.Status}</span>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {c.State === 'running' ? (
                            <button
                              onClick={() => doAction(c.ID, 'stop')}
                              disabled={busy}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-700 hover:bg-red-600/80 text-gray-300 hover:text-white disabled:opacity-50 transition-colors"
                            >
                              {busy ? '…' : 'Stop'}
                            </button>
                          ) : (
                            <button
                              onClick={() => doAction(c.ID, 'start')}
                              disabled={busy}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 transition-colors"
                            >
                              {busy ? '…' : 'Start'}
                            </button>
                          )}
                          <button
                            onClick={() => doAction(c.ID, 'restart')}
                            disabled={busy}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white disabled:opacity-50 transition-colors"
                          >
                            {busy ? '…' : 'Restart'}
                          </button>
                          <button
                            onClick={() => doPull(c.ID)}
                            disabled={pullId === c.ID}
                            title="Update Image"
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-700 hover:bg-blue-600/80 text-gray-300 hover:text-white disabled:opacity-50 transition-colors"
                          >
                            {pullId === c.ID ? '…' : 'Update'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
