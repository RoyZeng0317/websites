import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { timeAgo } from '../lib/dateUtils'
import { Pencil } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { subscribeChatRooms, getChatPartner } from '../services/messageService'
import type { ChatRoom, UserModel } from '../types'
import Avatar from '../components/Avatar'
import LoadingSpinner from '../components/LoadingSpinner'

interface RoomWithPartner {
  room: ChatRoom
  partner: UserModel | null
}

export default function Inbox() {
  const { firebaseUser } = useAuth()
  const [rooms, setRooms] = useState<RoomWithPartner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseUser) return
    const unsub = subscribeChatRooms(firebaseUser.uid, async (chatRooms) => {
      const withPartners = await Promise.all(
        chatRooms.map(async room => ({
          room,
          partner: await getChatPartner(room.id, firebaseUser.uid),
        }))
      )
      setRooms(withPartners)
      setLoading(false)
    })
    return unsub
  }, [firebaseUser])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={28} /></div>

  return (
    <div>
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur border-b border-dark-border px-4 h-14 flex items-center justify-between">
        <span className="font-bold text-dark-text text-lg">訊息</span>
        <Link to="/search" className="text-dark-muted hover:text-dark-text">
          <Pencil size={20} />
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-20 text-dark-muted">
          <p>還沒有對話</p>
          <p className="text-sm mt-2">搜尋用戶並開始對話</p>
          <Link to="/search" className="btn-primary inline-block mt-4 text-sm">搜尋用戶</Link>
        </div>
      ) : (
        <div className="divide-y divide-dark-border">
          {rooms.map(({ room, partner }) => {
            if (!partner) return null
            const unread = room.unreadCount?.[firebaseUser?.uid || ''] || 0
            return (
              <Link
                key={room.id}
                to={`/inbox/${room.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-dark-surface/40 transition-colors"
              >
                <Avatar src={partner.photoUrl} name={partner.displayName} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-dark-text text-sm">{partner.displayName}</span>
                    <span className="text-xs text-dark-muted">
                      {timeAgo(room.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className={`text-sm truncate ${unread > 0 ? 'text-dark-text font-medium' : 'text-dark-muted'}`}>
                      {room.lastMessage}
                    </span>
                    {unread > 0 && (
                      <span className="bg-velix-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 ml-2">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
