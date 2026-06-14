import { useEffect, useRef, useState, useCallback } from 'react'
import { apiJson, apiFetch, getToken } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const BACKEND = import.meta.env.VITE_BACKEND_URL

interface UserRow {
  id: number
  username: string
  display_name: string | null
  role: 'admin' | 'user'
  disabled: number
  avatar_ext: string | null
  is_temporary: number
  temp_expires_at: string | null
  temp_login_used: number
}

interface Props {
  onClose: () => void
}

function avatarUrl(u: UserRow, bust?: number) {
  if (!u.avatar_ext) return null
  return `${BACKEND}/api/avatars/${u.username}${bust ? `?t=${bust}` : ''}`
}

function AvatarCircle({ u, size = 10, bust }: { u: UserRow; size?: number; bust?: number }) {
  const [err, setErr] = useState(false)
  const src = avatarUrl(u, bust)
  useEffect(() => setErr(false), [src])
  const dim = `w-${size} h-${size}`
  if (src && !err) {
    return (
      <img
        src={src}
        onError={() => setErr(true)}
        className={`${dim} rounded-full object-cover shrink-0 border border-gray-700`}
        alt={u.username}
      />
    )
  }
  return (
    <div className={`${dim} rounded-full bg-orange-600 flex items-center justify-center shrink-0 text-white font-bold text-sm border border-gray-700`}>
      {(u.display_name || u.username).charAt(0).toUpperCase()}
    </div>
  )
}

type ExpiryOption = 'none' | '15' | '30' | '60' | 'custom'

function formatRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return '已過期'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} 分鐘後到期`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h} 小時後到期` : `${h} 小時 ${m} 分後到期`
}

function AddUserDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (u: UserRow) => void }) {
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [isTemporary, setIsTemporary] = useState(false)
  const [expiryOption, setExpiryOption] = useState<ExpiryOption>('60')
  const [customMinutes, setCustomMinutes] = useState(120)
  const [busy, setBusy] = useState(false)

  function getExpiryMinutes(): number | null {
    if (!isTemporary) return null
    if (expiryOption === 'none') return null
    if (expiryOption === '15') return 15
    if (expiryOption === '30') return 30
    if (expiryOption === '60') return 60
    return customMinutes > 0 ? customMinutes : null
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      const tempExpiryMinutes = getExpiryMinutes()
      const res = await apiJson<{ user: UserRow }>('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          displayName: displayName || undefined,
          password,
          role,
          isTemporary,
          tempExpiryMinutes,
        }),
      })
      toast.success(`已新增${isTemporary ? '臨時' : ''}使用者：${res.user.username}`)
      onCreated(res.user)
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form onSubmit={submit} className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-3">
        <p className="text-white font-semibold text-base">新增使用者</p>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">帳號 *</label>
          <input autoFocus value={username} onChange={e => setUsername(e.target.value)} required
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            placeholder="英數字、底線（2-32字）" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">顯示名稱</label>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            placeholder="留空則使用帳號名稱" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">密碼 * (最少8字元)</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" />
        </div>

        {!isTemporary && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">角色</label>
            <select value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500">
              <option value="user">一般使用者</option>
              <option value="admin">管理員</option>
            </select>
          </div>
        )}

        {/* 臨時使用者開關 */}
        <label className="flex items-center gap-2 cursor-pointer select-none py-1">
          <input type="checkbox" checked={isTemporary} onChange={e => setIsTemporary(e.target.checked)}
            className="w-4 h-4 accent-yellow-500" />
          <span className="text-sm text-gray-200 font-medium">臨時使用者</span>
          <span className="text-xs text-gray-500">（僅能登入一次）</span>
        </label>

        {/* 時效設定 */}
        {isTemporary && (
          <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-3 flex flex-col gap-2">
            <label className="text-xs text-yellow-300 font-medium">帳號時效</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['none', '15', '30', '60', 'custom'] as ExpiryOption[]).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setExpiryOption(opt)}
                  className={`text-xs py-1.5 px-2 rounded-lg border transition-colors ${
                    expiryOption === opt
                      ? 'bg-yellow-600 border-yellow-500 text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-yellow-600'
                  } ${opt === 'custom' ? 'col-span-2' : ''}`}
                >
                  {opt === 'none' && '無時效'}
                  {opt === '15' && '15 分鐘'}
                  {opt === '30' && '30 分鐘'}
                  {opt === '60' && '1 小時'}
                  {opt === 'custom' && '自訂時效'}
                </button>
              ))}
            </div>
            {expiryOption === 'custom' && (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  min={1}
                  max={10080}
                  value={customMinutes}
                  onChange={e => setCustomMinutes(Number(e.target.value))}
                  className="w-24 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-yellow-500"
                />
                <span className="text-xs text-gray-400">分鐘（最多 7 天）</span>
              </div>
            )}
            <p className="text-[11px] text-yellow-400/80 mt-0.5">
              {expiryOption === 'none'
                ? '帳號永久有效，但登入後即無法再次使用'
                : `帳號建立後 ${expiryOption === 'custom' ? `${customMinutes} 分鐘` : expiryOption === '60' ? '1 小時' : `${expiryOption} 分鐘`}內可使用一次`}
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-1">
          <button type="submit" disabled={busy}
            className="flex-1 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {busy ? '建立中…' : '建立'}
          </button>
          <button type="button" onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors">
            取消
          </button>
        </div>
      </form>
    </div>
  )
}

