import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Image as ImageIcon, Trash2, Edit2, Check, Download } from 'lucide-react'
import ImageLightbox from '../components/ImageLightbox'
import { timeAgo } from '../lib/dateUtils'
import { useAuth } from '../context/AuthContext'
import {
  subscribeMessages, sendMessage, editMessage, recallMessage,
  markMessagesRead, getChatPartner,
} from '../services/messageService'
import { uploadImage } from '../services/storageService'
import type { MessageModel, UserModel } from '../types'
import Avatar from '../components/Avatar'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { checkSensitive } from '../lib/sensitiveWords'

export default function Chat() {
  const { chatId } = useParams<{ chatId: string }>()
  const { firebaseUser, userDoc } = useAuth()

  const [partner, setPartner] = useState<UserModel | null>(null)
  const [messages, setMessages] = useState<MessageModel[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(true)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!chatId || !firebaseUser) return
    getChatPartner(chatId, firebaseUser.uid).then(p => { setPartner(p); setLoading(false) })
    markMessagesRead(chatId, firebaseUser.uid)
    const unsub = subscribeMessages(chatId, msgs => {
      setMessages(msgs)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    })
    return unsub
  }, [chatId, firebaseUser])

  async function downloadImage(url: string) {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `velix-img-${Date.now()}.jpg`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      toast.error('下載失敗')
    }
  }

  async function handleSend() {
    if (!text.trim() || !firebaseUser || !partner || !chatId) return

    const sensitive = checkSensitive(text)
    if (sensitive.level === 2) {
      toast.error('訊息含有違規字詞，無法傳送', { duration: 4000 })
      return
    }
    if (sensitive.level === 1) {
      const ok = window.confirm(`訊息含有不當字詞（${sensitive.matched.join('、')}），確定傳送？`)
      if (!ok) return
    }

    const partnerId = partner.uid
    setSending(true)
    try {
      await sendMessage(firebaseUser.uid, partnerId, text.trim())
      setText('')
    } catch {
      toast.error('發送失敗')
    } finally {
      setSending(false)
    }
  }

  async function handleImageSend(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !firebaseUser || !partner) return
    setSending(true)
    try {
      const url = await uploadImage(file, firebaseUser.uid, 'chat')
      await sendMessage(firebaseUser.uid, partner.uid, '', url)
    } catch {
      toast.error('發送失敗')
    } finally {
      setSending(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function saveEdit(msgId: string) {
    if (!editText.trim() || !chatId) return
    await editMessage(chatId, msgId, editText.trim())
    setEditingId(null)
    setEditText('')
  }

  async function handleRecall(msgId: string) {
    if (!chatId || !window.confirm('確定要收回此訊息？')) return
    await recallMessage(chatId, msgId)
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={28} /></div>

  return (
    <>
    <div className="flex flex-col h-screen lg:h-[calc(100vh-0px)]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-bg border-b border-dark-border px-4 h-14 flex items-center gap-3 shrink-0">
        <Link to="/inbox" className="text-dark-muted hover:text-dark-text"><ArrowLeft size={22} /></Link>
        {partner && (
          <>
            <Link to={`/profile/${partner.uid}`}>
              <Avatar src={partner.photoUrl} name={partner.displayName} size={36} />
            </Link>
            <Link to={`/profile/${partner.uid}`} className="font-semibold text-dark-text hover:underline">
              {partner.displayName}
            </Link>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-20 lg:pb-4">
        {messages.map(msg => {
          const isMine = msg.senderId === firebaseUser?.uid
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}>
              <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                {msg.isRecalled ? (
                  <span className="text-xs text-dark-muted italic px-3 py-2">訊息已收回</span>
                ) : (
                  <>
                    {editingId === msg.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(msg.id); if (e.key === 'Escape') setEditingId(null) }}
                          className="input-field text-sm py-2 flex-1"
                          autoFocus
                        />
                        <button onClick={() => saveEdit(msg.id)} className="text-velix-400"><Check size={16} /></button>
                      </div>
                    ) : (
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 ${isMine ? 'bg-velix-700 text-white rounded-br-sm' : 'bg-dark-surface text-dark-text rounded-bl-sm'}`}
                      >
                        {msg.imageUrl && (
                          <div className="relative group mb-1">
                            <img
                              src={msg.imageUrl}
                              alt="img"
                              className="rounded-xl max-w-48 cursor-zoom-in"
                              onClick={() => setLightboxSrc(msg.imageUrl!)}
                            />
                            <button
                              onClick={() => downloadImage(msg.imageUrl!)}
                              className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="下載圖片"
                            >
                              <Download size={12} />
                            </button>
                          </div>
                        )}
                        {msg.content && <p className="text-sm leading-relaxed">{msg.content}</p>}
                        {msg.isEdited && <span className="text-[10px] opacity-60 ml-1">已編輯</span>}
                      </div>
                    )}
                    <div className={`flex items-center gap-2 mt-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[10px] text-dark-muted">
                        {timeAgo(msg.createdAt)}
                      </span>
                      {isMine && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingId(msg.id); setEditText(msg.content) }} className="text-dark-muted hover:text-dark-text">
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => handleRecall(msg.id)} className="text-dark-muted hover:text-red-400">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="fixed lg:sticky bottom-14 lg:bottom-0 left-0 right-0 bg-dark-bg border-t border-dark-border px-4 py-3 z-20">
        <div className="flex items-center gap-3 max-w-xl mx-auto lg:max-w-none">
          <button onClick={() => fileRef.current?.click()} className="text-dark-muted hover:text-velix-400 shrink-0">
            <ImageIcon size={20} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSend} className="hidden" />
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="傳送訊息..."
            className="flex-1 bg-dark-surface border border-dark-border rounded-full px-4 py-2.5 text-sm text-dark-text placeholder-dark-muted outline-none focus:border-velix-500"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="text-velix-400 disabled:opacity-40 hover:text-velix-300 transition-colors shrink-0"
          >
            {sending ? <LoadingSpinner size={20} /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
    {lightboxSrc && (
      <ImageLightbox urls={[lightboxSrc]} onClose={() => setLightboxSrc(null)} />
    )}
    </>
  )
}
