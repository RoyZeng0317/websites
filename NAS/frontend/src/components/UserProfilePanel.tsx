import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useAuth, SESSION_TIMEOUT_KEY } from '../context/AuthContext'
import { apiFetch, apiJson } from '../lib/api'
import { LOGIN_BG_KEY, HOME_BG_KEY } from '../App'

const TIMEOUT_OPTIONS = [
  { value: 0,    label: 'Never' },
  { value: 15,   label: '15 minutes' },
  { value: 30,   label: '30 minutes' },
  { value: 60,   label: '1 hour' },
  { value: 120,  label: '2 hours' },
  { value: 480,  label: '8 hours' },
  { value: 1440, label: '24 hours' },
]

const PRESET_GRADIENTS = [
  'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
  'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
  'linear-gradient(135deg,#0d0d0d,#1a0533,#0d0d0d)',
  'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
  'linear-gradient(135deg,#141414,#2d1b69,#11998e)',
  'linear-gradient(135deg,#1e3c72,#2a5298)',
  'linear-gradient(135deg,#2d1b00,#4a2c00,#1a0a00)',
  'linear-gradient(135deg,#000000,#434343)',
]

interface Props { onClose: () => void }

export default function UserProfilePanel({ onClose }: Props) {
  const { user, refreshProfile } = useAuth()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [savingName, setSavingName]   = useState(false)
  const [currentPw, setCurrentPw]     = useState('')
  const [newPw, setNewPw]             = useState('')
  const [confirmPw, setConfirmPw]     = useState('')
  const [savingPw, setSavingPw]       = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(() => parseInt(localStorage.getItem(SESSION_TIMEOUT_KEY) ?? '0'))
  const [loginBg, setLoginBg]   = useState(() => localStorage.getItem(LOGIN_BG_KEY) ?? '')
  const [homeBg, setHomeBg]     = useState(() => localStorage.getItem(HOME_BG_KEY) ?? '')
  const [loginBgInput, setLoginBgInput] = useState(() => localStorage.getItem(LOGIN_BG_KEY) ?? '')
  const [homeBgInput, setHomeBgInput]   = useState(() => localStorage.getItem(HOME_BG_KEY) ?? '')
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'security' | 'password'>('profile')

  const avatarSrc = user?.avatarExt
    ? `${BACKEND_URL}/api/avatars/${user.username}?t=${Date.now()}`
    : null

  function saveTimeout(v: number) {
    setSessionTimeout(v)
    if (v) localStorage.setItem(SESSION_TIMEOUT_KEY, String(v))
    else localStorage.removeItem(SESSION_TIMEOUT_KEY)
  }
  function saveLoginBg(v: string) {
    setLoginBg(v); setLoginBgInput(v)
    if (v) localStorage.setItem(LOGIN_BG_KEY, v)
    else localStorage.removeItem(LOGIN_BG_KEY)
  }
  function saveHomeBg(v: string) {
    setHomeBg(v); setHomeBgInput(v)
    if (v) localStorage.setItem(HOME_BG_KEY, v)
    else localStorage.removeItem(HOME_BG_KEY)
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    e.target.value = ''
    const form = new FormData(); form.append('avatar', file)
    try {
      const res = await apiFetch('/api/user/avatar', { method: 'POST', body: form })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      await refreshProfile(); toast.success('Avatar updated')
    } catch (err) { toast.error((err as Error).message) }
  }

  async function handleSaveName() {
    setSavingName(true)
    try {
      await apiJson('/api/user/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayName }) })
      await refreshProfile(); toast.success('Display name updated')
    } catch (err) { toast.error((err as Error).message) }
    finally { setSavingName(false) }
  }

  async function handleChangePassword() {
    if (!currentPw || !newPw || !confirmPw) { toast.error('Please fill in all fields'); return }
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return }
    if (newPw.length < 8) { toast.error('New password must be at least 8 characters'); return }
    setSavingPw(true)
    try {
      await apiJson('/api/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }) })
      toast.success('Password updated'); setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (err) { toast.error((err as Error).message) }
    finally { setSavingPw(false) }
  }

  const TABS = [
    { key: 'profile',    label: 'Profile' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'security',   label: 'Security' },
    { key: 'password',   label: 'Change Password' },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm mx-4 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            {avatarSrc
              ? <img src={avatarSrc} alt={user?.username} className="w-9 h-9 rounded-full object-cover border border-gray-600"/>
              : <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm font-bold">
                  {(user?.displayName || user?.username || '?').charAt(0).toUpperCase()}
                </div>
            }
            <div>
              <p className="text-white font-semibold text-sm">{user?.displayName || user?.username}</p>
              <p className="text-gray-500 text-xs">@{user?.username}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 shrink-0 overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex-1 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === key ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1">

          {/* ── Profile ── */}
          {activeTab === 'profile' && (
            <div className="p-5 space-y-5">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {avatarSrc
                    ? <img src={avatarSrc} alt={user?.username} className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"/>
                    : <div className="w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-600">
                        {(user?.displayName || user?.username || '?').charAt(0).toUpperCase()}
                      </div>
                  }
                  <button onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
                {user?.role === 'admin' && (
                  <span className="text-xs bg-orange-900/50 text-orange-400 border border-orange-800 rounded px-2 py-0.5">Admin</span>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Display Name</label>
                <div className="flex gap-2">
                  <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                    placeholder={user?.username ?? ''} maxLength={50}
                    autoComplete="off" name="display-name-field"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"/>
                  <button onClick={handleSaveName} disabled={savingName}
                    className="px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-medium">
                    {savingName ? '...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Appearance ── */}
          {activeTab === 'appearance' && (
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Login Background</label>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {PRESET_GRADIENTS.map(g => (
                    <button key={g} onClick={() => saveLoginBg(g)}
                      className={`h-10 rounded-lg border-2 transition-all ${loginBg===g?'border-orange-400 scale-105':'border-gray-700 hover:border-gray-500'}`}
                      style={{ background: g }}/>
                  ))}
                  <button onClick={() => saveLoginBg('')}
                    className="h-10 rounded-lg border-2 border-gray-700 hover:border-gray-500 bg-gray-900 text-gray-600 text-[10px]">Default</button>
                </div>
                <div className="flex gap-1.5">
                  <input value={loginBgInput} onChange={e => setLoginBgInput(e.target.value)}
                    placeholder="Custom CSS background"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"/>
                  <button onClick={() => saveLoginBg(loginBgInput)}
                    className="px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium">Apply</button>
                </div>
                {loginBg && (
                  <div className="mt-2 h-10 rounded-lg border border-gray-700 flex items-center justify-center" style={{ background: loginBg }}>
                    <span className="text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">Login preview</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">File Manager Background</label>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {PRESET_GRADIENTS.map(g => (
                    <button key={g} onClick={() => saveHomeBg(g)}
                      className={`h-10 rounded-lg border-2 transition-all ${homeBg===g?'border-blue-400 scale-105':'border-gray-700 hover:border-gray-500'}`}
                      style={{ background: g }}/>
                  ))}
                  <button onClick={() => saveHomeBg('')}
                    className="h-10 rounded-lg border-2 border-gray-700 hover:border-gray-500 bg-gray-900 text-gray-600 text-[10px]">Default</button>
                </div>
                <div className="flex gap-1.5">
                  <input value={homeBgInput} onChange={e => setHomeBgInput(e.target.value)}
                    placeholder="Custom CSS background"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"/>
                  <button onClick={() => saveHomeBg(homeBgInput)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium">Apply</button>
                </div>
                {homeBg && (
                  <div className="mt-2 h-10 rounded-lg border border-gray-700 flex items-center justify-center" style={{ background: homeBg }}>
                    <span className="text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">Manager preview</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Security: Auto Logout ── */}
          {activeTab === 'security' && (
            <div className="p-5 space-y-3">
              <label className="block text-xs font-medium text-gray-400">Auto Logout Timeout</label>
              <p className="text-xs text-gray-600">Automatically log out after idle time</p>
              <div className="grid grid-cols-2 gap-1.5">
                {TIMEOUT_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => saveTimeout(opt.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
                      sessionTimeout === opt.value
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600">Current: {TIMEOUT_OPTIONS.find(o => o.value === sessionTimeout)?.label}</p>
            </div>
          )}

          {/* ── Change Password ── */}
          {activeTab === 'password' && (
            <div className="p-5">
              {/* Hidden dummy username field to prevent browser autofill on search bar */}
              <input type="text" name="username" autoComplete="username"
                defaultValue={user?.username ?? ''} className="hidden" readOnly tabIndex={-1} aria-hidden="true"/>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-400 mb-1">Change Password</label>
                <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  placeholder="Current password" autoComplete="current-password" name="current-password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"/>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                  placeholder="New password (at least 8 characters)" autoComplete="new-password" name="new-password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"/>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Confirm new password" autoComplete="new-password" name="confirm-password"
                  onKeyDown={e => { if (e.key === 'Enter') handleChangePassword() }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"/>
                <button onClick={handleChangePassword} disabled={savingPw}
                  className="w-full py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
                  {savingPw ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
