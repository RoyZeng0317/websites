import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiJson } from '../lib/api'
import toast from 'react-hot-toast'

interface RaidDevice {
  name: string
  index: number
  state: string
}

interface RaidArray {
  name: string
  level: string
  state: string
  totalDevices: number
  activeDevices: number
  deviceStates: string
  devices: RaidDevice[]
  sizeBlocks: number
  syncPct?: number
  syncFinish?: string
  syncSpeed?: string
}

interface BlockDevice {
  name: string
  size: string
  type: string
  mountpoint: string | null
  model: string | null
  children?: BlockDevice[]
}

interface RaidStatus {
  arrays: RaidArray[]
  disks: BlockDevice[]
  mdadmAvailable: boolean
}

interface Props {
  onClose: () => void
}

function formatBlocks(blocks: number): string {
  const bytes = blocks * 512
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let v = bytes, u = 0
  while (v >= 1024 && u < units.length - 1) { v /= 1024; u++ }
  return `${v.toFixed(1)} ${units[u]}`
}

const STATE_COLOR: Record<string, string> = {
  clean: 'text-green-400', active: 'text-green-400',
  degraded: 'text-amber-400', recovering: 'text-blue-400',
  resyncing: 'text-blue-400', inactive: 'text-gray-500',
}
const STATE_BG: Record<string, string> = {
  clean: 'bg-green-500/10 border-green-500/20', active: 'bg-green-500/10 border-green-500/20',
  degraded: 'bg-amber-500/10 border-amber-500/25', recovering: 'bg-blue-500/10 border-blue-500/20',
  resyncing: 'bg-blue-500/10 border-blue-500/20', inactive: 'bg-gray-800 border-gray-700',
}
const STATE_LABEL: Record<string, string> = {
  clean: 'Healthy', active: 'Healthy', degraded: 'Degraded',
  recovering: 'Rebuilding', resyncing: 'Syncing', inactive: 'Inactive',
}
const STATE_DOT: Record<string, string> = {
  clean: 'bg-green-400', active: 'bg-green-400',
  degraded: 'bg-amber-400', recovering: 'bg-blue-400 animate-pulse',
  resyncing: 'bg-blue-400 animate-pulse', inactive: 'bg-gray-600',
}
const LEVEL_LABEL: Record<string, string> = {
  raid1: 'RAID 1', raid5: 'RAID 5', raid6: 'RAID 6',
  raid0: 'RAID 0', linear: 'Linear',
}
const MIN_DISKS: Record<number, number> = { 1: 2, 5: 3, 6: 4 }
const LEVEL_DESC: Record<number, string> = {
  1: 'Mirror — requires ≥2 disks; capacity = smallest disk; survives any 1 drive failure',
  5: 'Stripe+Parity — requires ≥3 disks; tolerates 1 drive failure',
  6: 'Double Parity — requires ≥4 disks; tolerates 2 simultaneous drive failures',
}

// ─── sub-components ──────────────────────────────────────────────────────────

