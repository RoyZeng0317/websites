import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiJson } from '../lib/api'

interface SystemInfo {
  hostname: string
  ip: string
  uptime: number
  memory: { total: number; free: number }
  disk: { total: number; used: number; free: number } | null
}
interface Services { ftp: boolean; sftp: boolean; samba: boolean; webdav: boolean }

interface Device {
  id: string
  name: string
  ip: string
  port: string
  note: string
  addedAt: number
}

const DEVICES_KEY = 'vaultix_devices'

function loadDevices(): Device[] {
  try { return JSON.parse(localStorage.getItem(DEVICES_KEY) ?? '[]') } catch { return [] }
}
function saveDevices(list: Device[]) {
  localStorage.setItem(DEVICES_KEY, JSON.stringify(list))
}

function bytes(n: number) {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)} TB`
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} GB`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} MB`
  return `${(n / 1e3).toFixed(0)} KB`
}

function uptime(s: number) {
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function Badge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-400' : 'bg-gray-500'}`} />
      {active ? 'Running' : 'Stopped'}
    </span>
  )
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        <code className="text-xs text-orange-300 bg-gray-900 px-2 py-1 rounded flex-1 truncate select-all">{value}</code>
        <button
          onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
          className="text-xs text-gray-500 hover:text-white shrink-0 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

// ── Add Device Modal ──────────────────────────────────────────────────────────

const EMPTY_FORM = { name: '', ip: '', port: '', note: '' }

function AddDeviceModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Device
  onSave: (d: Omit<Device, 'id' | 'addedAt'>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(
    initial ? { name: initial.name, ip: initial.ip, port: initial.port, note: initial.note } : EMPTY_FORM
  )
  const [ipErr, setIpErr] = useState('')

  function set(k: keyof typeof EMPTY_FORM, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    if (k === 'ip') setIpErr('')
  }

  function submit() {
    const ip = form.ip.trim()
    if (!ip) { setIpErr('Please enter an IP address'); return }
    // basic IP / hostname validation
    const ipRe = /^(\d{1,3}\.){3}\d{1,3}$|^[a-zA-Z0-9]([a-zA-Z0-9\-]*\.?)+[a-zA-Z0-9]$/
    if (!ipRe.test(ip)) { setIpErr('Invalid format, please enter a valid IP or hostname'); return }
    onSave({ name: form.name.trim() || ip, ip, port: form.port.trim(), note: form.note.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <p className="font-semibold text-white">{initial ? 'Edit Device' : 'Add Device'}</p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* IP */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">IP Address / Hostname <span className="text-red-400">*</span></label>
            <input
              value={form.ip}
              onChange={e => set('ip', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="192.168.1.100"
              autoFocus
              className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none transition-colors ${
                ipErr ? 'border-red-500 focus:border-red-400' : 'border-gray-700 focus:border-orange-500'
              }`}
            />
            {ipErr && <p className="text-xs text-red-400 mt-1">{ipErr}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Device Name (optional)</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="My NAS, Pi Server…"
              className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Port */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Primary Port (optional)</label>
            <input
              value={form.port}
              onChange={e => set('port', e.target.value.replace(/\D/g, ''))}
              placeholder="3000"
              className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Notes (optional)</label>
            <input
              value={form.note}
              onChange={e => set('note', e.target.value)}
              placeholder="Describe usage or location…"
              className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors">
            Cancel
          </button>
          <button onClick={submit}
            className="flex-1 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors">
            {initial ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Device Card ───────────────────────────────────────────────────────────────

function DeviceCard({ device, onEdit, onDelete }: { device: Device; onEdit: () => void; onDelete: () => void }) {
  const [copied, setCopied] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  const base = device.port ? `http://${device.ip}:${device.port}` : `http://${device.ip}`

  const links = [
    { label: 'HTTP', href: base },
    { label: 'SSH', href: `ssh://root@${device.ip}` },
    { label: 'SMB', href: `smb://${device.ip}` },
    { label: 'FTP', href: `ftp://${device.ip}` },
  ]

  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-white text-sm truncate">{device.name}</p>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            {device.ip}{device.port ? `:${device.port}` : ''}
          </p>
          {device.note && <p className="text-xs text-gray-500 mt-0.5 truncate">{device.note}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => { navigator.clipboard.writeText(device.ip); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
            className="text-xs text-gray-500 hover:text-orange-400 transition-colors px-2 py-1 rounded"
          >
            {copied ? '✓' : 'Copy IP'}
          </button>
          <button onClick={onEdit}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:text-white hover:bg-gray-700 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          {confirmDel ? (
            <>
              <button onClick={onDelete}
                className="text-xs text-red-400 hover:text-red-300 transition-colors px-1.5 py-1 rounded">Confirm</button>
              <button onClick={() => setConfirmDel(false)}
                className="text-xs text-gray-500 hover:text-white transition-colors px-1.5 py-1 rounded">Cancel</button>
            </>
          ) : (
            <button onClick={() => setConfirmDel(true)}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:text-red-400 hover:bg-gray-700 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="flex gap-1.5 flex-wrap">
        {links.map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
            className="text-xs px-2.5 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors font-mono">
            {l.label}
          </a>
        ))}
        {device.port && (
          <a href={base} target="_blank" rel="noopener noreferrer"
            className="text-xs px-2.5 py-1 rounded-md bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 transition-colors">
            Open :{device.port}
          </a>
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function System() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [info, setInfo] = useState<SystemInfo | null>(null)
  const [svcs, setSvcs] = useState<Services | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [err, setErr] = useState('')

  const [devices, setDevices] = useState<Device[]>(loadDevices)
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<Device | null>(null)

  useEffect(() => { if (user && user.role !== 'admin') navigate('/') }, [user, navigate])

  const refresh = useCallback(() => {
    apiJson<SystemInfo>('/api/system/info').then(setInfo).catch(() => {})
    apiJson<Services>('/api/system/services').then(setSvcs).catch(() => {})
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function toggle(svcKey: keyof Services, apiName: string, active: boolean) {
    setToggling(svcKey)
    setErr('')
    try {
      await apiJson(`/api/system/services/${apiName}/${active ? 'stop' : 'start'}`, { method: 'POST' })
      setSvcs(prev => prev ? { ...prev, [svcKey]: !active } : null)
    } catch {
      setErr(`Operation failed. Please ensure ${apiName} is installed on the Raspberry Pi and sudoers is configured.`)
    } finally {
      setToggling(null)
    }
  }

  function addDevice(data: Omit<Device, 'id' | 'addedAt'>) {
    const updated = [...devices, { ...data, id: crypto.randomUUID(), addedAt: Date.now() }]
    setDevices(updated)
    saveDevices(updated)
    setShowAdd(false)
  }

  function editDevice(data: Omit<Device, 'id' | 'addedAt'>) {
    if (!editTarget) return
    const updated = devices.map(d => d.id === editTarget.id ? { ...d, ...data } : d)
    setDevices(updated)
    saveDevices(updated)
    setEditTarget(null)
  }

  function deleteDevice(id: string) {
    const updated = devices.filter(d => d.id !== id)
    setDevices(updated)
    saveDevices(updated)
  }

  const ip = info?.ip ?? '192.168.199.108'

  const services = [
    {
      key: 'ftp' as const,
      apiName: 'vsftpd',
      label: 'FTP',
      port: 21,
      active: svcs?.ftp ?? false,
      controllable: true,
      connections: [
        { label: 'FTP Address', value: `ftp://${ip}` },
        { label: 'FileZilla Config', value: `Host: ${ip}  Port: 21  Protocol: FTP` },
      ],
      note: 'Run setup-services.sh first; use NAS credentials to log in',
    },
    {
      key: 'sftp' as const,
      apiName: '',
      label: 'SFTP',
      port: 22,
      active: svcs?.sftp ?? true,
      controllable: false,
      connections: [
        { label: 'SFTP URL', value: `sftp://${ip}` },
        { label: 'FileZilla Config', value: `Host: sftp://${ip}  Port: 22` },
      ],
      note: 'Via SSH, enabled by default; use Raspberry Pi system account (roy)',
    },
    {
      key: 'samba' as const,
      apiName: 'smbd',
      label: 'Samba / SMB',
      port: 445,
      active: svcs?.samba ?? false,
      controllable: true,
      connections: [
        { label: 'Windows Mount', value: `\\\\${ip}` },
        { label: 'macOS / Linux', value: `smb://${ip}` },
      ],
      note: 'Run setup-services.sh first; Windows: Explorer → "Map Network Drive"',
    },
    {
      key: 'webdav' as const,
      apiName: '',
      label: 'WebDAV',
      port: 3000,
      active: svcs?.webdav ?? true,
      controllable: false,
      connections: [
        { label: 'WebDAV URL', value: `http://${ip}:3000/webdav` },
        { label: 'Windows Mount', value: `http://${ip}:3000/webdav` },
      ],
      note: 'Built into NAS backend; use NAS credentials. Windows: "Add network location" → enter URL',
    },
  ]

  return (
    <div className="min-h-dvh flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <button onClick={() => navigate('/settings')} className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-orange-400">System Settings</h1>
        <button onClick={refresh} className="text-sm text-gray-400 hover:text-white transition-colors">Refresh</button>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-5">
        {err && <div className="bg-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg">{err}</div>}

        {/* System Info */}
        <section className="bg-gray-800 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-orange-400">System Info</h2>
          {info ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-gray-400 mb-0.5">Hostname</p><p className="font-mono">{info.hostname}</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">IP Address</p><p className="font-mono">{info.ip}</p></div>
              <div><p className="text-xs text-gray-400 mb-0.5">Uptime</p><p>{uptime(info.uptime)}</p></div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Memory</p>
                <p>{bytes(info.memory.total - info.memory.free)} / {bytes(info.memory.total)}</p>
                <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden w-24">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${((info.memory.total - info.memory.free) / info.memory.total) * 100}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 animate-pulse">Loading…</p>
          )}
        </section>

        {/* Disk */}
        {info?.disk && (
          <section className="bg-gray-800 rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-orange-400">Storage</h2>
            <div className="flex justify-between text-sm mb-1">
              <span>{bytes(info.disk.used)} <span className="text-gray-400">used</span></span>
              <span className="text-gray-400">{bytes(info.disk.free)} free / {bytes(info.disk.total)} total</span>
            </div>
            <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${(info.disk.used / info.disk.total) > 0.85 ? 'bg-red-500' : 'bg-orange-400'}`}
                style={{ width: `${(info.disk.used / info.disk.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-right">{((info.disk.used / info.disk.total) * 100).toFixed(1)}% used</p>
          </section>
        )}

        {/* Network Services */}
        <div>
          <h2 className="font-semibold text-orange-400 mb-3 px-1">Network Services</h2>
          <div className="space-y-3">
            {services.map(svc => (
              <div key={svc.key} className="bg-gray-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{svc.label}</span>
                    <span className="text-xs text-gray-500">:{svc.port}</span>
                    <Badge active={svc.active} />
                  </div>
                  {svc.controllable && (
                    <button
                      onClick={() => toggle(svc.key, svc.apiName, svc.active)}
                      disabled={toggling === svc.key}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                        svc.active
                          ? 'bg-gray-700 hover:bg-red-600/80 text-gray-300 hover:text-white'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      {toggling === svc.key ? '…' : svc.active ? 'Stop Service' : 'Start Service'}
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {svc.connections.map(c => <CopyRow key={c.label} label={c.label} value={c.value} />)}
                </div>
                <p className="text-xs text-gray-500">{svc.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-semibold text-orange-400">Saved Devices</h2>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Device
            </button>
          </div>

          {devices.length === 0 ? (
            <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-8 text-center">
              <svg className="w-8 h-8 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
              </svg>
              <p className="text-sm text-gray-500">No devices added yet</p>
              <p className="text-xs text-gray-600 mt-1">Click "Add Device" in the top right to add a device by IP address</p>
            </div>
          ) : (
            <div className="space-y-3">
              {devices.map(d => (
                <DeviceCard
                  key={d.id}
                  device={d}
                  onEdit={() => setEditTarget(d)}
                  onDelete={() => deleteDevice(d.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showAdd && (
        <AddDeviceModal onSave={addDevice} onClose={() => setShowAdd(false)} />
      )}
      {editTarget && (
        <AddDeviceModal initial={editTarget} onSave={editDevice} onClose={() => setEditTarget(null)} />
      )}
    </div>
  )
}
