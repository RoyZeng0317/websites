import { useState, useEffect, useRef, useCallback } from 'react'
import { User } from 'firebase/auth'
import {
  collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy, getDoc, setDoc,
} from 'firebase/firestore'
import { ArrowLeft, Lock, Flame, Paperclip, Send, Pencil, Undo2, SlidersHorizontal, Fingerprint, Eye, EyeOff, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '../firebase'
import { encryptionService } from '../services/encryption'
import { hashPassword, getPeerHash, setPeerHash, clearPeerHash } from '../services/lock'
import { isBiometricAvailable, registerBiometric, verifyBiometric, isBiometricEnabled, disableBiometric } from '../services/biometric'
import { ChatUser, ChatMessage } from '../types'
import MessageBubble from './MessageBubble'

interface Props {
  user: User
  peer: ChatUser
  onClose: () => void
  onLock: () => void
}

type BurnTimer = 'off' | 'exit' | '1m' | '3m' | '5m'

const BURN_LABELS: Record<BurnTimer, string> = {
  off: '關閉焚燒', exit: '對方退出後', '1m': '1 分鐘後', '3m': '3 分鐘後', '5m': '5 分鐘後',
}
const BURN_MS: Record<string, number> = { '1m': 60000, '3m': 180000, '5m': 300000 }

function chatId(a: string, b: string) {
  return [a, b].sort().join('_')
}

export default function ChatView({ user, peer, onClose, onLock }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [burnTimer, setBurnTimer] = useState<BurnTimer>('off')
  const [showBurnMenu, setShowBurnMenu] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [msgOptions, setMsgOptions] = useState<ChatMessage | null>(null)
  const [editMode, setEditMode] = useState<{ id: string; text: string } | null>(null)
  const [showLockSettings, setShowLockSettings] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const sharedKeyRef = useRef<CryptoKey | null>(null)
  const cid = chatId(user.uid, peer.userId)
  const pendingDeletions = useRef<Set<string>>(new Set())

  // Init: ensure user doc + derive shared key
  useEffect(() => {
    let cancelled = false
    const init = async () => {
      try {
        // Register our public key in Firestore if not already done
        const userRef = doc(db, 'users', user.uid)
        const snap = await getDoc(userRef)
        if (!snap.exists() || !snap.data()?.publicKey || snap.data()?.publicKey !== encryptionService.publicKeyBase64) {
          await setDoc(userRef, {
            displayName: user.displayName || user.email || 'Unknown',
            photoURL: user.photoURL || '',
            publicKey: encryptionService.publicKeyBase64,
            lastSeen: serverTimestamp(),
          }, { merge: true })
        }
        // Derive shared key from peer's public key
        if (peer.publicKey) {
          sharedKeyRef.current = await encryptionService.getSharedSecret(peer.userId, peer.publicKey)
        }
        if (!cancelled) setReady(true)
      } catch (e) {
        console.error(e)
        if (!cancelled) setReady(true)
      }
    }
    init()
    return () => { cancelled = true }
  }, [user, peer])

  // Subscribe to messages
  useEffect(() => {
    if (!ready) return
    const q = query(
      collection(db, 'chats', cid, 'messages'),
      orderBy('timestamp'),
    )
    const unsub = onSnapshot(q, async snap => {
      for (const change of snap.docChanges()) {
        if (change.type === 'added') {
          const d = change.doc.data()
          const from = d.from as string
          const isMe = from === user.uid
          const burnT = (d.burnTimer as BurnTimer) || 'off'

          if (d.recalled) {
            setMessages(prev => {
              if (prev.find(m => m.documentId === change.doc.id)) return prev
              return [...prev, {
                documentId: change.doc.id, from, to: d.to, text: '',
                timestamp: d.timestamp?.toDate() ?? new Date(),
                burnTimer: burnT, isBurned: false, isSentByMe: isMe, recalled: true, edited: false,
              }]
            })
            if (!isMe) deleteDoc(change.doc.ref).catch(() => {})
            continue
          }

          let plainText = ''
          let mediaUrl: string | undefined
          let mediaType: string | undefined
          let fileName: string | undefined

          try {
            if (sharedKeyRef.current && d.ct) {
              const decrypted = await encryptionService.decrypt(
                { ct: d.ct, nonce: d.nonce, mac: d.mac },
                sharedKeyRef.current,
              )
              const payload = JSON.parse(decrypted)
              plainText = payload.text || ''
              mediaUrl = payload.mediaUrl
              mediaType = payload.mediaType
              fileName = payload.fileName
            }
          } catch { /* decryption failed */ }

          const msg: ChatMessage = {
            documentId: change.doc.id,
            from, to: d.to,
            text: plainText,
            timestamp: d.timestamp?.toDate() ?? new Date(),
            burnTimer: burnT,
            mediaUrl, mediaType: mediaType as ChatMessage['mediaType'], fileName,
            isBurned: false, isSentByMe: isMe, recalled: false, edited: d.edited || false,
          }

          setMessages(prev => {
            const idx = prev.findIndex(m => m.documentId === msg.documentId)
            if (idx >= 0) {
              const next = [...prev]
              next[idx] = {
                ...prev[idx],
                ...msg,
                // Never overwrite good values with empty ones from failed decryption
                text: msg.text || prev[idx].text,
                mediaUrl: msg.mediaUrl ?? prev[idx].mediaUrl,
                mediaType: msg.mediaType ?? prev[idx].mediaType,
                fileName: msg.fileName ?? prev[idx].fileName,
              }
              return next
            }
            return [...prev, msg]
          })

          // Schedule timed burn
          if (burnT !== 'off' && burnT !== 'exit' && BURN_MS[burnT]) {
            const ref = change.doc.ref
            const docId = change.doc.id
            setTimeout(() => {
              setMessages(prev => prev.map(m => m.documentId === docId ? { ...m, isBurned: true } : m))
              setTimeout(() => {
                setMessages(prev => prev.filter(m => m.documentId !== docId))
                // Only receiver deletes from Firestore
                if (!isMe) deleteDoc(ref).catch(() => {})
              }, 800)
            }, BURN_MS[burnT])
          }
          // Queue exit-burn received messages for deletion on chat close
          if (!isMe && burnT === 'exit') {
            pendingDeletions.current.add(change.doc.id)
          }
        }

        if (change.type === 'modified') {
          const d = change.doc.data()
          if (d.recalled) {
            setMessages(prev => prev.map(m => m.documentId === change.doc.id ? { ...m, recalled: true } : m))
            setTimeout(() => setMessages(prev => prev.filter(m => m.documentId !== change.doc.id)), 800)
            deleteDoc(change.doc.ref).catch(() => {})
          } else if (d.edited && !d.recalled && sharedKeyRef.current) {
            const from = d.from as string
            if (from !== user.uid) {
              try {
                const decrypted = await encryptionService.decrypt(
                  { ct: d.ct, nonce: d.nonce, mac: d.mac }, sharedKeyRef.current)
                const payload = JSON.parse(decrypted)
                setMessages(prev => prev.map(m => m.documentId === change.doc.id
                  ? { ...m, text: payload.text || '', edited: true } : m))
              } catch { /* ignore */ }
            }
          }
        }

        if (change.type === 'removed') {
          const d = change.doc.data()
          const burnT = d.burnTimer as string
          const docId = change.doc.id
          if (burnT !== 'off') {
            // Animate burn for both sender and receiver
            setMessages(prev => prev.map(m => m.documentId === docId ? { ...m, isBurned: true } : m))
            setTimeout(() => setMessages(prev => prev.filter(m => m.documentId !== docId)), 800)
          } else {
            setMessages(prev => prev.filter(m => m.documentId !== docId))
          }
        }
      }
    })
    return () => {
      unsub()
      // Delete pending messages on exit (burn=exit or burn=off)
      pendingDeletions.current.forEach(id => {
        deleteDoc(doc(db, 'chats', cid, 'messages', id)).catch(() => {})
      })
    }
  }, [ready, cid, user.uid, peer.userId])

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (msgText?: string, mUrl?: string, mType?: string, mFileName?: string) => {
    const t = (msgText ?? text).trim()
    if (!t && !mUrl) return
    setText('')

    const payload = JSON.stringify({ text: t, mediaUrl: mUrl, mediaType: mType, fileName: mFileName })
    let encrypted: { ct: string; nonce: string; mac: string } | null = null

    if (sharedKeyRef.current) {
      try {
        encrypted = await encryptionService.encrypt(payload, sharedKeyRef.current)
      } catch { /* fallback: send unencrypted for now */ }
    }

    const docData: Record<string, unknown> = {
      from: user.uid,
      to: peer.userId,
      burnTimer,
      mediaType: mType || null,
      fileName: mFileName || null,
      recalled: false,
      edited: false,
      timestamp: serverTimestamp(),
      ...(encrypted ?? { ct: '', nonce: '', mac: '' }),
    }

    const ref = collection(db, 'chats', cid, 'messages')
    const newDoc = await addDoc(ref, docData).catch(() => null)
    if (!newDoc) { toast.error('發送失敗'); return }

    // Optimistic update — also fixes case where snapshot arrived before addDoc resolved
    const optimistic: ChatMessage = {
      documentId: newDoc.id, from: user.uid, to: peer.userId,
      text: t, mediaUrl: mUrl, mediaType: mType as ChatMessage['mediaType'],
      fileName: mFileName, timestamp: new Date(), burnTimer,
      isBurned: false, isSentByMe: true, recalled: false, edited: false,
    }
    setMessages(prev => {
      const idx = prev.findIndex(m => m.documentId === newDoc.id)
      if (idx >= 0) {
        // Snapshot beat us — patch in the correct text/media from optimistic
        const next = [...prev]
        next[idx] = {
          ...prev[idx],
          text: t || prev[idx].text,
          mediaUrl: mUrl ?? prev[idx].mediaUrl,
          mediaType: (mType as ChatMessage['mediaType']) ?? prev[idx].mediaType,
          fileName: mFileName ?? prev[idx].fileName,
        }
        return next
      }
      return [...prev, optimistic]
    })
  }, [text, burnTimer, cid, user.uid, peer.userId])

  const recallMessage = async (msg: ChatMessage) => {
    setMsgOptions(null)
    await updateDoc(doc(db, 'chats', cid, 'messages', msg.documentId), {
      recalled: true, ct: '', nonce: '', mac: '',
    }).catch(() => toast.error('收回失敗'))
    setMessages(prev => prev.map(m => m.documentId === msg.documentId ? { ...m, recalled: true } : m))
    setTimeout(() => setMessages(prev => prev.filter(m => m.documentId !== msg.documentId)), 800)
  }

  const editMessage = async (id: string, newText: string) => {
    if (!sharedKeyRef.current) return
    try {
      const encrypted = await encryptionService.encrypt(
        JSON.stringify({ text: newText }), sharedKeyRef.current)
      await updateDoc(doc(db, 'chats', cid, 'messages', id), { ...encrypted, edited: true })
      setMessages(prev => prev.map(m => m.documentId === id ? { ...m, text: newText, edited: true } : m))
    } catch { toast.error('編輯失敗') }
    setEditMode(null)
  }

  const handleFile = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0]
    if (!file) return
    ev.target.value = ''

    if (file.size > 20 * 1024 * 1024) {
      toast.error('檔案不得超過 20 MB')
      return
    }

    setUploading(true)
    setUploadProgress(10)

    try {
      // Fetch signed credentials from backend (secret stays server-side)
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001'
      const credsRes = await fetch(`${backendUrl}/api/upload-credentials`)
      if (!credsRes.ok) throw new Error('Cannot reach backend')
      const { signature, timestamp, apiKey, cloudName, folder } = await credsRes.json() as {
        signature: string; timestamp: number; apiKey: string; cloudName: string; folder: string
      }

      setUploadProgress(20)

      // Upload directly from browser to Cloudinary (works on mobile — no localhost needed)
      const mime = file.type
      const resourceType = mime.startsWith('video/') ? 'video' : mime.startsWith('image/') ? 'image' : 'raw'
      const form = new FormData()
      form.append('file', file)
      form.append('api_key', apiKey)
      form.append('timestamp', String(timestamp))
      form.append('signature', signature)
      form.append('folder', folder)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: 'POST', body: form },
      )
      if (!uploadRes.ok) throw new Error('Cloudinary upload failed')

      setUploadProgress(90)
      const data = await uploadRes.json() as { secure_url: string }
      const mediaType = mime.startsWith('image/') ? 'image' : mime.startsWith('video/') ? 'video' : 'file'

      await sendMessage('', data.secure_url, mediaType, file.name)
      setUploadProgress(100)
    } catch {
      toast.error('上傳失敗，請確認後端伺服器是否啟動')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const hasBurn = burnTimer !== 'off'

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900 flex-shrink-0">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {peer.photoURL
            ? <img src={peer.photoURL} alt="" className="w-full h-full object-cover" />
            : <span className="text-orange-400 font-bold text-sm">{(peer.displayName[0] || '?').toUpperCase()}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{peer.displayName}</p>
          <p className="text-[10px] text-green-400 font-medium">E2E 加密</p>
        </div>
        <button onClick={() => setShowLockSettings(true)} title="鎖定設定"
          className="text-gray-500 hover:text-gray-300 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
        <button onClick={onLock} title="鎖定此聊天室"
          className="text-gray-500 hover:text-orange-400 transition-colors">
          <Lock className="w-5 h-5" />
        </button>
      </div>

      {/* Burn banner */}
      {hasBurn && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-950/40 border-b border-orange-900/30 flex-shrink-0">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs text-orange-400">焚燒模式 — {BURN_LABELS[burnTimer]}自動銷毀</span>
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="h-1 bg-gray-800 flex-shrink-0">
          <div
            className="h-full bg-orange-500 transition-all duration-200"
            style={{ width: `${uploadProgress || 5}%` }}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!ready && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {ready && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Lock className="w-10 h-10 text-gray-700 mb-3" />
            <p className="text-sm text-gray-500">尚無訊息</p>
            <p className="text-xs text-gray-600 mt-1">訊息閱後即從伺服器刪除</p>
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble
            key={msg.documentId}
            message={msg}
            onLongPress={msg.isSentByMe && !msg.recalled ? () => setMsgOptions(msg) : undefined}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar flex-shrink-0 border-t border-gray-800 bg-gray-900">
        {/* Burn mode selector — expands above input, no absolute positioning needed */}
        {showBurnMenu && (
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800 overflow-x-auto">
            {(Object.entries(BURN_LABELS) as [BurnTimer, string][]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setBurnTimer(val); setShowBurnMenu(false) }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors active:scale-95
                  ${burnTimer === val
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Burn timer toggle */}
          <button
            onClick={() => setShowBurnMenu(!showBurnMenu)}
            className="flex flex-col items-center p-2 -m-1 rounded-lg touch-manipulation"
          >
            <Flame className={`w-5 h-5 ${hasBurn ? 'text-orange-500' : 'text-gray-600'}`} />
            <span className={`text-[9px] leading-none mt-0.5 ${hasBurn ? 'text-orange-500' : 'text-gray-600'}`}>
              {burnTimer === 'off' ? '關閉' : burnTimer === 'exit' ? '退出' : burnTimer}
            </span>
          </button>

          {/* Attach */}
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="text-gray-600 hover:text-gray-300 transition-colors p-1 disabled:opacity-40">
            <Paperclip className="w-5 h-5" />
          </button>
          <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />

          {/* Text field */}
          <input
            type="text"
            placeholder="輸入訊息（加密傳送）..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Send */}
          <button
            onClick={() => sendMessage()}
            disabled={!text.trim() && !uploading}
            className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Message options modal */}
      {msgOptions && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setMsgOptions(null)}>
          <div className="w-full max-w-sm bg-gray-800 rounded-t-2xl py-2" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-3" />
            {!msgOptions.mediaUrl && (
              <button
                onClick={() => { setEditMode({ id: msgOptions.documentId, text: msgOptions.text }); setMsgOptions(null) }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
              >
                <Pencil className="w-4 h-4" /> 編輯訊息
              </button>
            )}
            <button
              onClick={() => recallMessage(msgOptions)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-950/30 transition-colors"
            >
              <Undo2 className="w-4 h-4" /> 收回訊息
            </button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setEditMode(null)}>
          <div className="w-full max-w-sm bg-gray-800 rounded-2xl p-5" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-white mb-3">編輯訊息</h3>
            <textarea
              value={editMode.text}
              onChange={e => setEditMode({ ...editMode, text: e.target.value })}
              rows={3}
              autoFocus
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setEditMode(null)}
                className="flex-1 py-2.5 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700">取消</button>
              <button onClick={() => editMessage(editMode.id, editMode.text)}
                className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600">儲存</button>
            </div>
          </div>
        </div>
      )}

      {/* Lock settings */}
      {showLockSettings && (
        <PeerLockSettings
          peerUid={peer.userId}
          userId={user.uid}
          peerName={peer.displayName}
          onClose={() => setShowLockSettings(false)}
          onLockAndClose={() => { setShowLockSettings(false); onLock() }}
        />
      )}

      {/* Close burn menu on outside click */}
      {showBurnMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowBurnMenu(false)} />
      )}
    </div>
  )
}

