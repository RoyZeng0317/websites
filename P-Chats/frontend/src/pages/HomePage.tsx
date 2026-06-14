import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, MessageCircle, Settings, Search, Lock, Eye, EyeOff, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ChatService, ChatUser } from '../services/chatService'
import { sessionLock } from '../lib/sessionLock'

export default function HomePage() {
  const [tab, setTab] = useState(0)
  const { encryptionService, userDoc, refreshUserDoc } = useAuth()
  const chatServiceRef = useRef<ChatService | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userDoc) return
    const svc = new ChatService(encryptionService, userDoc.uid, userDoc.userHandle, userDoc.displayName)
    chatServiceRef.current = svc
    return () => { svc.dispose() }
  }, [encryptionService, userDoc])

  const [recentChats, setRecentChats] = useState<ChatUser[]>([])

  function addToRecent(user: ChatUser) {
    setRecentChats(prev => {
      const filtered = prev.filter(u => u.userId !== user.userId)
      return [user, ...filtered]
    })
  }

  async function openChat(user: ChatUser) {
    addToRecent(user)
    if (sessionLock.isPeerUnlocked(user.userId)) {
      navigate(`/chat/${user.userId}`, { state: { displayName: user.displayName } })
    } else {
      navigate(`/lock/${user.userId}`, { state: { displayName: user.displayName } })
    }
  }

  return (
    <div className="flex flex-col h-dvh bg-white">
      <div className="flex-1 overflow-hidden">
        {tab === 0 && (
          <SearchTab
            chatService={chatServiceRef.current}
            userDoc={userDoc}
            onOpenChat={openChat}
          />
        )}
        {tab === 1 && (
          <MessagesTab recentChats={recentChats} onOpenChat={openChat} />
        )}
        {tab === 2 && (
          <SettingsTab
            chatService={chatServiceRef.current}
            onRefresh={refreshUserDoc}
          />
        )}
      </div>

      {/* Bottom Nav */}
      <div className="border-t flex">
        {[
          { icon: Home, label: '首頁' },
          { icon: MessageCircle, label: '訊息' },
          { icon: Settings, label: '設定' },
        ].map(({ icon: Icon, label }, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition ${tab === i ? 'text-orange-500' : 'text-gray-400'}`}
          >
            <Icon size={22} strokeWidth={tab === i ? 2 : 1.5} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Search Tab ────────────────────────────────────────────────────────────────

function SearchTab({
  chatService,
  userDoc,
  onOpenChat,
}: {
  chatService: ChatService | null
  userDoc: ReturnType<typeof useAuth>['userDoc']
  onOpenChat: (user: ChatUser) => void
}) {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState<ChatUser | null | undefined>(undefined)

  async function search() {
    if (!query.trim() || !chatService) return
    setSearching(true)
    setResult(undefined)
    try {
      const user = await chatService.searchUser(query.trim())
      setResult(user)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-xl font-bold mb-4">P Chats</h1>

        {/* E2E badge */}
        <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2 mb-6">
          <Lock size={13} className="text-orange-600 shrink-0" />
          <span className="text-xs text-orange-700">端到端加密 · 訊息閱後即從伺服器刪除</span>
        </div>

        {/* My handle */}
        <div className="border rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-400 font-medium mb-1">我的用戶 ID</p>
          <p className="text-2xl font-bold">
            {userDoc?.userHandle ? `@${userDoc.userHandle}` : '尚未設定'}
          </p>
          <p className="text-xs text-gray-400 mt-1">其他使用者需輸入此 ID 才能找到你（可至設定修改）</p>
        </div>

        {/* Search */}
        <p className="text-sm font-semibold text-gray-600 mb-2">搜尋用戶</p>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="輸入對方的用戶 ID…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              className="w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-orange-400"
            />
          </div>
          <button
            onClick={search}
            disabled={searching}
            className="px-4 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 disabled:opacity-50 shrink-0"
          >
            {searching ? '…' : '搜尋'}
          </button>
        </div>

        {result === null && (
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-4 text-sm text-gray-400">
            找不到此用戶 ID
          </div>
        )}
        {result && (
          <UserCard
            user={result}
            trailing={
              <button
                onClick={() => onOpenChat(result)}
                className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600"
              >
                開始對話
              </button>
            }
            onTap={() => onOpenChat(result)}
          />
        )}
      </div>
    </div>
  )
}

// ── Messages Tab ──────────────────────────────────────────────────────────────

function MessagesTab({
  recentChats,
  onOpenChat,
}: {
  recentChats: ChatUser[]
  onOpenChat: (user: ChatUser) => void
}) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-xl font-bold mb-4">訊息</h1>
      </div>
      {recentChats.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-300 gap-3">
          <MessageCircle size={56} />
          <p className="text-gray-400 text-sm">尚無最近對話</p>
          <p className="text-gray-300 text-xs">從首頁搜尋用戶來開始對話</p>
        </div>
      ) : (
        <div className="px-2">
          {recentChats.map(u => (
            <UserCard key={u.userId} user={u} onTap={() => onOpenChat(u)} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Settings Tab ──────────────────────────────────────────────────────────────

function SettingsTab({
  chatService,
  onRefresh,
}: {
  chatService: ChatService | null
  onRefresh: () => Promise<void>
}) {
  const { userDoc, signOut, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const [showEditName, setShowEditName] = useState(false)
  const [showEditHandle, setShowEditHandle] = useState(false)
  const [showChangePw, setShowChangePw] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function handleSignOut() {
    if (!confirm('確定要登出嗎？')) return
    sessionLock.lockAll()
    await signOut()
    navigate('/login', { replace: true })
  }

  async function handleDelete() {
    setShowDeleteConfirm(false)
    const err = await deleteAccount()
    if (err) toast.error(err)
    else navigate('/login', { replace: true })
  }

  const sectionLabel = (label: string) => (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 pt-5 pb-1">{label}</p>
  )

  const avatar = userDoc?.displayName?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="h-full overflow-y-auto pb-4">
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-xl font-bold">設定</h1>
      </div>

      {sectionLabel('個人資料')}
      <SettingsTile
        icon={<div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700">{avatar}</div>}
        title={userDoc?.displayName ?? '尚未設定'}
        subtitle="顯示名稱"
        onClick={() => setShowEditName(true)}
      />
      <SettingsTile
        icon={<div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">@</div>}
        title={userDoc?.userHandle ? `@${userDoc.userHandle}` : '尚未設定'}
        subtitle="用戶 ID"
        onClick={() => setShowEditHandle(true)}
      />

      {sectionLabel('安全性')}
      <SettingsTile
        icon={<Lock size={20} className="text-orange-500" />}
        title="聊天室密碼"
        subtitle="保護所有加密聊天室的入口"
        onClick={() => setShowChangePw(true)}
      />

      {sectionLabel('關於')}
      <SettingsTile
        icon={<Settings size={20} className="text-orange-500" />}
        title="端到端加密"
        subtitle="X25519 金鑰交換 · AES-256-GCM 加密 · 訊息閱後即從伺服器刪除"
        onClick={undefined}
      />
      <SettingsTile
        icon={<Settings size={18} className="text-orange-400" />}
        title="版本"
        subtitle={undefined}
        trailing={<span className="text-sm text-gray-400">2.0.0</span>}
        onClick={undefined}
      />

      {sectionLabel('帳號管理')}
      <SettingsTile
        icon={<Trash2 size={20} className="text-red-500" />}
        title="刪除帳號"
        subtitle="永久刪除帳號及所有資料"
        titleClass="text-red-500"
        onClick={() => setShowDeleteConfirm(true)}
      />

      <div className="px-4 pt-4">
        <button
          onClick={handleSignOut}
          className="w-full border border-red-400 text-red-500 rounded-xl py-3 text-sm font-medium hover:bg-red-50 transition"
        >
          登出
        </button>
      </div>

      {/* Edit display name dialog */}
      {showEditName && (
        <EditDialog
          title="修改顯示名稱"
          hint="最多 30 個字元"
          initial={userDoc?.displayName ?? ''}
          onSave={async val => {
            const err = await chatService?.updateDisplayName(val)
            if (err) return err
            await onRefresh()
            return null
          }}
          onClose={() => setShowEditName(false)}
        />
      )}

      {/* Edit handle dialog */}
      {showEditHandle && (
        <EditDialog
          title="修改用戶 ID"
          hint="3–20 字元，只能使用英文小寫字母、數字與底線 (_)"
          initial={userDoc?.userHandle ?? ''}
          prefix="@"
          onSave={async val => {
            const err = await chatService?.updateHandle(val)
            if (err) return err
            await onRefresh()
            return null
          }}
          onClose={() => setShowEditHandle(false)}
        />
      )}

      {/* Change password dialog */}
      {showChangePw && (
        <ChangePasswordDialog onClose={() => setShowChangePw(false)} />
      )}

      {/* Delete account confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl">
            <h3 className="font-semibold mb-2">刪除帳號</h3>
            <p className="text-sm text-gray-500 mb-4">刪除帳號後，所有資料將永久移除且無法還原。確定要繼續嗎？</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm text-gray-500">取消</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">確認刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared components ─────────────────────────────────────────────────────────

function UserCard({ user, trailing, onTap }: { user: ChatUser; trailing?: React.ReactNode; onTap?: () => void }) {
  const letter = user.displayName?.[0]?.toUpperCase() ?? '?'
  return (
    <div
      onClick={onTap}
      className="flex items-center gap-3 p-3 rounded-xl border border-orange-100 mb-2 cursor-pointer hover:bg-orange-50 transition"
    >
      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700 shrink-0">
        {user.photoURL
          ? <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
          : letter}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-sm">{user.displayName}</p>
        <p className="text-xs text-orange-600">@{user.userHandle}</p>
      </div>
      {trailing ?? <MessageCircle size={18} className="text-gray-300 shrink-0" />}
    </div>
  )
}

function SettingsTile({
  icon, title, subtitle, trailing, onClick, titleClass,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  trailing?: React.ReactNode
  onClick?: () => void
  titleClass?: string
}) {
  return (
    <>
      <button
        onClick={onClick}
        disabled={!onClick}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
      >
        <div className="shrink-0 w-9 flex justify-center">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${titleClass ?? ''}`}>{title}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {trailing ?? (onClick ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-300"><path d="M9 18l6-6-6-6" /></svg> : null)}
      </button>
      <div className="h-px bg-gray-100 mx-4" />
    </>
  )
}

function EditDialog({
  title, hint, initial, prefix, onSave, onClose,
}: {
  title: string
  hint: string
  initial: string
  prefix?: string
  onSave: (val: string) => Promise<string | null>
  onClose: () => void
}) {
  const [value, setValue] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function save() {
    setLoading(true)
    setError(null)
    const err = await onSave(value)
    setLoading(false)
    if (err) { setError(err); return }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-xs text-gray-400 mb-3">{hint}</p>
        <div className="relative">
          {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{prefix}</span>}
          <input
            autoFocus
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setError(null) }}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400 ${prefix ? 'pl-7' : ''}`}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <div className="flex gap-2 mt-4 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500">取消</button>
          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? '儲存中…' : '儲存'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ChangePasswordDialog({ onClose }: { onClose: () => void }) {
  const hasPassword = sessionLock.hasPassword()
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [obscure, setObscure] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function save() {
    setLoading(true)
    setError(null)
    try {
      if (hasPassword) {
        const ok = await sessionLock.verify(oldPw)
        if (!ok) { setError('舊密碼錯誤'); return }
      }
      if (!newPw) { setError('新密碼不得為空'); return }
      if (newPw !== confirmPw) { setError('兩次密碼不一致'); return }
      await sessionLock.setPassword(newPw)
      sessionLock.lockAll()
      toast.success('密碼已更新')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl">
        <h3 className="font-semibold mb-4">{hasPassword ? '修改聊天室密碼' : '設定聊天室密碼'}</h3>
        <div className="space-y-3">
          {hasPassword && (
            <input
              type={obscure ? 'password' : 'text'}
              placeholder="舊密碼"
              value={oldPw}
              onChange={e => { setOldPw(e.target.value); setError(null) }}
              className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400"
            />
          )}
          <div className="relative">
            <input
              type={obscure ? 'password' : 'text'}
              placeholder="新密碼"
              value={newPw}
              onChange={e => { setNewPw(e.target.value); setError(null) }}
              className="w-full border rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-orange-400"
            />
            <button
              type="button"
              onClick={() => setObscure(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {obscure ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <input
            type={obscure ? 'password' : 'text'}
            placeholder="確認新密碼"
            value={confirmPw}
            onChange={e => { setConfirmPw(e.target.value); setError(null) }}
            className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-400"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500">取消</button>
          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? '儲存中…' : '儲存'}
          </button>
        </div>
      </div>
    </div>
  )
}
