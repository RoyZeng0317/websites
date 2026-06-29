import { useState, useEffect, useRef } from 'react'
import { User, signOut, updateProfile, deleteUser } from 'firebase/auth'
import {
  doc, getDoc, setDoc, updateDoc, query, collection,
  where, limit, getDocs, serverTimestamp, deleteDoc,
} from 'firebase/firestore'
import {
  Home, MessageCircle, Settings, Search, Lock, Shield,
  ChevronRight, LogOut, Trash2, Info, Eye, EyeOff, Flame, Fingerprint,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { auth, db } from '../firebase'
import { encryptionService } from '../services/encryption'
import { hashPassword, getPeerHash, setPeerHash } from '../services/lock'
import { isBiometricAvailable, registerBiometric, verifyBiometric, isBiometricEnabled } from '../services/biometric'
import { ChatUser } from '../types'
import ChatView from '../components/ChatView'

interface Props { user: User }

type Tab = 'home' | 'messages' | 'settings'

// ── User avatar ────────────────────────────────────────────────────────────────

function Avatar({ user: u, size = 10 }: { user: ChatUser; size?: number }) {
  const sz = `w-${size} h-${size}`
  return (
    <div className={`${sz} rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0`}>
      {u.photoURL
        ? <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
        : <span className="text-orange-700 font-bold text-sm">{(u.displayName[0] || '?').toUpperCase()}</span>}
    </div>
  )
}

function UserCard({ user: u, trailing, onClick }: { user: ChatUser; trailing?: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-4 border border-gray-700 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <Avatar user={u} size={10} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">{u.displayName}</p>
        <p className="text-xs text-orange-600 truncate">@{u.userHandle}</p>
      </div>
      {trailing}
    </div>
  )
}

// ── Lock Modal ─────────────────────────────────────────────────────────────────

function LockModal({ peerUid, userId, onUnlock, onCancel }: {
  peerUid: string; userId: string; onUnlock: () => void; onCancel: () => void
}) {
  const isSetup = !getPeerHash(peerUid)
  const bioEnabled = isBiometricEnabled(peerUid)

  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [enableBio, setEnableBio] = useState(false)
  const [bioAvailable, setBioAvailable] = useState(false)
  const [usePw, setUsePw] = useState(!bioEnabled)
  const [bioLoading, setBioLoading] = useState(false)

  useEffect(() => {
    isBiometricAvailable().then(ok => {
      setBioAvailable(ok)
      if (ok && !isSetup && bioEnabled) setUsePw(false)
    })
  }, [])

  const tryBiometric = async () => {
    setBioLoading(true)
    const ok = await verifyBiometric(peerUid)
    setBioLoading(false)
    if (ok) { onUnlock() }
    else { setError('指紋驗證失敗，請改用密碼'); setUsePw(true) }
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (isSetup) {
      if (pw.length < 4) { setError('密碼至少 4 個字元'); return }
      if (pw !== confirm) { setError('兩次密碼不一致'); return }
      setPeerHash(peerUid, await hashPassword(pw))
      if (enableBio && bioAvailable) {
        const ok = await registerBiometric(peerUid, userId)
        if (!ok) toast.error('指紋設定失敗，仍可使用密碼解鎖')
      }
      onUnlock()
    } else {
      const h = await hashPassword(pw)
      if (h !== getPeerHash(peerUid)) { setError('密碼錯誤'); return }
      onUnlock()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xs bg-gray-800 rounded-2xl p-6">
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500/10 rounded-full mb-3">
            {bioEnabled && !isSetup ? <Fingerprint className="w-7 h-7 text-orange-500" /> : <Lock className="w-7 h-7 text-orange-500" />}
          </div>
          <h2 className="font-bold text-white">{isSetup ? '設定此聊天室密碼' : '解鎖聊天室'}</h2>
          <p className="text-xs text-gray-400 mt-1">{isSetup ? '此聊天室可設定獨立密碼' : '此聊天室已啟用獨立鎖定'}</p>
        </div>

        {/* Unlock: biometric button */}
        {!isSetup && bioEnabled && !usePw && (
          <div className="flex flex-col items-center gap-3 mb-4">
            <button
              type="button"
              onClick={tryBiometric}
              disabled={bioLoading}
              className="w-20 h-20 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center hover:bg-orange-500/20 transition-colors disabled:opacity-50"
            >
              {bioLoading
                ? <span className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                : <Fingerprint className="w-10 h-10 text-orange-400" />}
            </button>
            <p className="text-sm text-gray-400">觸碰以進行指紋驗證</p>
            <button type="button" onClick={() => { setUsePw(true); setError('') }}
              className="text-xs text-gray-500 hover:text-gray-300 underline">改用密碼</button>
          </div>
        )}

        {/* Password fields */}
        {(isSetup || !bioEnabled || usePw) && (
          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder={isSetup ? '設定密碼（至少 4 字元）' : '輸入密碼'}
                value={pw}
                onChange={e => { setPw(e.target.value); setError('') }}
                autoFocus
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isSetup && (
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="確認密碼"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError('') }}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            )}

            {/* Biometric toggle (setup only) */}
            {isSetup && bioAvailable && (
              <button
                type="button"
                onClick={() => setEnableBio(!enableBio)}
                className="w-full flex items-center gap-3 px-1 py-1"
              >
                <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${enableBio ? 'bg-orange-500' : 'bg-gray-600'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${enableBio ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm text-gray-300 flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-orange-400" />同時啟用指紋解鎖
                </span>
              </button>
            )}

            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onCancel}
                className="flex-1 py-3 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700">取消</button>
              <button type="submit"
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600">
                {isSetup ? '設定' : '解鎖'}
              </button>
            </div>
          </form>
        )}

        {/* Cancel for biometric-only mode */}
        {!isSetup && bioEnabled && !usePw && (
          <button type="button" onClick={onCancel}
            className="w-full mt-3 py-2.5 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700">取消</button>
        )}
      </div>
    </div>
  )
}