// ── Peer Lock Settings Modal ───────────────────────────────────────────────────

function PeerLockSettings({ peerUid, userId, peerName, onClose, onLockAndClose }: {
  peerUid: string; userId: string; peerName: string
  onClose: () => void; onLockAndClose: () => void
}) {
  const hasPassword = !!getPeerHash(peerUid)
  const [bioOn, setBioOn] = useState(isBiometricEnabled(peerUid))
  const [bioAvail, setBioAvail] = useState(false)
  const [view, setView] = useState<'main' | 'changePw'>('main')

  // Change password state
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { isBiometricAvailable().then(setBioAvail) }, [])

  const toggleBiometric = async () => {
    if (bioOn) {
      disableBiometric(peerUid)
      setBioOn(false)
      toast.success('指紋解鎖已停用')
    } else {
      setBusy(true)
      const ok = await registerBiometric(peerUid, userId)
      setBusy(false)
      if (ok) { setBioOn(true); toast.success('指紋解鎖已啟用') }
      else toast.error('指紋設定失敗')
    }
  }

  const savePassword = async () => {
    if (hasPassword) {
      if (!oldPw) { setErr('請輸入舊密碼'); return }
      const oldHash = await hashPassword(oldPw)
      if (oldHash !== getPeerHash(peerUid)) { setErr('舊密碼錯誤'); return }
    }
    if (newPw.length < 4) { setErr('新密碼至少 4 個字元'); return }
    if (newPw !== confirmPw) { setErr('兩次密碼不一致'); return }
    setPeerHash(peerUid, await hashPassword(newPw))
    toast.success('密碼已更新')
    onClose()
  }

  const removePassword = () => {
    clearPeerHash(peerUid)
    disableBiometric(peerUid)
    toast.success('鎖定已移除')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-sm bg-gray-800 rounded-t-2xl pt-2 pb-6 px-5" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4" />

        {view === 'main' && (
          <>
            <h3 className="font-bold text-white mb-1">鎖定設定</h3>
            <p className="text-xs text-gray-500 mb-5">與 {peerName} 的聊天室</p>

            {/* Biometric toggle */}
            {bioAvail && hasPassword && (
              <button
                onClick={toggleBiometric}
                disabled={busy}
                className="w-full flex items-center gap-3 py-3 border-b border-gray-700"
              >
                <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${bioOn ? 'bg-orange-500' : 'bg-gray-600'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${bioOn ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-gray-200 flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-orange-400" />指紋解鎖
                  </p>
                  <p className="text-xs text-gray-500">{bioOn ? '已啟用' : '已停用'}</p>
                </div>
                {busy && <span className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />}
              </button>
            )}

            {/* Change password */}
            <button
              onClick={() => { setView('changePw'); setErr('') }}
              className="w-full flex items-center gap-3 py-3 border-b border-gray-700 text-left"
            >
              <Lock className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-200">{hasPassword ? '修改密碼' : '設定密碼'}</p>
                <p className="text-xs text-gray-500">{hasPassword ? '更換此聊天室的解鎖密碼' : '尚未設定密碼'}</p>
              </div>
            </button>

            {/* Remove lock */}
            {hasPassword && (
              <button
                onClick={removePassword}
                className="w-full flex items-center gap-3 py-3 border-b border-gray-700 text-left"
              >
                <Trash2 className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-400">移除鎖定</p>
                  <p className="text-xs text-gray-500">清除此聊天室的密碼與指紋設定</p>
                </div>
              </button>
            )}

            <button onClick={onLockAndClose}
              className="w-full mt-4 py-3 bg-gray-700 text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-600">
              立即鎖定聊天室
            </button>
          </>
        )}

        {view === 'changePw' && (
          <>
            <button onClick={() => setView('main')} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 mb-4 text-sm">
              ← 返回
            </button>
            <h3 className="font-bold text-white mb-4">{hasPassword ? '修改密碼' : '設定密碼'}</h3>
            <div className="space-y-3">
              {hasPassword && (
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} placeholder="舊密碼"
                    value={oldPw} onChange={e => { setOldPw(e.target.value); setErr('') }}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="新密碼（至少 4 字元）"
                  value={newPw} onChange={e => { setNewPw(e.target.value); setErr('') }}
                  autoFocus={!hasPassword}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                {!hasPassword && (
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              <input type={showPw ? 'text' : 'password'} placeholder="確認新密碼"
                value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setErr('') }}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              {err && <p className="text-xs text-red-400">{err}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={() => setView('main')}
                  className="flex-1 py-3 border border-gray-700 rounded-xl text-sm text-gray-400 hover:bg-gray-700">取消</button>
                <button onClick={savePassword}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600">儲存</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
