import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useLang } from '../context/LangContext'
import { apiJson } from '../lib/api'

interface Share {
  id: number
  token: string
  file_path: string
  is_folder: number
  permission: 'edit' | 'view' | 'download'
  one_time: number
  used: number
  created_at: string
  expires_at: string | null
}

interface Props {
  filePath: string
  fileName: string
  isFolder: boolean
  onClose: () => void
}

function shareUrl(token: string) {
  return `${window.location.origin}/share/${token}`
}

function CopyBtn({ text }: { text: string }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
      className="text-xs px-2 py-1 rounded bg-gray-600 hover:bg-gray-500 text-gray-200 transition-colors shrink-0"
    >
      {copied ? t.copiedBtn : t.copyBtn}
    </button>
  )
}

export default function ShareDialog({ filePath, fileName, isFolder, onClose }: Props) {
  const { t } = useLang()
  const [shares, setShares] = useState<Share[]>([])
  const [tab, setTab] = useState<'create' | 'manage'>('create')
  const [permission, setPermission] = useState<'view' | 'download' | 'edit'>('view')
  const [usePassword, setUsePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [oneTime, setOneTime] = useState(false)
  const [expiresIn, setExpiresIn] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [newToken, setNewToken] = useState<string | null>(null)

  const existingShares = shares.filter(s => s.file_path === filePath)

  useEffect(() => {
    apiJson<{ shares: Share[] }>('/api/shares').then(d => setShares(d.shares)).catch(() => {})
  }, [])

  async function handleCreate() {
    if (usePassword && !password.trim()) { toast.error(t.enterPwdFirst); return }
    setCreating(true)
    try {
      const { token } = await apiJson<{ token: string }>('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, permission, password: usePassword ? password : undefined, oneTime, expiresIn }),
      })
      setNewToken(token)
      const data = await apiJson<{ shares: Share[] }>('/api/shares')
      setShares(data.shares)
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? t.folderCreateFailed)
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(token: string) {
    if (!confirm(t.revokeConfirm)) return
    try {
      await apiJson(`/api/shares/${token}`, { method: 'DELETE' })
      toast.success(t.revokedMsg)
      setShares(prev => prev.filter(s => s.token !== token))
      if (newToken === token) setNewToken(null)
    } catch { toast.error(t.revokeFailed) }
  }

  const permLabels = { view: t.permView, download: t.permDownload, edit: t.permEdit }
  const permColors = { view: 'text-blue-400', download: 'text-green-400', edit: 'text-orange-400' }

  const permDesc = {
    view: t.descView,
    download: t.descDownload,
    edit: isFolder ? t.descEditFolder : t.descEditFile,
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div className="min-w-0">
            <p className="font-semibold text-white">{t.shareTitle}</p>
            <p className="text-xs text-gray-400 truncate">{fileName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl shrink-0 ml-3">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {(['create', 'manage'] as const).map(tb => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === tb ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'}`}
            >
              {tb === 'create' ? t.createShareTab : t.manageShareTab(existingShares.length)}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {tab === 'create' && (
            <div className="space-y-4">
              {/* Permission */}
              <div>
                <p className="text-xs text-gray-400 mb-2">{t.accessPerm}</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['view', 'download', 'edit'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setPermission(p)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${permission === p ? 'border-orange-400 bg-orange-400/10 text-orange-400' : 'border-gray-600 text-gray-400 hover:border-gray-500'}`}
                    >
                      {permLabels[p]}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1.5">{permDesc[permission]}</p>
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={usePassword} onChange={e => setUsePassword(e.target.checked)} className="accent-orange-400" />
                  <span className="text-sm text-gray-300">{t.pwdProtect}</span>
                </label>
                {usePassword && (
                  <input
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={t.enterSharePwd}
                    className="mt-2 w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  />
                )}
              </div>

              {/* One-time */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={oneTime} onChange={e => setOneTime(e.target.checked)} className="accent-orange-400" />
                  <span className="text-sm text-gray-300">{t.oneTime}</span>
                </label>
              </div>

              {/* Expiry */}
              <div>
                <p className="text-xs text-gray-400 mb-1.5">{t.expiry}</p>
                <select
                  value={expiresIn ?? ''}
                  onChange={e => setExpiresIn(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                >
                  <option value="">{t.expNever}</option>
                  <option value={86400}>{t.exp1d}</option>
                  <option value={259200}>{t.exp3d}</option>
                  <option value={604800}>{t.exp7d}</option>
                  <option value={2592000}>{t.exp30d}</option>
                </select>
              </div>

              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-colors disabled:opacity-50"
              >
                {creating ? t.creating : t.createLinkBtn}
              </button>

              {newToken && (
                <div className="bg-gray-900 rounded-xl p-3 space-y-2">
                  <p className="text-xs text-green-400 font-medium">{t.linkCreated}</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-orange-300 flex-1 truncate select-all">{shareUrl(newToken)}</code>
                    <CopyBtn text={shareUrl(newToken)} />
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'manage' && (
            <div className="space-y-3">
              {existingShares.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-6">{t.noLinks}</p>
              ) : existingShares.map(s => (
                <div key={s.token} className="bg-gray-900 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium ${permColors[s.permission]}`}>{permLabels[s.permission]}</span>
                      {s.one_time && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${s.used ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {s.used ? t.usedLabel : t.oneTimeLabel}
                        </span>
                      )}
                      {s.expires_at && (
                        <span className="text-xs text-gray-500">
                          {new Date(s.expires_at) < new Date()
                            ? t.expiredLabel
                            : t.expiresOn(new Date(s.expires_at).toLocaleDateString())}
                        </span>
                      )}
                    </div>
                    <button onClick={() => handleRevoke(s.token)} className="text-xs text-red-400 hover:text-red-300 shrink-0 transition-colors">
                      {t.revokeBtn}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-orange-300 flex-1 truncate select-all">{shareUrl(s.token)}</code>
                    <CopyBtn text={shareUrl(s.token)} />
                  </div>
                  <p className="text-xs text-gray-600">{t.createdAt} {new Date(s.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
