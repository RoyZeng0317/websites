import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Lock, Instagram, Youtube, Globe, Link2, UserPlus, UserMinus, Loader2, ArrowLeft, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { subscribeUser, followUser, unfollowUser, cancelFollowRequest, subscribeIsFollowing, subscribeIsFollowRequestPending, getFollowers, getFollowing } from '../services/userService'
import { subscribeUserPosts, getUserBookmarks } from '../services/postService'
import type { UserModel, PostModel } from '../types'
import Avatar from '../components/Avatar'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

type Tab = 'posts' | 'bookmarks' | 'reposts'

export default function Profile() {
  const { uid } = useParams<{ uid: string }>()
  const { firebaseUser, userDoc: currentUserDoc } = useAuth()
  const { t } = useTranslation()

  const [profile, setProfile] = useState<UserModel | null>(null)
  const [posts, setPosts] = useState<PostModel[]>([])
  const [bookmarks, setBookmarks] = useState<PostModel[]>([])
  const [tab, setTab] = useState<Tab>('posts')
  const [following, setFollowing] = useState(false)
  const [requestPending, setRequestPending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showFollowList, setShowFollowList] = useState<'followers' | 'following' | null>(null)
  const [followList, setFollowList] = useState<UserModel[]>([])

  const isOwn = firebaseUser?.uid === uid
  const navigate = useNavigate()

  useEffect(() => {
    if (!uid) return
    const u1 = subscribeUser(uid, u => { setProfile(u); setLoading(false) })
    const u2 = subscribeUserPosts(uid, setPosts)
    return () => { u1(); u2() }
  }, [uid])

  useEffect(() => {
    if (!firebaseUser || !uid || isOwn) return
    const u1 = subscribeIsFollowing(firebaseUser.uid, uid, setFollowing)
    const u2 = subscribeIsFollowRequestPending(firebaseUser.uid, uid, setRequestPending)
    return () => { u1(); u2() }
  }, [firebaseUser, uid, isOwn])

  useEffect(() => {
    if (!isOwn || !firebaseUser) return
    if (tab === 'bookmarks' && bookmarks.length === 0) {
      getUserBookmarks(firebaseUser.uid).then(setBookmarks)
    }
  }, [tab, isOwn, firebaseUser])

  async function handleFollow() {
    if (!firebaseUser || !currentUserDoc || !profile || !uid) return
    setActionLoading(true)
    try {
      if (following) {
        await unfollowUser(firebaseUser.uid, uid)
        toast(t('profile.unfollowed'))
      } else if (requestPending) {
        await cancelFollowRequest(firebaseUser.uid, uid)
        toast(t('profile.requestCancelled'))
      } else {
        await followUser(firebaseUser.uid, currentUserDoc.displayName, currentUserDoc.photoUrl, uid, profile.isPrivate)
        toast.success(profile.isPrivate ? t('profile.followRequestSent') : t('profile.startedFollowing'))
      }
    } catch {
      toast.error(t('profile.operationFailed'))
    } finally {
      setActionLoading(false)
    }
  }

  async function openFollowList(type: 'followers' | 'following') {
    if (!uid) return
    setShowFollowList(type)
    const list = type === 'followers' ? await getFollowers(uid) : await getFollowing(uid)
    setFollowList(list)
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>
  if (!profile) return <div className="text-center py-20 text-dark-muted">{t('profile.userNotFound')}</div>

  const socialIcons: Record<string, React.ReactNode> = {
    instagram: <Instagram size={14} />,
    youtube: <Youtube size={14} />,
    custom: <Globe size={14} />,
  }

  function normalizeUrl(url: string) {
    if (!url) return '#'
    return /^https?:\/\//i.test(url) ? url : 'https://' + url
  }

  return (
    <div>
      {/* Top nav bar */}
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur border-b border-dark-border px-2 h-14 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 text-dark-muted hover:text-dark-text transition-colors">
          <ArrowLeft size={22} />
        </button>
        <span className="font-bold text-dark-text truncate max-w-[60%] text-center">@{profile.username}</span>
        {isOwn ? (
          <Link to="/settings" className="p-2 text-dark-muted hover:text-dark-text transition-colors">
            <Settings size={22} />
          </Link>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Profile header */}
      <div className="px-4 pt-4 pb-4 border-b border-dark-border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-dark-text">{profile.displayName}</h1>
            <p className="text-sm text-dark-muted">@{profile.username}</p>
          </div>
          <Avatar src={profile.photoUrl} name={profile.displayName} size={64} />
        </div>

        {profile.isPrivate && (
          <div className="flex items-center gap-1 mt-2 text-xs text-dark-muted">
            <Lock size={12} /> {t('profile.privateAccount')}
          </div>
        )}

        {profile.bio && (
          <p className="mt-3 text-sm text-dark-text leading-relaxed">{profile.bio}</p>
        )}

        {/* Social links */}
        {profile.socialLinks?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.socialLinks.map((link, i) => (
              <a
                key={i}
                href={normalizeUrl(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-velix-400 hover:text-velix-300 bg-velix-900/20 px-2.5 py-1 rounded-full"
              >
                {socialIcons[link.platform] || <Globe size={14} />}
                {link.label || link.platform}
              </a>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <span className="text-sm text-dark-text"><strong>{profile.postsCount}</strong> <span className="text-dark-muted">{t('profile.posts')}</span></span>
          <button onClick={() => openFollowList('followers')} className="text-sm text-dark-text hover:underline">
            <strong>{profile.followersCount}</strong> <span className="text-dark-muted">{t('profile.followers')}</span>
          </button>
          <button onClick={() => openFollowList('following')} className="text-sm text-dark-text hover:underline">
            <strong>{profile.followingCount}</strong> <span className="text-dark-muted">{t('profile.following')}</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          {isOwn ? (
            <Link to="/settings" className="btn-outline text-sm py-1.5 flex-1 text-center">{t('settings.editProfile')}</Link>
          ) : (
            <button
              onClick={handleFollow}
              disabled={actionLoading}
              className={`flex items-center justify-center gap-2 text-sm py-1.5 rounded-xl flex-1 transition-colors ${
                following ? 'btn-outline text-red-400 border-red-400/50' :
                requestPending ? 'btn-outline' :
                'btn-primary'
              }`}
            >
              {actionLoading ? <Loader2 size={16} className="animate-spin" /> :
               following ? <><UserMinus size={16} /> {t('profile.unfollow')}</> :
               requestPending ? t('profile.requesting') :
               <><UserPlus size={16} /> {t('profile.follow')}</>}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-border">
        <TabBtn label={t('profile.posts')} active={tab === 'posts'} onClick={() => setTab('posts')} />
        {isOwn && <TabBtn label={t('profile.bookmarks')} active={tab === 'bookmarks'} onClick={() => setTab('bookmarks')} />}
      </div>

      {/* Content */}
      {tab === 'posts' && (
        profile.isPrivate && !following && !isOwn ? (
          <div className="text-center py-16 text-dark-muted">
            <Lock size={32} className="mx-auto mb-3 opacity-40" />
            <p>{t('profile.privateAccountTitle')}</p>
            <p className="text-sm mt-1">{t('profile.privateAccountHint')}</p>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-16 text-dark-muted text-sm">{t('profile.noPosts')}</p>
        ) : (
          posts.map(p => <PostCard key={p.id} post={p} />)
        )
      )}

      {tab === 'bookmarks' && (
        bookmarks.length === 0 ? (
          <p className="text-center py-16 text-dark-muted text-sm">{t('profile.noBookmarks')}</p>
        ) : (
          bookmarks.map(p => <PostCard key={p.id} post={p} />)
        )
      )}

      {/* Follow list modal */}
      {showFollowList && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowFollowList(null)}>
          <div className="bg-dark-surface rounded-2xl w-full max-w-sm max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-dark-border font-semibold text-dark-text">
              {showFollowList === 'followers' ? t('profile.followers') : t('profile.following')}
            </div>
            {followList.length === 0 ? (
              <p className="text-center py-8 text-dark-muted text-sm">{t('profile.noData')}</p>
            ) : (
              followList.map(u => (
                <Link
                  key={u.uid}
                  to={`/profile/${u.uid}`}
                  onClick={() => setShowFollowList(null)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-dark-border/30"
                >
                  <Avatar src={u.photoUrl} name={u.displayName} size={40} />
                  <div>
                    <p className="text-sm font-semibold text-dark-text">{u.displayName}</p>
                    <p className="text-xs text-dark-muted">@{u.username}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${active ? 'border-velix-500 text-velix-400' : 'border-transparent text-dark-muted hover:text-dark-text'}`}
    >
      {label}
    </button>
  )
}