function DevBadge({ dev, char, onFail, onRemove, disabled }: {
  dev: RaidDevice; char: string
  onFail?: () => void; onRemove?: () => void; disabled: boolean
}) {
  const isUp   = char === 'U'
  const isFail = char === 'F'
  const isSpare = char === 'S'
  const cls = isUp
    ? 'bg-green-500/10 border-green-500/20 text-green-300'
    : isFail
      ? 'bg-red-500/10 border-red-500/20 text-red-300'
      : isSpare
        ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
        : 'bg-gray-700/40 border-gray-700 text-gray-500'
  const dot = isUp ? '●' : isFail ? '✕' : isSpare ? '◎' : '○'
  return (
    <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-mono border ${cls}`}>
      <span>{dot}</span>
      <span>/dev/{dev.name}</span>
      <span className="text-gray-600 font-sans text-[10px]">[{dev.index}]</span>
      {isUp && onFail && (
        <button onClick={onFail} disabled={disabled}
          className="ml-1 font-sans text-[10px] text-gray-500 hover:text-amber-400 disabled:opacity-40 underline transition-colors">
          Mark Failed
        </button>
      )}
      {isFail && onRemove && (
        <button onClick={onRemove} disabled={disabled}
          className="ml-1 font-sans text-[10px] text-red-400 hover:text-red-300 disabled:opacity-40 underline transition-colors">
          Remove
        </button>
      )}
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Raid({ onClose }: Props) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [status, setStatus]     = useState<RaidStatus | null>(null)
  const [loading, setLoading]   = useState(true)
  const [busy, setBusy]         = useState(false)

  // dialogs
  const [showCreate, setShowCreate]   = useState(false)
  const [showManage, setShowManage]   = useState<RaidArray | null>(null)
  const [showAddDisk, setShowAddDisk] = useState<string | null>(null)  // array name
  const [addDev, setAddDev]           = useState('')
  const [stopTarget, setStopTarget]   = useState<string | null>(null)

  // create form
  const [cLevel, setCLevel]     = useState(1)
  const [cName, setCName]       = useState('md0')
  const [cDevices, setCDevices] = useState<string[]>([])
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiJson<RaidStatus>('/api/raid/status')
      setStatus(data)
      const used = new Set(data.arrays.map(a => a.name))
      for (let i = 0; i <= 9; i++) {
        if (!used.has(`md${i}`)) { setCName(`md${i}`); break }
      }
    } catch {
      setStatus({ arrays: [], disks: [], mdadmAvailable: false })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const rebuilding = status?.arrays.some(a => a.state === 'recovering' || a.state === 'resyncing')
    if (!rebuilding) return
    const t = setInterval(load, 5000)
    return () => clearInterval(t)
  }, [status, load])

  useEffect(() => {
    if (user && user.role !== 'admin') onClose()
  }, [user, onClose])

  async function doAction(array: string, action: string, device?: string) {
    setBusy(true)
    try {
      await apiJson('/api/raid/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array, action, device }),
      })
      const msg: Record<string, string> = {
        add: 'Disk added, rebuilding…', remove: 'Disk removed',
        fail: 'Disk marked as failed', stop: 'Array stopped',
      }
      toast.success(msg[action] ?? 'Done')
      setShowAddDisk(null); setStopTarget(null); setShowManage(null)
      await load()
    } catch (e: unknown) {
      toast.error((e as { message?: string }).message ?? 'Operation failed')
    } finally {
      setBusy(false)
    }
  }

  async function doCreate() {
    const min = MIN_DISKS[cLevel] ?? 2
    if (cDevices.length < min) { toast.error(`RAID ${cLevel} requires at least ${min} disks`); return }
    if (!/^md\d{1,3}$/.test(cName)) { toast.error('Array name must be md0~md127'); return }
    setCreating(true)
    try {
      await apiJson('/api/raid/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cName, level: cLevel, devices: cDevices }),
      })
      toast.success(`/dev/${cName} created, syncing…`)
      setShowCreate(false); setCDevices([])
      await load()
    } catch (e: unknown) {
      toast.error((e as { message?: string }).message ?? 'Create failed')
    } finally {
      setCreating(false)
    }
  }

  const usedDevNames = new Set((status?.arrays ?? []).flatMap(a => a.devices.map(d => d.name)))
  const allDisks     = (status?.disks ?? []).filter(d => d.type === 'disk' && !d.children?.some(c => c.mountpoint) && !d.mountpoint)
  const freeDisks    = allDisks.filter(d => !usedDevNames.has(d.name))

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 text-white">

      {/* ── Header ── */}
      <header className="shrink-0 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 018.25-2.25M12 10.5a4.5 4.5 0 018.25-2.25M12 10.5V3" />
            </svg>
            <h1 className="text-lg font-bold text-white">RAID Array</h1>
          </div>
          <button onClick={load} disabled={loading}
            className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition-colors">
            Refresh
          </button>
        </div>

        {/* ── Action bar (admin only) ── */}
        {isAdmin && status?.mdadmAvailable && (
          <div className="flex items-center gap-2 px-6 pb-4">
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors shadow-lg shadow-orange-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create New Array
            </button>
            <span className="text-xs text-gray-600">
              {status.arrays.length > 0
                ? `${status.arrays.length} arrays · ${status.arrays.filter(a => a.state === 'clean' || a.state === 'active').length} healthy`
                : 'No arrays created'}
            </span>
          </div>
        )}
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>

        ) : !status?.mdadmAvailable ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
            <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3" />
            </svg>
            <p className="text-sm">mdadm not installed or backend not updated</p>
            <code className="text-xs bg-gray-800 px-3 py-2 rounded-lg text-gray-400 font-mono">
              sudo apt install mdadm
            </code>
          </div>

        ) : (
          <>
            {/* ── Array cards ── */}
            {status.arrays.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-600">
                <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3" />
                </svg>
                <p className="text-sm">No RAID arrays yet</p>
                {isAdmin && (
                  <button onClick={() => setShowCreate(true)}
                    className="mt-2 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors">
                    Create Now
                  </button>
                )}
              </div>
            ) : (
              <section className="space-y-3">
                {status.arrays.map(arr => {
                  const isHealthy = arr.state === 'clean' || arr.state === 'active'
                  return (
                    <div key={arr.name}
                      className={`rounded-xl border p-4 space-y-3 ${STATE_BG[arr.state] ?? 'bg-gray-800 border-gray-700'}`}>

                      {/* Array header */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATE_DOT[arr.state] ?? 'bg-gray-500'}`} />
                        <span className="font-mono font-bold text-white">/dev/{arr.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-orange-300 font-medium">
                          {LEVEL_LABEL[arr.level] ?? arr.level.toUpperCase()}
                        </span>
                        <span className={`text-xs font-semibold ${STATE_COLOR[arr.state] ?? 'text-gray-400'}`}>
                          {STATE_LABEL[arr.state] ?? arr.state}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {arr.activeDevices}/{arr.totalDevices} disks · {formatBlocks(arr.sizeBlocks)}
                        </span>

                        {/* Manage button */}
                        {isAdmin && (
                          <button
                            onClick={() => setShowManage(arr)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Manage
                          </button>
                        )}
                      </div>

                      {/* Devices */}
                      <div className="flex flex-wrap gap-2">
                        {arr.devices.map((dev, i) => (
                          <DevBadge key={dev.name} dev={dev}
                            char={arr.deviceStates[i] ?? 'U'}
                            disabled={busy}
                            onFail={isAdmin && isHealthy ? () => doAction(arr.name, 'fail', `/dev/${dev.name}`) : undefined}
                            onRemove={isAdmin ? () => doAction(arr.name, 'remove', `/dev/${dev.name}`) : undefined}
                          />
                        ))}
                      </div>

                      {/* Rebuild progress */}
                      {arr.syncPct !== undefined && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-gray-300">
                            <span>Rebuild Progress</span>
                            <span className="font-medium">{arr.syncPct.toFixed(1)}% · ~{arr.syncFinish} remaining</span>
                          </div>
                          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${arr.syncPct}%` }} />
                          </div>
                          {arr.syncSpeed && (
                            <p className="text-xs text-gray-500 font-mono">{arr.syncSpeed}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </section>
            )}

            {/* ── Disk inventory ── */}
            {allDisks.length > 0 && (
              <section className="space-y-2">
                <p className="text-xs text-gray-600 uppercase tracking-wider font-medium">Disk List</p>
                <div className="rounded-xl border border-gray-800 overflow-hidden divide-y divide-gray-800">
                  {allDisks.map(d => (
                    <div key={d.name} className="flex items-center gap-3 px-4 py-3 bg-gray-800/40 hover:bg-gray-800/70 transition-colors">
                      <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6" />
                      </svg>
                      <span className="font-mono text-sm text-gray-200">/dev/{d.name}</span>
                      <span className="text-gray-500 text-xs">{d.size}</span>
                      {d.model && <span className="text-gray-600 text-xs truncate">{d.model}</span>}
                      <div className="ml-auto">
                        {usedDevNames.has(d.name)
                          ? <span className="text-xs px-2 py-0.5 rounded bg-orange-500/10 text-orange-400">In Array</span>
                          : <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400">Free</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* ════ Manage dialog ════════════════════════════════════════════════════ */}
      {showManage && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">/dev/{showManage.name} Management</h3>
              <button onClick={() => setShowManage(null)} className="text-gray-500 hover:text-gray-300 text-xl">×</button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Level</span>
                <span className="text-gray-300">{LEVEL_LABEL[showManage.level] ?? showManage.level}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className={STATE_COLOR[showManage.state] ?? 'text-gray-300'}>
                  {STATE_LABEL[showManage.state] ?? showManage.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Disks</span>
                <span className="text-gray-300">{showManage.activeDevices}/{showManage.totalDevices}</span>
              </div>
              <div className="flex justify-between">
                <span>Capacity</span>
                <span className="text-gray-300">{formatBlocks(showManage.sizeBlocks)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {/* Add disk */}
              {freeDisks.length > 0 && (
                <button
                  onClick={() => { setShowAddDisk(showManage.name); setAddDev(''); setShowManage(null) }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/20 text-blue-300 text-sm transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-left">
                    <div className="font-medium">Add Disk</div>
                    <div className="text-xs text-blue-400/70">Add spare or replacement disk</div>
                  </div>
                </button>
              )}

              {/* Stop array */}
              <button
                onClick={() => { setStopTarget(showManage.name); setShowManage(null) }}
                className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/15 text-red-400 text-sm transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                </svg>
                <div className="text-left">
                  <div className="font-medium">Stop Array</div>
                  <div className="text-xs text-red-400/60">Disable this RAID array</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ Add disk dialog ══════════════════════════════════════════════════ */}
      {showAddDisk && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-white">Add disk to /dev/{showAddDisk}</h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {freeDisks.length === 0
                ? <p className="text-sm text-gray-600 text-center py-6">No free disks available</p>
                : freeDisks.map(d => (
                  <label key={d.name}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      addDev === `/dev/${d.name}`
                        ? 'border-orange-400/60 bg-orange-400/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                    }`}>
                    <input type="radio" name="addDisk" value={`/dev/${d.name}`}
                      checked={addDev === `/dev/${d.name}`}
                      onChange={e => setAddDev(e.target.value)}
                      className="accent-orange-400 shrink-0" />
                    <span className="font-mono text-sm">/dev/{d.name}</span>
                    <span className="text-gray-500 text-xs">{d.size}</span>
                    {d.model && <span className="text-gray-600 text-xs truncate">{d.model}</span>}
                  </label>
                ))
              }
            </div>
            <div className="flex gap-2">
              <button onClick={() => doAction(showAddDisk, 'add', addDev)}
                disabled={!addDev || busy}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-semibold transition-colors">
                {busy ? 'Adding…' : 'Confirm Add'}
              </button>
              <button onClick={() => setShowAddDisk(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ Stop confirm ═════════════════════════════════════════════════════ */}
      {stopTarget && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-red-500/25 w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-red-400">Stop /dev/{stopTarget}?</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              After stopping, the array will be inaccessible. Run <code className="text-xs bg-gray-800 px-1 rounded">mdadm --assemble</code> manually to restart.
            </p>
            <div className="flex gap-2">
              <button onClick={() => doAction(stopTarget, 'stop')}
                disabled={busy}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-sm font-semibold transition-colors">
                {busy ? 'Stopping…' : 'Confirm Stop'}
              </button>
              <button onClick={() => setStopTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ Create RAID dialog ═══════════════════════════════════════════════ */}
      {showCreate && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Create New RAID Array</h3>
              <button onClick={() => { setShowCreate(false); setCDevices([]) }}
                className="text-gray-500 hover:text-gray-300 text-xl">×</button>
            </div>

            {/* RAID level */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">RAID Level</p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 5, 6].map(l => (
                  <button key={l}
                    onClick={() => { setCLevel(l); setCDevices([]) }}
                    className={`py-3 rounded-xl text-sm font-bold transition-colors border ${
                      cLevel === l
                        ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white'
                    }`}>
                    RAID {l}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{LEVEL_DESC[cLevel]}</p>
            </div>

            {/* Array name */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Array Name</p>
              <input value={cName} onChange={e => setCName(e.target.value)} placeholder="md0"
                className="w-full bg-gray-800 border border-gray-700 focus:border-orange-400 rounded-xl px-4 py-2.5 text-sm font-mono text-white outline-none transition-colors" />
            </div>

            {/* Disk selection */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Select Disks <span className="normal-case text-gray-600">(selected {cDevices.length}, minimum {MIN_DISKS[cLevel] ?? 2})</span>
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {allDisks.length === 0
                  ? <p className="text-sm text-gray-600 text-center py-6">No available disks</p>
                  : allDisks.map(d => {
                    const path = `/dev/${d.name}`
                    const checked = cDevices.includes(path)
                    const inUse = usedDevNames.has(d.name)
                    return (
                      <label key={d.name}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          inUse ? 'border-gray-800 bg-gray-800/30 opacity-40 cursor-not-allowed' :
                          checked ? 'border-orange-400/60 bg-orange-400/10' : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        }`}>
                        <input type="checkbox" checked={checked} disabled={inUse}
                          className="accent-orange-400 shrink-0"
                          onChange={e => {
                            if (e.target.checked) setCDevices(v => [...v, path])
                            else setCDevices(v => v.filter(x => x !== path))
                          }} />
                        <span className="font-mono text-sm">{path}</span>
                        <span className="text-gray-500 text-xs">{d.size}</span>
                        {d.model && <span className="text-gray-600 text-xs truncate flex-1">{d.model}</span>}
                        {inUse && <span className="text-xs text-amber-400/60 shrink-0">In use</span>}
                      </label>
                    )
                  })
                }
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={doCreate}
                disabled={creating || cDevices.length < (MIN_DISKS[cLevel] ?? 2)}
                className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-bold transition-colors shadow-lg shadow-orange-500/20">
                {creating ? 'Creating…' : `Create RAID ${cLevel} Array`}
              </button>
              <button onClick={() => { setShowCreate(false); setCDevices([]) }}
                className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
