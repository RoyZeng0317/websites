import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { apiJson } from '../lib/api'

interface Props {
  onClose: () => void
  onOpenLogs?: () => void
}

interface Task {
  id: string
  name: string
  type: 'backup' | 'update'
  enabled: boolean
  cron_expr: string
  source_path?: string | null
  dest_path?: string | null
  keep_count: number
  last_run?: string | null
  last_status?: string | null
}

const UPDATE_TARGETS = [
  { key: 'apt',      label: 'System Packages',  desc: 'apt-get upgrade (all packages)' },
  { key: 'pm2',      label: 'PM2',              desc: 'pm2 update（in-place daemon 更新，不中斷服務）' },
  { key: 'nginx',    label: 'Nginx',            desc: 'Upgrade packages and reload config' },
  { key: 'fail2ban', label: 'Fail2ban',         desc: 'Upgrade packages and restart service' },
  { key: 'mariadb',  label: 'MariaDB',          desc: 'Upgrade mariadb-server package' },
]

function parseUpdateTargets(task: Task | null): Set<string> {
  try {
    const arr = JSON.parse(task?.source_path || '[]')
    if (Array.isArray(arr) && arr.length > 0) return new Set(arr)
  } catch {}
  return new Set(['apt'])
}

const PRESETS = [
  { label: 'Daily 02:00',       value: '0 2 * * *' },
  { label: 'Daily 03:00',       value: '0 3 * * *' },
  { label: 'Weekly Sun 03:00',  value: '0 3 * * 0' },
  { label: 'Weekly Mon 02:00',  value: '0 2 * * 1' },
  { label: 'Monthly 1st 02:00', value: '0 2 1 * *' },
  { label: 'Custom',            value: 'custom' },
]

function cronLabel(expr: string) {
  return PRESETS.find(p => p.value === expr)?.label ?? expr
}

