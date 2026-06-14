import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Send, Paperclip, Flame, Lock, X, Pencil, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ChatService, ChatMessage, ChatUser } from '../services/chatService'
import { mediaService } from '../services/mediaService'
import MessageBubble from '../components/MessageBubble'

type BurnTimer = ChatMessage['burnTimer']

const BURN_OPTIONS: { value: BurnTimer; label: string; short: string }[] = [
  { value: 'off', label: '關閉焚燒', short: '關閉' },
  { value: 'exit', label: '對方退出後', short: '退出' },
  { value: '1m', label: '1 分鐘後', short: '1m' },
  { value: '3m', label: '3 分鐘後', short: '3m' },
  { value: '5m', label: '5 分鐘後', short: '5m' },
]

export default function ChatPage() {
  const { peerId } = useParams<{ peerId: string }>()!
  const location = useLocation()
  const navigate = useNavigate()
  const { encryptionService, userDoc } = useAuth()
  const state = location.state as { displayName?: string; chatUser?: ChatUser } | null

  const chatServiceRef = useRef<ChatService | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [burnTimer, setBurnTimer] = useState<BurnTimer>('off')
  const [showBurnPicker, setShowBurnPicker] = useState(false)
  const [showAttach, setShowAttach] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null)
  const [editText, setEditText] = useState('')
  const [showOptions, setShowOptions] = useState<ChatMessage | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const hasBurn = burnTimer !== 'off'

  const peerDisplayName = state?.displayName ?? peerId ?? ''

  const onMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg])
    if (!msg.isSentByMe && msg.burnTimer !== 'off') {
      const delay = msg.burnTimer === '1m' ? 60_000 : msg.burnTimer === '3m' ? 180_000 : msg.burnTimer === '5m' ? 300_000 : null
      if (delay) setTimeout(() => setMessages(prev => prev.filter(m => m.documentId !== msg.documentId)), delay)
    }
  }, [])

  const onEvent = useCallback((event: { type: string; documentId: string; newText?: string }) => {
    if (event.type === 'recall') {
      setMessages(prev => prev.map(m => m.documentId === event.documentId ? { ...m, recalled: true } : m))
      setTimeout(() => setMessages(prev => prev.filter(m => m.documentId !== event.documentId || !m.recalled)), 10_000)
    } else if (event.type === 'edit') {
      setMessages(prev => prev.map(m => m.documentId === event.documentId ? { ...m, text: event.newText ?? m.text, edited: true } : m))
    } else if (event.type === 'burn') {
      setMessages(prev => prev.map(m => m.documentId === event.documentId ? { ...m, isBurned: true } : m))
      setTimeout(() => setMessages(prev => prev.filter(m => m.documentId !== event.documentId || !m.isBurned)), 800)
    }
  }, [])

  useEffect(() => {
    if (!userDoc || !peerId) return
    const svc = new ChatService(encryptionService, userDoc.uid, userDoc.userHandle, userDoc.displayName)
    svc.setHandlers(onMessage, onEvent)
    svc.listenToMessages(peerId)
    chatServiceRef.current = svc
    return () => { svc.dispose() }
  }, [encryptionService, userDoc, peerId, onMessage, onEvent])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const t = text.trim()
    if (!t || !chatServiceRef.current) return
    setText('')
    await chatServiceRef.current.sendMessage(peerId!, t, { burnTimer })
  }

  async function sendMedia(file: File, mediaType: 'image' | 'video' | 'file') {
    if (!chatServiceRef.current || !userDoc) return
    setUploading(true)
    setShowAttach(false)
    try {
      const resourceType = mediaType === 'file' ? 'raw' : mediaType
      const result = await mediaService.upload(userDoc.uid, file, resourceType)
      if (!result) { toast.error('上傳失敗'); return }
      await chatServiceRef.current.sendMessage(peerId!, '', {
        burnTimer,
        mediaUrl: result.url,
        mediaType,
        fileName: mediaType === 'file' ? file.name : undefined,
        cloudinaryPublicId: result.publicId,
      })
    } catch (e) {
      toast.error(`上傳錯誤：${e}`)
    } finally {
      setUploading(false)
    }
  }

  async function saveEdit() {
    if (!editingMsg || !chatServiceRef.current) return
    const t = editText.trim()
    if (t && t !== editingMsg.text) {
      await chatServiceRef.current.editMessage(editingMsg.documentId, peerId!, t)
    }
    setEditingMsg(null)
  }

  async function recallMsg(msg: ChatMessage) {
    if (!chatServiceRef.current) return
    setShowOptions(null)
    await chatServiceRef.current.recallMessage(msg.documentId, peerId!)
  }

  function lockAndBack() {
    chatServiceRef.current?.stopListening()
    import('../lib/sessionLock').then(({ sessionLock }) => sessionLock.lockPeer(peerId!))
    navigate(-1)
  }

  return (
    <div className="flex flex-col h-dvh bg-white">
      {/* AppBar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-orange-500 text-white shadow">
        <button onClick={() => navigate(-1)} className="p-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{peerDisplayName}</p>
          <p className="text-xs text-orange-100">E2E 加密</p>
        </div>
        <button onClick={lockAndBack} title="重新鎖定此聊天室">
          <Lock size={20} />
        </button>
      </div>

      {/* Burn notice */}
      {hasBurn && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-700 text-xs">
          <Flame size={13} />
          焚燒模式 — {BURN_OPTIONS.find(o => o.value === burnTimer)?.label}自動銷毀
        </div>
      )}

      {/* Upload progress */}
      {uploading && <div className="h-1 bg-orange-200 animate-pulse" />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            尚無訊息 — 訊息閱後即從伺服器刪除
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble
            key={msg.documentId}
            message={msg}
            isMe={msg.isSentByMe}
            onLongPress={msg.isSentByMe && !msg.recalled ? () => setShowOptions(msg) : undefined}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t bg-white px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-1.5">
          {/* Burn timer */}
          <button
            onClick={() => setShowBurnPicker(v => !v)}
            className="flex flex-col items-center px-1 min-w-[36px]"
          >
            <Flame size={20} className={hasBurn ? 'text-orange-500' : 'text-gray-400'} />
            <span className={`text-[9px] ${hasBurn ? 'text-orange-500' : 'text-gray-400'}`}>
              {BURN_OPTIONS.find(o => o.value === burnTimer)?.short ?? '關閉'}
            </span>
          </button>

          {/* Attach */}
          <button onClick={() => setShowAttach(v => !v)} disabled={uploading}>
            <Paperclip size={20} className="text-gray-400" />
          </button>

          {/* Text input */}
          <textarea
            rows={1}
            placeholder="輸入訊息（加密傳送）…"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            className="flex-1 border rounded-2xl px-4 py-2 text-sm outline-none focus:border-orange-400 resize-none max-h-32"
          />

          {/* Send */}
          <button
            onClick={sendMessage}
            disabled={!text.trim() || uploading}
            className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition disabled:opacity-40 shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Burn timer picker */}
      {showBurnPicker && (
        <div className="fixed inset-0 z-40" onClick={() => setShowBurnPicker(false)}>
          <div
            className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl shadow-xl border overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <p className="px-4 pt-3 pb-2 font-medium text-sm text-gray-600">訊息焚燒時間</p>
            {BURN_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setBurnTimer(opt.value); setShowBurnPicker(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm ${burnTimer === opt.value ? 'text-orange-500 font-medium' : ''}`}
              >
                <Flame size={16} className={opt.value !== 'off' ? 'text-orange-400' : 'text-gray-300'} />
                {opt.label}
                {burnTimer === opt.value && <span className="ml-auto text-orange-500">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attach menu */}
      {showAttach && (
        <div className="fixed inset-0 z-40" onClick={() => setShowAttach(false)}>
          <div
            className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl shadow-xl border overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm"
              onClick={() => imageInputRef.current?.click()}>
              <span className="text-orange-500">🖼️</span> 從相簿選擇圖片
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm"
              onClick={() => videoInputRef.current?.click()}>
              <span className="text-orange-500">🎬</span> 從相簿選擇影片
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm"
              onClick={() => fileInputRef.current?.click()}>
              <span className="text-gray-500">📎</span> 傳送檔案
            </button>
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) sendMedia(f, 'image'); e.target.value = '' }} />
      <input ref={videoInputRef} type="file" accept="video/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) sendMedia(f, 'video'); e.target.value = '' }} />
      <input ref={fileInputRef} type="file" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) sendMedia(f, 'file'); e.target.value = '' }} />

      {/* Message options bottom sheet */}
      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowOptions(null)}>
          <div className="w-full bg-white rounded-t-2xl shadow-xl border-t" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1" />
            {!(showOptions.mediaUrl && showOptions.mediaType) && (
              <button
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 text-sm"
                onClick={() => { setEditingMsg(showOptions); setEditText(showOptions.text); setShowOptions(null) }}
              >
                <Pencil size={18} className="text-gray-500" />
                編輯訊息
              </button>
            )}
            <button
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 text-sm text-red-500"
              onClick={() => recallMsg(showOptions)}
            >
              <RotateCcw size={18} />
              收回訊息
            </button>
            <div className="h-4" />
          </div>
        </div>
      )}

      {/* Edit dialog */}
      {editingMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl">
            <h3 className="font-semibold mb-3">編輯訊息</h3>
            <textarea
              autoFocus
              rows={3}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 resize-none"
            />
            <div className="flex gap-2 mt-3 justify-end">
              <button onClick={() => setEditingMsg(null)} className="px-4 py-2 text-sm text-gray-500">取消</button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
