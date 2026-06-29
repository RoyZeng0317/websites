import { Flame, FileText, MinusCircle } from 'lucide-react'
import { ChatMessage } from '../types'

interface Props {
  message: ChatMessage
  onLongPress?: () => void
}

function fmtTime(dt: Date) {
  return `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`
}

function burnLabel(timer: string) {
  switch (timer) {
    case 'exit': return '退出後'
    case '1m': return '1 分鐘'
    case '3m': return '3 分鐘'
    case '5m': return '5 分鐘'
    default: return ''
  }
}

export default function MessageBubble({ message, onLongPress }: Props) {
  const { isSentByMe: isMe, recalled, burnTimer, text, mediaUrl, mediaType, fileName, edited, isBurned, timestamp } = message
  const hasBurn = burnTimer !== 'off'

  if (recalled) {
    return (
      <div className={`flex mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 border border-gray-700 rounded-2xl max-w-xs">
          <MinusCircle className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span className="text-xs text-gray-500 italic">{isMe ? '你收回了一則訊息' : '對方收回了一則訊息'}</span>
        </div>
      </div>
    )
  }

  const bubbleBg = isMe
    ? (hasBurn ? 'bg-orange-600' : 'bg-blue-600')
    : (hasBurn ? 'bg-orange-900/60' : 'bg-gray-700')

  const roundedClass = isMe
    ? 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm'
    : 'rounded-tl-2xl rounded-tr-2xl rounded-bl-sm rounded-br-2xl'

  return (
    <div className={`flex mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md ${bubbleBg} ${roundedClass} ${mediaUrl && mediaType !== 'file' ? 'p-1' : 'px-3.5 py-2.5'} cursor-pointer select-none`}
        onContextMenu={e => { e.preventDefault(); onLongPress?.() }}
        onClick={e => { if (e.detail === 2) onLongPress?.() }}
      >
        {/* Media content */}
        {mediaUrl && mediaType === 'image' && (
          <img
            src={mediaUrl} alt="圖片"
            className="rounded-xl max-w-full object-cover cursor-zoom-in"
            style={{ maxHeight: 240 }}
            onClick={() => window.open(mediaUrl, '_blank')}
          />
        )}
        {mediaUrl && mediaType === 'video' && (
          <video src={mediaUrl} controls className="rounded-xl max-w-full" style={{ maxHeight: 240 }} />
        )}
        {mediaUrl && mediaType === 'file' && (
          <a href={mediaUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 py-1 hover:opacity-70 transition-opacity">
            <FileText className="w-7 h-7 text-orange-400 flex-shrink-0" />
            <span className="text-sm text-blue-300 underline truncate max-w-[200px]">{fileName || '檔案'}</span>
          </a>
        )}

        {/* Text */}
        {text && (
          <div className={`flex items-start gap-1.5 ${mediaUrl ? 'px-2.5 pt-1.5 pb-1' : ''}`}>
            {hasBurn && <Flame className="w-3.5 h-3.5 text-orange-300 flex-shrink-0 mt-0.5" />}
            <p className="text-sm text-white leading-relaxed whitespace-pre-wrap break-words">{text}</p>
          </div>
        )}

        {/* Meta row */}
        <div className={`flex items-center gap-1.5 mt-0.5 ${mediaUrl && mediaType !== 'file' ? 'px-2.5 pb-1.5' : ''}`}>
          {!text && hasBurn && <Flame className="w-3 h-3 text-orange-300" />}
          <span className="text-[10px] text-white/50">{fmtTime(timestamp)}</span>
          {edited && <span className="text-[10px] text-white/40">已編輯</span>}
          {hasBurn && <span className="text-[10px] text-orange-300">{burnLabel(burnTimer)}</span>}
          {isBurned && <span className="text-[10px] text-orange-400">已焚燒</span>}
        </div>
      </div>
    </div>
  )
}
