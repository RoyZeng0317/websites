import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { timeAgo } from '../lib/dateUtils'
import { useAuth } from '../context/AuthContext'
import {
  subscribeNotifications, markNotificationRead, markAllNotificationsRead,
  approveFollowRequest, rejectFollowRequest, subscribeFollowRequests,
} from '../services/userService'
import type { NotificationModel } from '../types'
import Avatar from '../components/Avatar'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Notifications() {
  const { t } = useTranslation()
  const { firebaseUser } = useAuth()
  const [notifs, setNotifs] = useState<NotificationModel[]>([])
  const [requests, setRequests] = useState<{ uid: string; displayName: string; photoUrl: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseUser) return
    const u1 = subscribeNotifications(firebaseUser.uid, data => { setNotifs(data); setLoading(false) })
    const u2 = subscribeFollowRequests(firebaseUser.uid, setRequests)
    return () => { u1(); u2() }
  }, [firebaseUser])

  async function handleMarkAll() {
    if (!firebaseUser) return
    await markAllNotificationsRead(firebaseUser.uid)
    toast.success(t('notifications.markedAllRead'))
  }

  async function handleApprove(uid: string) {
    if (!firebaseUser) return
    await approveFollowRequest(firebaseUser.uid, uid)
    toast.success(t('notifications.acceptedFollow'))
  }

  async function handleReject(uid: string) {
    if (!firebaseUser) return
    await rejectFollowRequest(firebaseUser.uid, uid)
    toast(t('notifications.rejectedFollow'))
  }

  async function handleTap(n: NotificationModel) {
    if (!firebaseUser || n.isRead) return
    await markNotificationRead(firebaseUser.uid, n.id)
  }

  const unread = notifs.filter(n => !n.isRead).length

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={28} /></div>

  return (
    <div>
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur border-b border-dark-border px-4 h-14 flex items-center justify-between">
        <span className="font-bold text-dark-text text-lg">{t('notifications.title')} {unread > 0 && <span className="text-sm text-velix-400">({unread})</span>}</span>
        {unread > 0 && (
          <button onClick={handleMarkAll} className="flex items-center gap-1.5 text-sm text-velix-400 hover:text-velix-300">
            <Check size={16} /> {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      {/* Follow requests */}
      {requests.length > 0 && (
        <div className="border-b border-dark-border">
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-dark-muted uppercase tracking-wide">{t('notifications.followRequest')}</p>
          {requests.map(r => (
            <div key={r.uid} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-surface/40">
              <Link to={`/profile/${r.uid}`}>
                <Avatar src={r.photoUrl} name={r.displayName} size={42} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${r.uid}`} className="font-semibold text-dark-text text-sm hover:underline">
                  {r.displayName}
                </Link>
                <p className="text-xs text-dark-muted">{t('notifications.wantsToFollow')}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleApprove(r.uid)} className="btn-primary text-xs py-1 px-3">{t('notifications.accept')}</button>
                <button onClick={() => handleReject(r.uid)} className="btn-outline text-xs py-1 px-3">{t('notifications.reject')}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notifications */}
      {notifs.length === 0 && requests.length === 0 ? (
        <p className="text-center text-dark-muted py-20 text-sm">{t('notifications.empty')}</p>
      ) : (
        <div className="divide-y divide-dark-border">
          {notifs.map(n => (
            <NotifRow key={n.id} notif={n} onTap={() => handleTap(n)} />
          ))}
        </div>
      )}
    </div>
  )
}

function NotifRow({ notif, onTap }: { notif: NotificationModel; onTap: () => void }) {
  const { t } = useTranslation()
  const label = {
    like: t('notifications.liked'),
    comment: t('notifications.commented'),
    follow: t('notifications.followed'),
    followRequest: t('notifications.followRequested'),
    verified: t('notifications.verified'),
    announcement: t('notifications.announcement'),
  }[notif.type]

  if (notif.type === 'announcement') {
    return (
      <div
        onClick={onTap}
        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-dark-surface/40 transition-colors ${!notif.isRead ? 'bg-velix-900/10' : ''}`}
      >
        {!notif.isRead && <span className="w-1.5 h-1.5 mt-4 bg-velix-500 rounded-full shrink-0" />}
        <div className="w-[42px] h-[42px] rounded-full overflow-hidden shrink-0 bg-velix-900/40 flex items-center justify-center">
          <img src="/icon.png" alt="Velix" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-dark-text">
            <span className="font-semibold">{t('notifications.velixOfficial')}</span>{' '}
            <span className="text-dark-muted">{label}</span>
          </p>
          {notif.postContent && (
            <p className="text-xs text-dark-muted mt-0.5 truncate">{notif.postContent}</p>
          )}
          <p className="text-xs text-dark-muted mt-0.5">{timeAgo(notif.createdAt)}</p>
        </div>
      </div>
    )
  }

  if (notif.type === 'verified') {
    return (
      <div
        onClick={onTap}
        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-dark-surface/40 transition-colors ${!notif.isRead ? 'bg-velix-900/10' : ''}`}
      >
        {!notif.isRead && <span className="w-1.5 h-1.5 mt-4 bg-velix-500 rounded-full shrink-0" />}
        <div className="w-[42px] h-[42px] rounded-full bg-green-900/40 flex items-center justify-center shrink-0">
          <span className="text-xl">✅</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-dark-text">
            <span className="font-semibold">{t('notifications.velixOfficial')}</span>{' '}
            <span className="text-dark-muted">{label}</span>
          </p>
          <p className="text-xs text-dark-muted mt-0.5">{timeAgo(notif.createdAt)}</p>
        </div>
      </div>
    )
  }

  return (
    <Link
      to={`/profile/${notif.fromUserId}`}
      onClick={onTap}
      className={`flex items-start gap-3 px-4 py-3 hover:bg-dark-surface/40 transition-colors ${!notif.isRead ? 'bg-velix-900/10' : ''}`}
    >
      {!notif.isRead && <span className="w-1.5 h-1.5 mt-4 bg-velix-500 rounded-full shrink-0" />}
      <Avatar src={notif.fromUserPhoto} name={notif.fromUserName} size={42} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-dark-text">
          <span className="font-semibold">{notif.fromUserName}</span>{' '}
          <span className="text-dark-muted">{label}</span>
        </p>
        {notif.postContent && (
          <p className="text-xs text-dark-muted mt-0.5 truncate">{notif.postContent}</p>
        )}
        <p className="text-xs text-dark-muted mt-0.5">
          {timeAgo(notif.createdAt)}
        </p>
      </div>
    </Link>
  )
}
