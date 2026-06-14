import { useState, useEffect, useRef } from 'react'
import { Flame, RotateCcw, Pencil, FileText } from 'lucide-react'
import { ChatMessage } from '../services/chatService'
import { formatMessageTime } from '../lib/i18n'

interface Props {
  message: ChatMessage
  isMe: boolean
  onLongPress?: () => void
}

export default function MessageBubble({ message, isMe, onLongPress }: Props) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function startPress() {
    if (!onLongPress) return
    longPressTimer.current = setTimeout(onLongPress, 500)
  }
  function endPress() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  if (message.recalled) {
    return (
      <div className={`flex my-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gray-100 border border-gray-200 text-gray-400 text-sm italic">
          <RotateCcw size={13} />
          {isMe ? '你收回了一則訊息' : '對方收回了一則訊息'}
        </div>
      </div>
    )
  }

  const burn = message.burnTimer !== 'off'
  const bgMe = burn ? 'bg-orange-100' : 'bg-blue-100'
  const bgPeer = burn ? 'bg-orange-50' : 'bg-gray-200'
  const bg = isMe ? bgMe : bgPeer
  const roundClass = `rounded-2xl ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`

  return (
    <div className={`flex my-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[75%] ${bg} ${roundClass} ${!!(message.mediaUrl && message.mediaType) && message.mediaType !== 'file' ? 'p-1' : 'px-3 py-2'} cursor-pointer select-none`}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
      >
        {!!(message.mediaUrl && message.mediaType) && <MediaContent message={message} />}
        {message.text && (
          <div className={`flex items-start gap-1.5 ${!!(message.mediaUrl && message.mediaType) ? 'px-2 pb-1 pt-0.5' : ''}`}>
            {burn && <Flame size={14} className="text-orange-500 mt-0.5 shrink-0" />}
            <span className="text-sm leading-snug break-words">{message.text}</span>
          </div>
        )}
        <div className={`flex items-center gap-1 mt-0.5 ${!!(message.mediaUrl && message.mediaType) && message.mediaType !== 'file' ? 'px-2 pb-1' : ''}`}>
          {!message.text && burn && <Flame size={12} className="text-orange-500" />}
          <span className="text-[10px] text-gray-400">{formatMessageTime(message.timestamp)}</span>
          {message.edited && <span className="text-[10px] text-gray-400">已編輯</span>}
          {burn && <span className="text-[10px] text-orange-500">{burnLabel(message.burnTimer)}</span>}
          {message.isBurned && <span className="text-[10px] text-orange-600">· 已焚燒</span>}
        </div>
      </div>
    </div>
  )
}

function MediaContent({ message }: { message: ChatMessage }) {
  const { mediaType, mediaUrl, fileName } = message
  if (mediaType === 'image') {
    return (
      <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={mediaUrl}
          alt="圖片"
          className="rounded-xl max-w-full max-h-60 object-cover"
          loading="lazy"
        />
      </a>
    )
  }
  if (mediaType === 'video') {
    return <VideoPlayer url={mediaUrl!} />
  }
  return (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-2 py-1 text-blue-600 underline text-sm"
    >
      <FileText size={24} className="text-orange-500 shrink-0" />
      <span className="truncate">{fileName ?? '檔案'}</span>
    </a>
  )
}

function VideoPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const onEnded = () => setPlaying(false)
    el.addEventListener('ended', onEnded)
    return () => el.removeEventListener('ended', onEnded)
  }, [])

  function toggle() {
    const el = videoRef.current
    if (!el) return
    if (playing) { el.pause(); setPlaying(false) } else { el.play(); setPlaying(true) }
  }

  return (
    <div className="relative rounded-xl overflow-hidden max-w-[240px]">
      <video ref={videoRef} src={url} className="w-full max-h-52 object-cover" preload="metadata" />
      <button
        onClick={toggle}
        className="absolute inset-0 flex items-center justify-center"
      >
        {!playing && (
          <div className="bg-black/50 rounded-full p-3">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </button>
    </div>
  )
}

function burnLabel(timer: ChatMessage['burnTimer']): string {
  switch (timer) {
    case 'exit': return '退出後'
    case '1m': return '1 分鐘'
    case '3m': return '3 分鐘'
    case '5m': return '5 分鐘'
    default: return ''
  }
}
