import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { apiFetch, apiJson } from '../lib/api'

interface Props {
  onClose: () => void
}

export default function UserProfilePanel({ onClose }: Props) {
  const { user, refreshProfile } = useAuth()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [savingName, setSavingName] = useState(false)

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [savingPw, setSavingPw] = useState(false)

  const avatarSrc = user?.avatarExt
    ? `${BACKEND_URL}/api/avatars/${user.username}?t=${Date.now()}`
    : null

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const form = new FormData()
    form.append('avatar', file)
    try {
      const res = await apiFetch('/api/user/avatar', { method: 'POST', body: form })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      await refreshProfile()
      toast.success('頭貼已更新')
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  async function handleSaveName() {
    setSavingName(true)
    try {
      await apiJson('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName }),
      })
      await refreshProfile()
      toast.success('顯示名稱已更新')
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSavingName(false)
    }
  }

  async function handleChangePassword() {
    if (!currentPw || !newPw || !confirmPw) {
      toast.error('請填寫所有欄位')
      return
    }
    if (newPw !== confirmPw) {
      toast.error('新密碼與確認密碼不一致')
      return
    }
    if (newPw.length < 8) {
      toast.error('新密碼至少需要 8 個字元')
      return
    }
    setSavingPw(true)
    try {
      await apiJson('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      toast.success('密碼已更新')
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-white font-semibold">個人資料</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Avatar section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {avatarSrc
                ? <img src={avatarSrc} alt={user?.username} className="w-20 h-20 rounded-full object-cover border-2 border-gray-600" />
                : <div className="w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-600">
                    {(user?.displayName || user?.username || '?').charAt(0).toUpperCase()}
                  </div>
              }
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center shadow-lg transition-colors"
                title="更換頭貼"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <div className="text-center">
              <p className="text-white font-medium">{user?.displayName || user?.username}</p>
              <p className="text-gray-500 text-xs">@{user?.username}</p>
              {user?.role === 'admin' && (
                <span className="inline-block mt-1 text-xs bg-orange-900/50 text-orange-400 border border-orange-800 rounded px-2 py-0.5">管理員</span>
              )}
            </div>
          </div>

          {/* Display name */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">顯示名稱</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder={user?.username ?? ''}
                maxLength={50}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSaveName}
                disabled={savingName}
                className="px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {savingName ? '...' : '儲存'}
              </button>
            </div>
          </div>

          {/* Change password */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">修改密碼</label>
            <div className="space-y-2">
              <input
                type="password"
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="目前密碼"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              />
              <input
                type="password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="新密碼（至少 8 個字元）"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              />
              <input
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="確認新密碼"
                onKeyDown={e => { if (e.key === 'Enter') handleChangePassword() }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleChangePassword}
                disabled={savingPw}
                className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {savingPw ? '更新中...' : '更新密碼'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
