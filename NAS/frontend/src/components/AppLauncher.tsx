import { useState, useEffect, useCallback } from 'react'
import { apiJson } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { BUILTIN_APPS } from '../lib/builtinApps'
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

type Tab = 'list' | 'store'

function StatusDot({ state }: { state: string }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${
      state === 'running' ? 'bg-green-400 shadow-[0_0_4px_#4ade80]' : 'bg-gray-600'
    }`} />
  )
}

// Parse "0.0.0.0:8080->80/tcp" → first host port number, or null
function firstHostPort(ports: string): number | null {
  const m = ports?.match(/(?:0\.0\.0\.0|::):(\d+)->/)
  return m ? parseInt(m[1]) : null
}

// Pi hostname extracted from backend URL
const PI_HOST = (() => {
  try { return new URL(import.meta.env.VITE_BACKEND_URL as string).hostname }
  catch { return '192.168.199.108' }
})()

interface Props {
  onClose: () => void
  onLaunchBuiltin?: (id: string) => void
}

export default function AppLauncher({ onClose, onLaunchBuiltin }: Props) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [tab, setTab] = useState<Tab>('list')
  const [apps, setApps] = useState<Container[]>([])
  const [unavailable, setUnavailable] = useState(false)
  const [unavailReason, setUnavailReason] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [pullId, setPullId] = useState<string | null>(null)
  const [pullResults, setPullResults] = useState<Record<string, boolean | 'error'>>({})
  const [updatingAll, setUpdatingAll] = useState(false)

  const loadApps = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiJson<{ apps: Container[]; unavailable?: boolean; reason?: string }>('/api/apps')
      setApps(data.apps)
      setUnavailable(!!data.unavailable)
      setUnavailReason(data.reason ?? '')
    } catch {
      setUnavailable(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadApps() }, [loadApps])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function doAction(id: string, action: string) {
    setActionId(id)
    try {
      await apiJson(`/api/apps/${encodeURIComponent(id)}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      toast.success({ start: 'Started', stop: 'Stopped', restart: 'Restarted' }[action] ?? 'Done')
      await loadApps()
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? 'Operation failed')
    } finally {
      setActionId(null)
    }
  }

  async function doPull(id: string): Promise<boolean> {
    setPullId(id)
    try {
      const data = await apiJson<{ ok: boolean; updated: boolean; image: string }>(
        `/api/apps/${encodeURIComponent(id)}/pull`, { method: 'POST' }
      )
      setPullResults(r => ({ ...r, [id]: data.updated }))
      if (data.updated) { toast.success(`${data.image} updated`); await loadApps() }
      return data.updated
    } catch (err: unknown) {
      setPullResults(r => ({ ...r, [id]: 'error' }))
      toast.error((err as { message?: string }).message ?? 'Update failed')
      return false
    } finally {
      setPullId(null)
    }
  }

  async function doUpdateAll() {
    const dockerApps = apps.filter(a => !a.ID.startsWith('pm2_'))
    if (!dockerApps.length) return
    setUpdatingAll(true)
    setPullResults({})
    let updated = 0
    for (const app of dockerApps) {
      const wasUpdated = await doPull(app.ID)
      if (wasUpdated) updated++
    }
    toast.success(updated > 0 ? `${updated} containers updated` : 'All containers up to date')
    setUpdatingAll(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-start justify-center pt-12 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-2xl flex flex-col shadow-2xl max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <h2 className="text-base font-bold text-white">Apps</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl transition-colors"
          >×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 shrink-0 px-5">
          {(['list', 'store'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 px-1 mr-5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-orange-400 text-orange-400' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'list' ? 'App List' : 'Store / Update'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Built-in apps */}
          {tab === 'list' && (
            <div className="px-5 pt-4 pb-3">
              <p className="text-xs text-gray-600 mb-3 uppercase tracking-wider">Built-in Tools</p>
              <div className="grid grid-cols-2 gap-2">
                {BUILTIN_APPS.filter(app => !app.adminOnly || isAdmin).map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onLaunchBuiltin?.(app.id)
                      onClose()
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${app.bg} hover:brightness-110 transition-all text-left w-full`}
                  >
                    <div className={app.color}>{app.icon}</div>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium ${app.color}`}>{app.name}</div>
                      <div className="text-xs text-gray-600 truncate mt-0.5">{app.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* System apps (Docker + pm2) */}
          {tab === 'list' && (apps.length > 0 || !unavailable) && (
            <p className="text-xs text-gray-600 uppercase tracking-wider px-5 pb-2 pt-1 border-t border-gray-800 mt-1">
              System Services
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : unavailable ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-2">
              <p className="text-sm">
                {unavailReason === 'permission'
                  ? 'Insufficient Docker permissions — run: sudo usermod -aG docker roy'
                  : unavailReason === 'not_installed'
                    ? 'Docker not installed'
                    : 'Docker service not running or backend not updated'}
              </p>
            </div>
          ) : apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-2">
              <p className="text-sm">No system services found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {apps.map(app => {
                const busy = actionId === app.ID || pullId === app.ID
                const pullResult = pullResults[app.ID]
                const hostPort = firstHostPort(app.Ports)
                const webUrl = hostPort ? `http://${PI_HOST}:${hostPort}` : null
                const isDocker = !app.ID.startsWith('pm2_')
                return (
                  <li key={app.ID} className="px-5 py-3.5 flex items-center gap-3">
                    <StatusDot state={app.State} />

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{app.Names}</div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">{app.Image}</div>
                      {app.Ports && (
                        <div className="text-xs text-gray-600 truncate mt-0.5 font-mono">{app.Ports}</div>
                      )}
                      <div className="text-xs text-gray-600 mt-0.5">{app.Status}</div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Open web UI */}
                      {webUrl && app.State === 'running' && (
                        <a
                          href={webUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2.5 py-1 rounded bg-green-700 hover:bg-green-600 text-white transition-colors"
                        >
                          Open
                        </a>
                      )}

                      {/* List tab: start/stop/restart */}
                      {tab === 'list' && isAdmin && (
                        app.State === 'running' ? (
                          <>
                            <button
                              onClick={() => doAction(app.ID, 'restart')}
                              disabled={busy}
                              className="text-xs px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors"
                            >
                              {busy ? '…' : 'Restart'}
                            </button>
                            <button
                              onClick={() => doAction(app.ID, 'stop')}
                              disabled={busy}
                              className="text-xs px-2.5 py-1 rounded bg-gray-700 hover:bg-red-600 disabled:opacity-40 text-gray-300 hover:text-white transition-colors"
                            >
                              Stop
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => doAction(app.ID, 'start')}
                            disabled={busy}
                            className="text-xs px-2.5 py-1 rounded bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white transition-colors"
                          >
                            {busy ? '…' : 'Start'}
                          </button>
                        )
                      )}
                      {tab === 'list' && !isAdmin && (
                        <span className={`text-xs ${app.State === 'running' ? 'text-green-400' : 'text-gray-500'}`}>
                          {app.State === 'running' ? 'Running' : 'Stopped'}
                        </span>
                      )}

                      {/* Store tab: check/update */}
                      {tab === 'store' && isDocker && (
                        pullResult === true ? (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            Updated
                          </span>
                        ) : pullResult === false ? (
                          <span className="text-xs text-gray-500">Up to date</span>
                        ) : pullResult === 'error' ? (
                          <span className="text-xs text-red-400">Failed</span>
                        ) : isAdmin ? (
                          <button
                            onClick={() => doPull(app.ID)}
                            disabled={pullId !== null || updatingAll}
                            className="text-xs px-2.5 py-1 rounded bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-colors"
                          >
                            {pullId === app.ID ? 'Updating…' : 'Check Update'}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-600">Admin required</span>
                        )
                      )}
                      {tab === 'store' && !isDocker && (
                        <span className="text-xs text-gray-600">PM2 Process</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800 shrink-0 flex items-center justify-between">
          <span className="text-xs text-gray-600">
            {apps.filter(a => a.State === 'running').length} / {apps.length} running
          </span>
          <div className="flex items-center gap-3">
            {/* Update all — store tab, admin only */}
            {tab === 'store' && isAdmin && apps.some(a => !a.ID.startsWith('pm2_')) && (
              <button
                onClick={doUpdateAll}
                disabled={updatingAll || pullId !== null}
                className="text-xs px-3 py-1.5 rounded bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-colors flex items-center gap-1.5"
              >
                {updatingAll ? (
                  <>
                    <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating…
                  </>
                ) : 'Update All'}
              </button>
            )}
            <button
              onClick={loadApps}
              disabled={loading}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