function EditUserDialog({ user, onClose, onSaved }: { user: UserRow; onClose: () => void; onSaved: (u: UserRow) => void }) {
  const [displayName, setDisplayName] = useState(user.display_name ?? '')
  const [username, setUsername] = useState(user.username)
  const [role, setRole] = useState(user.role)
  const [disabled, setDisabled] = useState(!!user.disabled)
  const [newPwd, setNewPwd] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      const body: Record<string, unknown> = { username, displayName, role, disabled }
      if (newPwd) body.password = newPwd
      const res = await apiJson<{ user: UserRow }>(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      toast.success('已更新')
      onSaved(res.user)
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form onSubmit={submit} className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-3">
        <p className="text-white font-semibold text-base">編輯使用者</p>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">帳號</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">顯示名稱</label>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            placeholder="留空則使用帳號名稱" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">新密碼（留空不更改）</label>
          <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            placeholder="最少 8 字元" />
        </div>
        {!user.is_temporary && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">角色</label>
            <select value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500">
              <option value="user">一般使用者</option>
              <option value="admin">管理員</option>
            </select>
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)}
            className="w-4 h-4 accent-red-500" />
          <span className="text-sm text-gray-300">停用此帳號</span>
        </label>
        <div className="flex gap-2 mt-1">
          <button type="submit" disabled={busy}
            className="flex-1 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {busy ? '儲存中…' : '儲存'}
          </button>
          <button type="button" onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors">
            取消
          </button>
        </div>
      </form>
    </div>
  )
}