// ── Main HomePage ──────────────────────────────────────────────────────────────

export default function HomePage({ user }: Props) {
  const [tab, setTab] = useState<Tab>('home')
  const [activePeer, setActivePeer] = useState<ChatUser | null>(null)
  const [showLock, setShowLock] = useState(false)
  const [pendingPeer, setPendingPeer] = useState<ChatUser | null>(null)
  const [unlockedPeers, setUnlockedPeers] = useState<Set<string>>(new Set())
  const [recentChats, setRecentChats] = useState<ChatUser[]>(() => {
    try {
      const raw = localStorage.getItem(`pchat_recent_${user.uid}`)
      return raw ? (JSON.parse(raw) as ChatUser[]) : []
    } catch { return [] }
  })
  const [myHandle, setMyHandle] = useState<string | null>(null)
  const [myDisplayName, setMyDisplayName] = useState(user.displayName || '')
  const initialized = useRef(false)

  // Initialize: generate key pair + register in Firestore
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const init = async () => {
      await encryptionService.generateKeyPair()
      const handle = await ensureUserDoc(user)
      setMyHandle(handle)
    }
    init()
  }, [user])

  const ensureUserDoc = async (u: User): Promise<string> => {
    const ref = doc(db, 'users', u.uid)
    const snap = await getDoc(ref)
    const existing = snap.data()
    let handle = existing?.userHandle as string | undefined
    if (!handle) {
      const raw = u.uid.replace(/[^a-z0-9]/g, '')
      handle = `u_${raw.substring(0, 8)}`
    }
    await setDoc(ref, {
      displayName: u.displayName || u.email || 'Unknown',
      photoURL: u.photoURL || '',
      publicKey: encryptionService.publicKeyBase64,
      userHandle: handle,
      lastSeen: serverTimestamp(),
    }, { merge: true })
    return handle
  }

  const openChat = (peer: ChatUser) => {
    if (!unlockedPeers.has(peer.userId)) {
      setPendingPeer(peer)
      setShowLock(true)
      return
    }
    addToRecent(peer)
    setActivePeer(peer)
  }

  const onLockUnlocked = () => {
    setShowLock(false)
    if (pendingPeer) {
      setUnlockedPeers(prev => new Set([...prev, pendingPeer.userId]))
      addToRecent(pendingPeer)
      setActivePeer(pendingPeer)
      setPendingPeer(null)
    }
  }

  const lockChat = () => {
    if (activePeer) {
      setUnlockedPeers(prev => { const s = new Set(prev); s.delete(activePeer.userId); return s })
    }
    setActivePeer(null)
  }

  const addToRecent = (peer: ChatUser) => {
    setRecentChats(prev => {
      const next = [peer, ...prev.filter(p => p.userId !== peer.userId)].slice(0, 50)
      try { localStorage.setItem(`pchat_recent_${user.uid}`, JSON.stringify(next)) } catch {}
      return next
    })
  }

  // ── Chat open: full-screen overlay ──────────────────────────────────────────
  if (activePeer) {
    return (
      <div className="h-full">
        <ChatView user={user} peer={activePeer} onClose={() => setActivePeer(null)} onLock={lockChat} />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Left sidebar — hidden on mobile ≤480px */}
      <div className="max-[480px]:hidden flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-900 w-16 sm:w-52 transition-all">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-800">
          <Flame className="w-7 h-7 text-orange-500 flex-shrink-0" />
          <span className="hidden sm:block text-lg font-bold text-white truncate">P Chats</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 space-y-1 px-2">
          {([
            { key: 'home', label: '首頁', Icon: Home },
            { key: 'messages', label: '訊息', Icon: MessageCircle },
            { key: 'settings', label: '設定', Icon: Settings },
          ] as { key: Tab; label: string; Icon: React.ComponentType<{ className?: string }> }[]).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                ${tab === key
                  ? 'bg-orange-500/10 text-orange-400'
                  : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:block text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* E2E badge at bottom */}
        <div className="px-3 pb-4 hidden sm:block">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-orange-950/30 rounded-xl">
            <Lock className="w-3 h-3 text-orange-400 flex-shrink-0" />
            <span className="text-[10px] text-orange-400 leading-tight">E2E 加密保護</span>
          </div>
        </div>
      </div>

      {/* Main content — bottom padding for mobile nav */}
      <div className="flex-1 overflow-hidden max-[480px]:pb-16">
        {tab === 'home' && (
          <SearchTab
            user={user}
            myHandle={myHandle}
            onOpenChat={openChat}
          />
        )}
        {tab === 'messages' && (
          <MessagesTab recentChats={recentChats} onOpenChat={openChat} />
        )}
        {tab === 'settings' && (
          <SettingsTab
            user={user}
            myHandle={myHandle}
            myDisplayName={myDisplayName}
            onHandleUpdate={setMyHandle}
            onDisplayNameUpdate={setMyDisplayName}
          />
        )}
      </div>

      {/* Mobile bottom nav — visible only on ≤480px */}
      <nav className="hidden max-[480px]:flex fixed bottom-0 left-0 right-0 z-20
        bg-gray-900 border-t border-gray-800 items-center justify-around
        px-2 py-1 safe-pb">
        {([
          { key: 'home', label: '首頁', Icon: Home },
          { key: 'messages', label: '訊息', Icon: MessageCircle },
          { key: 'settings', label: '設定', Icon: Settings },
        ] as { key: Tab; label: string; Icon: React.ComponentType<{ className?: string }> }[]).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-colors
              ${tab === key ? 'text-orange-400' : 'text-gray-500'}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* Lock modal */}
      {showLock && pendingPeer && (
        <LockModal
          peerUid={pendingPeer.userId}
          userId={user.uid}
          onUnlock={onLockUnlocked}
          onCancel={() => { setShowLock(false); setPendingPeer(null) }}
        />
      )}
    </div>
  )
}

