import { useState, useEffect, useRef, useCallback } from 'react'
import { User } from 'firebase/auth'
import {
  collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy, getDoc, setDoc,
} from 'firebase/firestore'
import { ArrowLeft, Lock, Flame, Paperclip, Send, X, Pencil, Undo2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '../firebase'
import { encryptionService } from '../services/encryption'
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
  const [ready, setReady] = useState(false)
  const [msgOptions, setMsgOptions] = useState<ChatMessage | null>(null)
  const [editMode, setEditMode] = useState<{ id: string; text: string } | null>(null)
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
            if (!isMe && sharedKeyRef.current && d.ct) {
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
            text: isMe ? (d._plainText || '') : plainText,
            timestamp: d.timestamp?.toDate() ?? new Date(),
            burnTimer: burnT,
            mediaUrl: isMe ? d.mediaUrl : mediaUrl,
            mediaType: isMe ? d.mediaType : mediaType,
            fileName: isMe ? d.fileName : fileName,
            isBurned: false, isSentByMe: isMe, recalled: false, edited: d.edited || false,
          }

          setMessages(prev => {
            if (prev.find(m => m.documentId === msg.documentId)) return prev
            return [...prev, msg]
          })

          // Schedule burn for received messages
          if (!isMe && burnT !== 'off' && burnT !== 'exit' && BURN_MS[burnT]) {
            const ref = change.doc.ref
            setTimeout(() => {
              setMessages(prev => prev.map(m => m.documentId === change.doc.id ? { ...m, isBurned: true } : m))
              setTimeout(() => {
                setMessages(prev => prev.filter(m => m.documentId !== change.doc.id))
                deleteDoc(ref).catch(() => {})
              }, 800)
            }, BURN_MS[burnT])
          }
          // Queue for deletion on exit
          if (!isMe && (burnT === 'exit' || burnT === 'off')) {
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
          const from = d.from as string
          if (burnT !== 'off' && from === peer.userId) {
            setMessages(prev => prev.map(m => m.documentId === change.doc.id ? { ...m, isBurned: true } : m))
            setTimeout(() => setMessages(prev => prev.filter(m => m.documentId !== change.doc.id)), 800)
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

    // Add to local messages immediately (optimistic)
    setMessages(prev => {
      if (prev.find(m => m.documentId === newDoc.id)) return prev
      return [...prev, {
        documentId: newDoc.id, from: user.uid, to: peer.userId,
        text: t, mediaUrl: mUrl, mediaType: mType as ChatMessage['mediaType'],
        fileName: mFileName, timestamp: new Date(), burnTimer,
        isBurned: false, isSentByMe: true, recalled: false, edited: false,
      }]
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
    setUploading(true)
    toast('此功能需要後端支援上傳', { icon: 'ℹ️' })
    setUploading(false)
  }

  const hasBurn = burnTimer !== 'off'

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shadow-sm flex-shrink-0">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {peer.photoURL
            ? <img src={peer.photoURL} alt="" className="w-full h-full object-cover" />
            : <span className="text-orange-700 font-bold text-sm">{(peer.displayName[0] || '?').toUpperCase()}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{peer.displayName}</p>
          <p className="text-[10px] text-green-600 font-medium">E2E 加密</p>
        </div>
        <button onClick={onLock} title="鎖定此聊天室"
          className="text-gray-400 hover:text-orange-500 transition-colors">
          <Lock className="w-5 h-5" />
        </button>
      </div>

      {/* Burn banner */}
      {hasBurn && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-50 border-b border-orange-100 flex-shrink-0">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs text-orange-700">焚燒模式 — {BURN_LABELS[burnTimer]}自動銷毀</span>
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="h-1 bg-orange-100 flex-shrink-0">
          <div className="h-full bg-orange-500 animate-pulse w-1/2" />
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
            <Lock className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">尚無訊息</p>
            <p className="text-xs text-gray-300 mt-1">訊息閱後即從伺服器刪除</p>
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
      <div className="flex-shrink-0 border-t border-gray-100 bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          {/* Burn timer */}
          <div className="relative">
            <button
              onClick={() => setShowBurnMenu(!showBurnMenu)}
              className="flex flex-col items-center p-1"
            >
              <Flame className={`w-5 h-5 ${hasBurn ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className={`text-[9px] leading-none mt-0.5 ${hasBurn ? 'text-orange-500' : 'text-gray-400'}`}>
                {burnTimer === 'off' ? '關閉' : burnTimer === 'exit' ? '退出' : burnTimer}
              </span>
            </button>
            {showBurnMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[150px] z-10">
                <p className="px-3 py-1.5 text-xs font-semibold text-gray-500 border-b border-gray-100">訊息焚燒時間</p>
                {(Object.entries(BURN_LABELS) as [BurnTimer, string][]).map(([val, label]) => (
                  <button key={val} onClick={() => { setBurnTimer(val); setShowBurnMenu(false) }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-orange-50 transition-colors ${burnTimer === val ? 'text-orange-600 font-semibold' : 'text-gray-700'}`}>
                    <Flame className={`w-3.5 h-3.5 ${burnTimer === val ? 'text-orange-500' : 'text-gray-300'}`} />
                    {label}
                    {burnTimer === val && <span className="ml-auto text-orange-500 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Attach */}
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-40">
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
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setMsgOptions(null)}>
          <div className="w-full max-w-sm bg-white rounded-t-2xl py-2" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
            {!msgOptions.mediaUrl && (
              <button
                onClick={() => { setEditMode({ id: msgOptions.documentId, text: msgOptions.text }); setMsgOptions(null) }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil className="w-4 h-4" /> 編輯訊息
              </button>
            )}
            <button
              onClick={() => recallMessage(msgOptions)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Undo2 className="w-4 h-4" /> 收回訊息
            </button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setEditMode(null)}>
          <div className="w-full max-w-sm bg-white rounded-2xl p-5" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-3">編輯訊息</h3>
            <textarea
              value={editMode.text}
              onChange={e => setEditMode({ ...editMode, text: e.target.value })}
              rows={3}
              autoFocus
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setEditMode(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50">取消</button>
              <button onClick={() => editMessage(editMode.id, editMode.text)}
                className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600">儲存</button>
            </div>
          </div>
        </div>
      )}

      {/* Close burn menu on outside click */}
      {showBurnMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowBurnMenu(false)} />
      )}
    </div>
  )
}