function CronPicker({ expr, onChange }: { expr: string; onChange: (v: string) => void }) {
  const isCustom = !PRESETS.slice(0, -1).some(p => p.value === expr)
  return (
    <div className="space-y-1.5">
      <select
        value={isCustom ? 'custom' : expr}
        onChange={e => onChange(e.target.value === 'custom' ? '' : e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
      >
        {PRESETS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>
      {isCustom && (
        <input
          type="text"
          value={expr}
          onChange={e => onChange(e.target.value)}
          placeholder="cron expression, e.g. 0 2 * * *"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500"
        />
      )}
    </div>
  )
}

function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return <span className="text-gray-600 text-xs">—</span>
  return status === 'success'
    ? <span className="text-xs text-green-400">✓ Success</span>
    : <span className="text-xs text-red-400">✗ Failed</span>
}

function fmtTime(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function AutomaticPanel({ onClose, onOpenLogs }: Props) {
  const [tab, setTab] = useState<'backup' | 'update'>('backup')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [runningId, setRunningId] = useState<string | null>(null)

  // ── Backup form ──────────────────────────────────────
  const [showForm, setShowForm] = useState(false)
  const [fName, setFName] = useState('')
  const [fSrc, setFSrc] = useState('/DATA')
  const [fDst, setFDst] = useState('/DATA/backups')
  const [fCron, setFCron] = useState('0 2 * * *')
  const [fKeep, setFKeep] = useState(7)
  const [saving, setSaving] = useState(false)

  // ── Update task ──────────────────────────────────────
  const [uCron, setUCron] = useState('0 3 * * 0')
  const [uTargets, setUTargets] = useState<Set<string>>(new Set(['apt']))
  const [uSaving, setUSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await apiJson<Task[]>('/api/schedule/tasks')
      setTasks(data)
      const ut = data.find(t => t.type === 'update')
      if (ut) {
        setUCron(ut.cron_expr)
        setUTargets(parseUpdateTargets(ut))
      }
    } catch { toast.error('Failed to load schedules') }
    finally { setLoading(false) }
  }

  const backupTasks = tasks.filter(t => t.type === 'backup')
  const updateTask  = tasks.find(t => t.type === 'update') ?? null

  // ── Backup actions ───────────────────────────────────
  async function addTask() {
    if (!fName.trim()) return toast.error('Please enter a job name')
    if (!fSrc.trim() || !fDst.trim()) return toast.error('Please fill in source and destination paths')
    if (!fCron) return toast.error('Please set a schedule')
    setSaving(true)
    try {
      await apiJson('/api/schedule/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fName, type: 'backup', cron_expr: fCron, source_path: fSrc, dest_path: fDst, keep_count: fKeep }),
      })
      toast.success('Backup job created')
      setShowForm(false); setFName('')
      await load()
    } catch (err) { toast.error((err as Error).message) }
    finally { setSaving(false) }
  }

  async function toggleTask(id: string, enabled: boolean) {
    try {
      await apiJson(`/api/schedule/tasks/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      })
      setTasks(prev => prev.map(t => t.id === id ? { ...t, enabled } : t))
    } catch (err) { toast.error((err as Error).message) }
  }

  async function deleteTask(id: string) {
    try {
      await apiJson(`/api/schedule/tasks/${id}`, { method: 'DELETE' })
      setTasks(prev => prev.filter(t => t.id !== id))
      toast.success('Job deleted')
    } catch (err) { toast.error((err as Error).message) }
  }

  async function runNow(id: string) {
    setRunningId(id)
    try {
      const d = await apiJson<{ message: string }>(`/api/schedule/tasks/${id}/run`, { method: 'POST' })
      toast.success(d.message)
      setTimeout(load, 3000)
    } catch (err) { toast.error((err as Error).message) }
    finally { setRunningId(null) }
  }

  // ── Update actions ───────────────────────────────────
  async function saveUpdate(enabled?: boolean) {
    if (!uCron) return toast.error('Please set a schedule')
    setUSaving(true)
    try {
      const targetsJson = JSON.stringify([...uTargets])
      if (updateTask) {
        await apiJson(`/api/schedule/tasks/${updateTask.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cron_expr: uCron, source_path: targetsJson, ...(enabled !== undefined && { enabled }) }),
        })
      } else {
        await apiJson('/api/schedule/tasks', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Auto System Update', type: 'update', cron_expr: uCron, source_path: targetsJson, enabled: enabled !== false }),
        })
      }
      toast.success('Settings saved')
      await load()
    } catch (err) { toast.error((err as Error).message) }
    finally { setUSaving(false) }
  }

  // ── Render ───────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-semibold">Schedule Manager</h2>
            {onOpenLogs && (
              <button
                onClick={onOpenLogs}
                className="text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2"
              >
                View Logs
              </button>
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

        {/* Tabs */}
        <div className="flex border-b border-gray-700 shrink-0">
          {(['backup', 'update'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                tab === t
                  ? 'text-orange-400 border-orange-400'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {t === 'backup' ? 'Scheduled Backup' : 'Auto Update'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-500 text-sm">Loading...</div>
          ) : tab === 'backup' ? (
            <BackupTab
              tasks={backupTasks}
              showForm={showForm}
              onToggleForm={() => setShowForm(v => !v)}
              fName={fName} setFName={setFName}
              fSrc={fSrc} setFSrc={setFSrc}
              fDst={fDst} setFDst={setFDst}
              fCron={fCron} setFCron={setFCron}
              fKeep={fKeep} setFKeep={setFKeep}
              saving={saving}
              onAdd={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onRun={runNow}
              runningId={runningId}
            />
          ) : (
            <UpdateTab
              task={updateTask}
              uCron={uCron} setUCron={setUCron}
              uTargets={uTargets} setUTargets={setUTargets}
              saving={uSaving}
              runningId={runningId}
              onSave={saveUpdate}
              onRun={() => updateTask && runNow(updateTask.id)}
              onToggle={en => saveUpdate(en)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Backup Tab ───────────────────────────────────────────

interface BackupTabProps {
  tasks: Task[]
  showForm: boolean
  onToggleForm: () => void
  fName: string; setFName: (v: string) => void
  fSrc: string; setFSrc: (v: string) => void
  fDst: string; setFDst: (v: string) => void
  fCron: string; setFCron: (v: string) => void
  fKeep: number; setFKeep: (v: number) => void
  saving: boolean
  onAdd: () => void
  onToggle: (id: string, en: boolean) => void
  onDelete: (id: string) => void
  onRun: (id: string) => void
  runningId: string | null
}

function BackupTab({ tasks, showForm, onToggleForm, fName, setFName, fSrc, setFSrc, fDst, setFDst, fCron, setFCron, fKeep, setFKeep, saving, onAdd, onToggle, onDelete, onRun, runningId }: BackupTabProps) {
  return (
    <div className="space-y-4">
      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={onToggleForm}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Backup Job
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-gray-300">Add Backup Job</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Job Name</label>
              <input
                type="text"
                value={fName}
                onChange={e => setFName(e.target.value)}
                placeholder="e.g. Daily Backup"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Retain Copies</label>
              <input
                type="number"
                value={fKeep}
                onChange={e => setFKeep(Number(e.target.value))}
                min={1} max={99}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Source Path</label>
              <input
                type="text"
                value={fSrc}
                onChange={e => setFSrc(e.target.value)}
                placeholder="/DATA"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Destination Path</label>
              <input
                type="text"
                value={fDst}
                onChange={e => setFDst(e.target.value)}
                placeholder="/DATA/backups"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Schedule</label>
            <CronPicker expr={fCron} onChange={setFCron} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onToggleForm}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={saving}
              className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              {saving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="text-center py-16 text-gray-600 text-sm">No backup jobs yet</div>
      ) : (
        <div className="space-y-2">
          {tasks.map(t => (
            <div key={t.id} className={`bg-gray-800 border rounded-xl p-4 transition-colors ${t.enabled ? 'border-gray-700' : 'border-gray-700/50 opacity-60'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium text-sm">{t.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${t.enabled ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                      {t.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs text-gray-500 space-y-0.5">
                    <div className="font-mono">{t.source_path} → {t.dest_path}</div>
                    <div>{cronLabel(t.cron_expr)} / Keep {t.keep_count} copies</div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span>Last run: {fmtTime(t.last_run)}</span>
                      <StatusBadge status={t.last_status} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onRun(t.id)}
                    disabled={runningId === t.id}
                    title="Run Now"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-400 hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    {runningId === t.id
                      ? <span className="text-xs animate-spin">◌</span>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" /></svg>}
                  </button>
                  <button
                    onClick={() => onToggle(t.id, !t.enabled)}
                    title={t.enabled ? 'Disable' : 'Enable'}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {t.enabled
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />}
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    title="Delete"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Update Tab ───────────────────────────────────────────

interface UpdateTabProps {
  task: Task | null
  uCron: string; setUCron: (v: string) => void
  uTargets: Set<string>; setUTargets: (fn: (prev: Set<string>) => Set<string>) => void
  saving: boolean
  runningId: string | null
  onSave: (enabled?: boolean) => void
  onRun: () => void
  onToggle: (en: boolean) => void
}

function UpdateTab({ task, uCron, setUCron, uTargets, setUTargets, saving, runningId, onSave, onRun, onToggle }: UpdateTabProps) {
  const enabled = task?.enabled ?? false

  function toggleTarget(key: string, checked: boolean) {
    setUTargets(prev => {
      const next = new Set(prev)
      if (checked) { next.add(key) } else { next.delete(key) }
      return next
    })
  }

  return (
    <div className="max-w-lg space-y-4">
      {/* Info card */}
      <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-4 text-sm text-blue-300">
        Runs selected updates. Requires <code className="font-mono bg-blue-900/40 px-1 rounded">sudo NOPASSWD</code> configured on the Pi.
      </div>

      {/* Update targets */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Update Items</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {UPDATE_TARGETS.map(t => (
            <label
              key={t.key}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors ${
                uTargets.has(t.key) ? 'bg-orange-900/20 border border-orange-700/40' : 'bg-gray-900/60 border border-gray-700/40 hover:border-gray-600'
              }`}
            >
              <input
                type="checkbox"
                checked={uTargets.has(t.key)}
                onChange={e => toggleTarget(t.key, e.target.checked)}
                className="mt-0.5 accent-orange-500 cursor-pointer"
              />
              <div className="min-w-0">
                <p className="text-sm text-white font-medium">{t.label}</p>
                <p className="text-xs text-gray-500 font-mono">{t.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {uTargets.size === 0 && (
          <p className="text-xs text-yellow-500">Please select at least one update item</p>
        )}
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-4">
        {/* Status row */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-white text-sm font-medium">Auto System Update</p>
            {task ? (
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                Last run: {fmtTime(task.last_run)}
                <StatusBadge status={task.last_status} />
              </p>
            ) : (
              <p className="text-xs text-gray-600 mt-0.5">No schedule set</p>
            )}
          </div>
          {/* Enable / Disable button group */}
          <div className="flex shrink-0 rounded-lg border border-gray-600 overflow-hidden text-xs font-medium">
            <button
              onClick={() => onToggle(true)}
              disabled={saving}
              className={`px-3 py-1.5 transition-colors ${enabled ? 'bg-orange-600 text-white' : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              Enable
            </button>
            <button
              onClick={() => onToggle(false)}
              disabled={saving}
              className={`px-3 py-1.5 border-l border-gray-600 transition-colors ${!enabled && task ? 'bg-gray-600 text-white' : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              Disable
            </button>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Run Schedule</label>
          <CronPicker expr={uCron} onChange={setUCron} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onSave()}
            disabled={saving || uTargets.size === 0}
            className="flex-1 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            onClick={onRun}
            disabled={!task || runningId === task?.id}
            title={!task ? 'Please save settings first' : 'Run once now'}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            {runningId === task?.id
              ? <><span className="animate-spin leading-none">◌</span><span>Running</span></>
              : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" /></svg><span>Run Now</span></>
            }
          </button>
        </div>
      </div>
    </div>
  )
}