// ── Search Tab ─────────────────────────────────────────────────────────────────

function SearchTab({ user, myHandle, onOpenChat }: {
  user: User; myHandle: string | null; onOpenChat: (u: ChatUser) => void
}) {
  const [query2, setQuery2] = useState('')
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState<ChatUser | null | undefined>(undefined)

  const search = async () => {
    const q = query2.trim().toLowerCase()
    if (!q) return
    setSearching(true)
    setResult(undefined)
    try {
      const snap = await getDocs(
        query(collection(db, 'users'), where('userHandle', '==', q), limit(1)),
      )
      if (snap.empty || snap.docs[0].id === user.uid) {
        setResult(null)
      } else {
        const d = snap.docs[0].data()
        setResult({
          userId: snap.docs[0].id,
          displayName: d.displayName || snap.docs[0].id,
          photoURL: d.photoURL || '',
          userHandle: d.userHandle || '',
          publicKey: d.publicKey || '',
        })
      }
    } catch {
      toast.error('搜尋失敗，請稍後再試')
      setResult(undefined)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* App bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold text-white">P Chats</h1>
        <Flame className="w-6 h-6 text-orange-500" />
      </div>

      <div className="px-5 space-y-5 pb-5">
        {/* E2E badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-950/30 rounded-xl">
          <Lock className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
          <span className="text-xs text-orange-400">端到端加密 · 訊息閱後即從伺服器刪除</span>
        </div>

        {/* My handle card */}
        <div className="border border-gray-700 bg-gray-800/50 rounded-xl p-4">
          <p className="text-xs text-gray-400 font-medium mb-1.5">我的用戶 ID</p>
          <p className="text-2xl font-bold text-white">
            {myHandle ? `@${myHandle}` : '載入中...'}
          </p>
          <p className="text-xs text-gray-500 mt-1">其他使用者需輸入此 ID 才能找到你（可至設定修改）</p>
        </div>

        {/* Search */}
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2">搜尋用戶</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="輸入對方的用戶 ID…"
                value={query2}
                onChange={e => setQuery2(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={search}
              disabled={searching}
              className="px-4 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 disabled:opacity-50 flex items-center gap-1.5"
            >
              {searching
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : '搜尋'}
            </button>
          </div>
        </div>

        {/* Search result */}
        {result === null && (
          <div className="flex items-center gap-3 px-4 py-4 bg-gray-800 rounded-xl">
            <span className="text-gray-500 text-2xl">👤</span>
            <span className="text-sm text-gray-400">找不到此用戶 ID</span>
          </div>
        )}
        {result && (
          <UserCard
            user={result}
            trailing={
              <button
                onClick={() => onOpenChat(result)}
                className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600"
              >
                開始對話
              </button>
            }
            onClick={() => onOpenChat(result)}
          />
        )}
      </div>
    </div>
  )
}

// ── Messages Tab ───────────────────────────────────────────────────────────────

function MessagesTab({ recentChats, onOpenChat }: { recentChats: ChatUser[]; onOpenChat: (u: ChatUser) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold text-white">訊息</h1>
      </div>
      {recentChats.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <MessageCircle className="w-16 h-16 text-gray-700 mb-4" />
          <p className="text-base text-gray-400 font-medium">尚無最近對話</p>
          <p className="text-sm text-gray-600 mt-1">從首頁搜尋用戶來開始對話</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
          {recentChats.map(u => (
            <UserCard key={u.userId} user={u} onClick={() => onOpenChat(u)}
              trailing={<MessageCircle className="w-4 h-4 text-gray-300" />} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Settings Tab ───────────────────────────────────────────────────────────────

function SettingsTab({ user, myHandle, myDisplayName, onHandleUpdate, onDisplayNameUpdate }: {
  user: User
  myHandle: string | null
  myDisplayName: string
  onHandleUpdate: (h: string) => void
  onDisplayNameUpdate: (n: string) => void
}) {
  const [showEditName, setShowEditName] = useState(false)
  const [showEditHandle, setShowEditHandle] = useState(false)
  const [nameInput, setNameInput] = useState(myDisplayName)
  const [handleInput, setHandleInput] = useState(myHandle || '')
  const [nameError, setNameError] = useState('')
  const [handleError, setHandleError] = useState('')

  const saveName = async () => {
    const n = nameInput.trim()
    if (!n) { setNameError('顯示名稱不得為空'); return }
    if (n.length > 30) { setNameError('最多 30 個字元'); return }
    await updateProfile(user, { displayName: n })
    await updateDoc(doc(db, 'users', user.uid), { displayName: n })
    onDisplayNameUpdate(n)
    setShowEditName(false)
    toast.success('顯示名稱已更新')
  }

  const saveHandle = async () => {
    const h = handleInput.toLowerCase().trim()
    if (h.length < 3) { setHandleError('至少需要 3 個字元'); return }
    if (h.length > 20) { setHandleError('最多 20 個字元'); return }
    if (!/^[a-z0-9_]+$/.test(h)) { setHandleError('只能使用英文小寫、數字與底線'); return }
    const snap = await getDocs(query(collection(db, 'users'), where('userHandle', '==', h), limit(1)))
    if (!snap.empty && snap.docs[0].id !== user.uid) { setHandleError('此 ID 已被使用'); return }
    await updateDoc(doc(db, 'users', user.uid), { userHandle: h })
    onHandleUpdate(h)
    setShowEditHandle(false)
    toast.success('用戶 ID 已更新')
  }

  const handleSignOut = async () => {
    if (!confirm('確定要登出嗎？')) return
    await signOut(auth)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('刪除帳號後，所有資料將永久移除且無法還原。確定要繼續嗎？')) return
    try {
      await deleteDoc(doc(db, 'users', user.uid)).catch(() => {})
      await deleteUser(user)
    } catch (e: unknown) {
      const code = (e as { code?: string }).code
      if (code === 'auth/requires-recent-login') toast.error('請先重新登入後再刪除帳號')
      else toast.error('刪除帳號失敗')
    }
  }

  const initials = (myDisplayName[0] || myHandle?.[0] || '?').toUpperCase()

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold text-white">設定</h1>
      </div>

      {/* Profile section */}
      <Section label="個人資料">
        <SettingsRow
          icon={<div className="w-9 h-9 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold text-sm">{initials}</div>}
          title={myDisplayName || '尚未設定'}
          subtitle="顯示名稱"
          onClick={() => { setNameInput(myDisplayName); setNameError(''); setShowEditName(true) }}
        />
        <div className="h-px bg-gray-700 ml-14" />
        <SettingsRow
          icon={<div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold text-sm">@</div>}
          title={myHandle ? `@${myHandle}` : '尚未設定'}
          subtitle="用戶 ID"
          onClick={() => { setHandleInput(myHandle || ''); setHandleError(''); setShowEditHandle(true) }}
        />
      </Section>

      {/* Security */}
      <Section label="安全性">
        <div className="px-4 py-3 flex items-start gap-3">
          <Lock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-200">獨立聊天室鎖定</p>
            <p className="text-xs text-gray-500 mt-0.5">每個聊天對象可設定不同密碼及指紋解鎖，<br />在對話視窗中開啟鎖定設定即可管理。</p>
          </div>
        </div>
      </Section>

      {/* About */}
      <Section label="關於">
        <div className="px-4 py-3 flex items-start gap-3">
          <Shield className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-200">端到端加密</p>
            <p className="text-xs text-gray-500 mt-0.5">X25519 金鑰交換 · AES-256-GCM 加密<br />訊息閱後即從伺服器刪除</p>
          </div>
        </div>
        <div className="h-px bg-gray-700 ml-14" />
        <div className="px-4 py-3 flex items-center gap-3">
          <Info className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <p className="text-sm text-gray-300 flex-1">版本</p>
          <span className="text-sm text-gray-500">2.0.0</span>
        </div>
      </Section>

      {/* Account management */}
      <Section label="帳號管理">
        <SettingsRow
          icon={<Trash2 className="w-5 h-5 text-red-500" />}
          title="刪除帳號"
          subtitle="永久刪除帳號及所有資料"
          titleClass="text-red-500"
          onClick={handleDeleteAccount}
        />
      </Section>

      <div className="px-5 pb-6 mt-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 border border-red-800 text-red-400 py-3 rounded-xl text-sm font-medium hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" /> 登出
        </button>
      </div>

      {/* Edit display name dialog */}
      {showEditName && (
        <Dialog title="修改顯示名稱" onClose={() => setShowEditName(false)} onSave={saveName}>
          <p className="text-xs text-gray-400 mb-3">最多 30 個字元，其他使用者看到的名稱。</p>
          <input
            type="text" value={nameInput} onChange={e => { setNameInput(e.target.value); setNameError('') }}
            autoFocus
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="顯示名稱"
          />
          {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
        </Dialog>
      )}

      {/* Edit handle dialog */}
      {showEditHandle && (
        <Dialog title="修改用戶 ID" onClose={() => setShowEditHandle(false)} onSave={saveHandle}>
          <p className="text-xs text-gray-400 mb-3">3–20 字元，只能使用英文小寫字母、數字與底線 (_)。</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">@</span>
            <input
              type="text" value={handleInput}
              onChange={e => { setHandleInput(e.target.value.toLowerCase()); setHandleError('') }}
              autoFocus
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="用戶 ID"
            />
          </div>
          {handleError && <p className="text-xs text-red-500 mt-1">{handleError}</p>}
        </Dialog>
      )}

    </div>
  )
}

// ── Shared UI helpers ──────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <div className="mx-5 border border-gray-800 rounded-xl overflow-hidden bg-gray-900">{children}</div>
    </div>
  )
}

function SettingsRow({ icon, title, subtitle, onClick, titleClass = '' }: {
  icon: React.ReactNode; title: string; subtitle?: string; onClick?: () => void; titleClass?: string
}) {
  return (
    <div onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${titleClass || 'text-gray-200'}`}>{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <ChevronRight className={`w-4 h-4 ${titleClass ? 'text-red-400' : 'text-gray-600'} flex-shrink-0`} />
    </div>
  )
}

function Dialog({ title, children, onClose, onSave }: {
  title: string; children: React.ReactNode; onClose: () => void; onSave: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-gray-800 rounded-2xl p-5" onClick={e => e.stopPropagation()}>
        <h3 className="font-bold text-white mb-3">{title}</h3>
        {children}
        <div className="flex gap-2 mt-4">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700">取消</button>
          <button onClick={onSave}
            className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600">儲存</button>
        </div>
      </div>
    </div>
  )
}