export default function UserManager({ onClose }: Props) {
  const { user: me, refreshProfile } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<UserRow | null>(null)
  const [avatarBust, setAvatarBust] = useState<Record<number, number>>({})
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [avatarUploadId, setAvatarUploadId] = useState<number | null>(null)
  const [busyDelete, setBusyDelete] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiJson<{ users: UserRow[] }>('/api/admin/users')
      setUsers(res.users)
    } catch {
      toast.error('無法載入使用者列表')
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

  function triggerAvatarUpload(userId: number) {
    setAvatarUploadId(userId)
    avatarInputRef.current?.click()
  }

  async function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!avatarUploadId || !e.target.files?.[0]) return
    const file = e.target.files[0]
    e.target.value = ''
    const form = new FormData()
    form.append('avatar', file)
    try {
      const isMe = avatarUploadId === me?.uid
      const token = getToken()
      const endpoint = isMe ? `/api/user/avatar` : `/api/admin/users/${avatarUploadId}/avatar`
      const res = await apiFetch(endpoint, { method: 'POST', body: form })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setAvatarBust(b => ({ ...b, [avatarUploadId]: Date.now() }))
      setUsers(prev => prev.map(u => u.id === avatarUploadId
        ? { ...u, avatar_ext: file.type.includes('png') ? 'png' : file.type.includes('webp') ? 'webp' : 'jpg' }
        : u
      ))
      if (isMe) await refreshProfile()
      toast.success('頭貼已更新')
      void token
    } catch (e: unknown) {
      toast.error((e as Error).message)
    }
    setAvatarUploadId(null)
  }

  async function deleteUser(u: UserRow) {
    if (!confirm(`確定要刪除使用者「${u.display_name || u.username}」？\n\n使用者的檔案不會被刪除。`)) return
    setBusyDelete(u.id)
    try {
      await apiJson(`/api/admin/users/${u.id}`, { method: 'DELETE' })
      toast.success('已刪除使用者')
      setUsers(prev => prev.filter(x => x.id !== u.id))
    } catch (e: unknown) {
      toast.error((e as Error).message)
    } finally {
      setBusyDelete(null)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl flex flex-col max-h-[88vh] shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <span className="text-white font-semibold">使用者管理</span>
              <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">{users.length}</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ul className="divide-y divide-gray-800">
                {users.map(u => {
                  const bust = avatarBust[u.id]
                  const isSelf = u.id === me?.uid
                  const isTemp = !!u.is_temporary
                  const tempExpired = isTemp && !!u.temp_expires_at && new Date(u.temp_expires_at) < new Date()
                  return (
                    <li key={u.id} className={`flex items-center gap-3 px-5 py-3.5 ${isTemp ? 'bg-yellow-950/10' : ''}`}>
                      {/* Avatar */}
                      <button onClick={() => triggerAvatarUpload(u.id)} title="點擊更換頭貼" className="relative group shrink-0">
                        <AvatarCircle u={u} size={10} bust={bust} />
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                        </div>
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-sm font-medium truncate">
                            {u.display_name || u.username}
                          </span>
                          {u.display_name && (
                            <span className="text-gray-500 text-xs truncate">@{u.username}</span>
                          )}
                          {isSelf && (
                            <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded">你</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          {isTemp ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-yellow-900/60 text-yellow-300">臨時</span>
                          ) : (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              u.role === 'admin' ? 'bg-orange-900/60 text-orange-300' : 'bg-gray-700 text-gray-400'
                            }`}>
                              {u.role === 'admin' ? '管理員' : '一般使用者'}
                            </span>
                          )}
                          {!!u.disabled && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/60 text-red-400 font-medium">已停用</span>
                          )}
                          {isTemp && !!u.temp_login_used && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 font-medium">已使用</span>
                          )}
                          {isTemp && tempExpired && !u.temp_login_used && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/40 text-red-400 font-medium">已過期</span>
                          )}
                          {isTemp && !tempExpired && u.temp_expires_at && (
                            <span className="text-[10px] text-yellow-500/80">{formatRemaining(u.temp_expires_at)}</span>
                          )}
                          {isTemp && !u.temp_expires_at && !u.temp_login_used && (
                            <span className="text-[10px] text-gray-500">無時效限制</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setEditTarget(u)}
                          className="text-xs px-2.5 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                        >
                          編輯
                        </button>
                        {!isSelf && (
                          <button
                            onClick={() => deleteUser(u)}
                            disabled={busyDelete === u.id}
                            className="text-xs px-2.5 py-1.5 rounded bg-gray-700 hover:bg-red-700 text-gray-400 hover:text-white transition-colors disabled:opacity-40"
                          >
                            {busyDelete === u.id ? '…' : '刪除'}
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-700 shrink-0 flex items-center justify-between">
            <button onClick={load} disabled={loading}
              className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors disabled:opacity-40">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重新整理
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAdd(true)}
                className="text-xs px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-500 text-white transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                新增使用者
              </button>
              <button onClick={onClose}
                className="text-xs px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden avatar input */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleAvatarFile}
      />

      {showAdd && (
        <AddUserDialog
          onClose={() => setShowAdd(false)}
          onCreated={u => { setUsers(prev => [...prev, u]); setShowAdd(false) }}
        />
      )}

      {editTarget && (
        <EditUserDialog
          user={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={async updated => {
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
            setEditTarget(null)
            if (updated.id === me?.uid) await refreshProfile()
          }}
        />
      )}
    </>
  )
}
