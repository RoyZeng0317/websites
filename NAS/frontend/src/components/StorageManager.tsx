import { useEffect, useState } from 'react'
import { apiJson } from '../lib/api'

interface BlockDevice {
  name: string
  size: string
  type: string
  mountpoint: string | null
  fstype: string | null
  label: string | null
  uuid: string | null
  children?: BlockDevice[]
}

interface LsblkResult {
  blockdevices: BlockDevice[]
}

interface Props {
  onClose: () => void
}

// Raspberry Pi system disk prefixes (SD card, eMMC only)
const SYSTEM_PREFIXES = ['mmcblk0', 'mmcblk1']
function isSystemDisk(name: string) {
  return SYSTEM_PREFIXES.some(p => name === p || name.startsWith(p + 'p'))
}

export default function StorageManager({ onClose }: Props) {
  const [data, setData] = useState<BlockDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [mountNames, setMountNames] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState('')
  const [renamingPart, setRenamingPart] = useState<string | null>(null)
  const [renameInput, setRenameInput] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await apiJson<LsblkResult>('/api/system/disks')
      setData(res.blockdevices ?? [])
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function getPartitions(dev: BlockDevice): BlockDevice[] {
    const parts: BlockDevice[] = []
    for (const c of dev.children ?? []) {
      if (c.type === 'part') parts.push(c)
      parts.push(...getPartitions(c))
    }
    // If no children partitions, treat disk itself as mountable
    if (parts.length === 0 && dev.type === 'disk') parts.push(dev)
    return parts
  }

  // Show all non-system disks and top-level partitions (sda, sda1, sdb, nvme, etc.)
  const mountableDisks = data.filter(d =>
    (d.type === 'disk' || d.type === 'part') && !isSystemDisk(d.name)
  )

  async function mount(partName: string, existingMountpoint?: string | null) {
    const folderName = (mountNames[partName] ?? partName).trim()
    if (!folderName) { setMsg('Please enter a folder name'); return }
    setBusy(partName)
    setMsg('')
    try {
      await apiJson('/api/system/disks/mount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pass existingMountpoint so backend can use --bind if already mounted elsewhere
        body: JSON.stringify({ device: `/dev/${partName}`, folderName, bindSource: existingMountpoint ?? null }),
      })
      setMsg(`✓ Mounted /dev/${partName} in NAS. Refresh the file list to see it.`)
      await load()
    } catch (e: unknown) {
      setMsg(`✗ ${(e as Error).message}`)
    } finally {
      setBusy(null)
    }
  }

  async function renameFolder(partName: string, oldName: string, newName: string) {
    if (!newName.trim()) return
    setBusy(partName)
    setMsg('')
    try {
      await apiJson('/api/system/disks/rename-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName: oldName.trim(), newName: newName.trim() }),
      })
      setMsg(`✓ 已將 "${oldName}" 重新命名為 "${newName.trim()}"（如有掛載已自動重新掛載）`)
      setRenamingPart(null)
      setMountNames(prev => ({ ...prev, [partName]: newName.trim() }))
      await load()
    } catch (e: unknown) {
      setMsg(`✗ ${(e as Error).message}`)
    } finally {
      setBusy(null)
    }
  }

  async function umount(partName: string, nasFolder: string) {
    setBusy(partName)
    setMsg('')
    try {
      await apiJson('/api/system/disks/umount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderName: nasFolder }),
      })
      setMsg(`✓ Removed ${nasFolder} from NAS`)
      await load()
    } catch (e: unknown) {
      setMsg(`✗ ${(e as Error).message}`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-1 5a1 1 0 110 2 1 1 0 010-2z" />
            </svg>
            <span className="text-white font-semibold">Disk Manager / Storage Manager</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading && (
            <div className="text-center text-gray-400 py-8">
              <div className="inline-block w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-sm">Detecting devices…</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">
              <p className="font-medium mb-1">Cannot read disk info</p>
              <p className="text-xs font-mono">{error}</p>
            </div>
          )}

          {!loading && !error && mountableDisks.length === 0 && (
            <div className="text-center text-gray-500 py-8 text-sm space-y-1">
              <p>No external devices detected</p>
              <p className="text-xs text-gray-600">Please check the device is connected to the Raspberry Pi</p>
              <p className="text-xs text-gray-600">
                System disks ({SYSTEM_PREFIXES.join(', ')} prefix) are excluded
              </p>
            </div>
          )}

          {!loading && mountableDisks.map(disk => {
            const parts = getPartitions(disk)
            return (
              <div key={disk.name} className="bg-gray-800 rounded-lg overflow-hidden">
                {/* Disk header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-1 5a1 1 0 110 2 1 1 0 010-2z" />
                  </svg>
                  <div>
                    <p className="text-white text-sm font-medium">/dev/{disk.name}</p>
                    <p className="text-gray-500 text-xs">{disk.size}</p>
                  </div>
                  <span className="ml-auto text-xs bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded">External</span>
                </div>

                {/* Partitions */}
                {parts.map(part => {
                  const sysMount = part.mountpoint  // where system already mounted it (may be null)
                  const defaultName = mountNames[part.name] ?? part.label ?? part.name
                  return (
                    <div key={part.name} className="px-4 py-3 border-t border-gray-700/50 space-y-2">
                      {/* Partition info */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {renamingPart === part.name ? (
                            /* Inline rename form */
                            <div className="flex items-center gap-2">
                              <input
                                autoFocus
                                type="text"
                                value={renameInput}
                                onChange={e => setRenameInput(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') renameFolder(part.name, defaultName, renameInput)
                                  if (e.key === 'Escape') setRenamingPart(null)
                                }}
                                placeholder={`新名稱（目前：${defaultName}）`}
                                className="flex-1 bg-gray-700 border border-blue-500 rounded px-2 py-1 text-white text-xs focus:outline-none"
                              />
                              <button
                                onClick={() => renameFolder(part.name, defaultName, renameInput)}
                                disabled={busy === part.name}
                                className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
                              >
                                {busy === part.name ? '…' : '確認'}
                              </button>
                              <button
                                onClick={() => setRenamingPart(null)}
                                className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
                              >
                                取消
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-white text-sm">/dev/{part.name}</p>
                              {part.label && <span className="text-gray-400 text-xs">({part.label})</span>}
                              <button
                                onClick={() => { setRenamingPart(part.name); setRenameInput(part.label ?? '') }}
                                title="重新命名磁碟標籤"
                                className="text-gray-600 hover:text-blue-400 transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                </svg>
                              </button>
                            </div>
                          )}
                          <p className="text-gray-500 text-xs mt-0.5">
                            {part.size} · {part.fstype ?? 'Unknown format'}
                          </p>
                          {sysMount && (
                            <p className="text-yellow-400 text-xs mt-0.5">
                              System mounted at {sysMount}
                            </p>
                          )}
                        </div>
                        {/* Status badge */}
                        {renamingPart !== part.name && (sysMount
                          ? <span className="shrink-0 text-xs bg-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded">Mounted</span>
                          : <span className="shrink-0 text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">Not mounted</span>
                        )}
                      </div>

                      {/* Action row: folder name input + button */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="NAS folder name"
                          value={defaultName}
                          onChange={e => setMountNames(prev => ({ ...prev, [part.name]: e.target.value }))}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => mount(part.name, sysMount)}
                          disabled={busy === part.name}
                          className="shrink-0 text-xs px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-50 whitespace-nowrap"
                        >
                          {busy === part.name ? '…' : sysMount ? 'Add to NAS' : 'Mount to NAS'}
                        </button>
                      </div>
                      {sysMount && (
                        <p className="text-gray-600 text-xs">
                          System-mounted. Click "Add to NAS" to access it in the file list.
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}

          {msg && (
            <div className={`text-sm px-4 py-3 rounded-lg ${msg.startsWith('✓')
              ? 'bg-green-900/30 border border-green-700 text-green-300'
              : 'bg-red-900/30 border border-red-700 text-red-300'}`}>
              {msg}
            </div>
          )}

          {/* Setup note */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-xs text-gray-500 space-y-1.5">
            <p className="text-gray-400 font-medium">If mounting fails, check sudo permissions on the Raspberry Pi:</p>
            <code className="block text-green-400 bg-black/30 px-2 py-1 rounded break-all">
              echo "roy ALL=(ALL) NOPASSWD: /bin/mount, /bin/umount" | sudo tee /etc/sudoers.d/casaos-mount
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-700 flex justify-between items-center shrink-0">
          <button
            onClick={load}
            disabled={loading}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rescan
          </button>
          <button
            onClick={onClose}
            className="text-sm px-4 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
