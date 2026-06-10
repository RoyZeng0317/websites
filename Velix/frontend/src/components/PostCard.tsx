import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Repeat2, Bookmark, MoreHorizontal, Trash2, Edit2, MapPin, Music, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ImageLightbox from './ImageLightbox'
import { timeAgo } from '../lib/dateUtils'
import { useAuth } from '../context/AuthContext'
import {
  toggleLike, subscribeIsLiked,
  toggleBookmark, subscribeIsBookmarked,
  toggleRepost, subscribeIsReposted,
  deletePost, incrementViewCount, recordInteraction,
} from '../services/postService'

import type { PostModel } from '../types'

const viewedPosts = new Set<string>()
import Avatar from './Avatar'
import CommentSheet from './CommentSheet'
import MediaCarousel from './MediaCarousel'
import toast from 'react-hot-toast'

interface PostCardProps {
  post: PostModel
  onDelete?: () => void
}

function renderContent(content: string) {
  const parts = content.split(/(#[\w一-鿿]+)/g)
  return parts.map((part, i) =>
    part.startsWith('#') ? (
      <Link
        key={i}
        to={`/hashtag/${part.slice(1)}`}
        className="text-velix-400 hover:text-velix-300"
        onClick={e => e.stopPropagation()}
      >
        {part}
      </Link>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const { firebaseUser, userDoc } = useAuth()
  const { t } = useTranslation()
  const uid = firebaseUser?.uid || ''

  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [reposted, setReposted] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showEditInput, setShowEditInput] = useState(false)
  const [lightbox, setLightbox] = useState<{ urls: string[]; index: number } | null>(null)
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!uid) return
    const u1 = subscribeIsLiked(post.id, uid, setLiked)
    const u2 = subscribeIsBookmarked(post.id, uid, setBookmarked)
    const u3 = subscribeIsReposted(post.id, uid, setReposted)
    return () => { u1(); u2(); u3() }
  }, [post.id, uid])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    let timer: ReturnType<typeof setTimeout>
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            if (!viewedPosts.has(post.id) && uid !== post.authorId) {
              viewedPosts.add(post.id)
              incrementViewCount(post.id)
              if (uid) recordInteraction(uid, post, 0.5)
            }
          }, 1000)
        } else {
          clearTimeout(timer)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [post.id])

  async function handleLike() {
    if (!uid) return
    await toggleLike(post.id, uid, liked, post)
    if (!liked) recordInteraction(uid, post, 3)
  }

  async function handleBookmark() {
    if (!uid) return
    await toggleBookmark(post.id, uid, bookmarked)
    if (!bookmarked) recordInteraction(uid, post, 4)
    toast.success(bookmarked ? t('post.unbookmarked') : t('post.bookmarked'))
  }

  async function handleRepost() {
    if (!uid) return
    await toggleRepost(post.id, uid, reposted, post)
    toast.success(reposted ? t('post.unreposted') : t('post.reposted'))
  }

  async function handleDelete() {
    if (!window.confirm(t('post.deleteConfirm'))) return
    await deletePost(post.id, post.authorId)
    toast.success(t('post.deleted'))
    onDelete?.()
  }

  async function downloadImage(url: string, filename: string) {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      toast.error(t('post.downloadFailed'))
    }
  }

  const createdAgo = timeAgo(post.createdAt)
  const isOwner = uid === post.authorId

  return (
    <article ref={cardRef} className="card px-4 py-4 hover:bg-dark-surface/30 transition-colors">
      <div className="flex gap-3">
        <Link to={`/profile/${post.authorId}`} onClick={e => e.stopPropagation()}>
          <Avatar src={post.authorPhotoUrl} name={post.authorName} size={42} />
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Link
                to={`/profile/${post.authorId}`}
                className="font-semibold text-dark-text hover:underline truncate"
                onClick={e => e.stopPropagation()}
              >
                {post.authorName}
              </Link>
              <span className="text-dark-muted text-sm truncate">@{post.authorUsername}</span>
              <span className="text-dark-muted text-sm">·</span>
              <span className="text-dark-muted text-sm whitespace-nowrap">{createdAgo}</span>
            </div>

            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(v => !v)}
                  className="p-1 rounded-full hover:bg-dark-surface text-dark-muted hover:text-dark-text transition-colors"
                >
                  <MoreHorizontal size={18} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 bg-dark-surface border border-dark-border rounded-xl shadow-xl z-10 min-w-36 overflow-hidden">
                    <button
                      onClick={() => { setShowMenu(false); setShowEditInput(true) }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-dark-border text-dark-text"
                    >
                      <Edit2 size={14} /> {t('common.edit')}
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); handleDelete() }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-dark-border text-red-400"
                    >
                      <Trash2 size={14} /> {t('common.delete')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap break-words text-dark-text">
            {renderContent(post.content)}
          </p>

          {/* Metadata */}
          {(post.locationName || post.musicTitle || post.category) && (
            <div className="mt-1.5 flex flex-wrap gap-2">
              {post.locationName && (
                <span className="flex items-center gap-1 text-xs text-dark-muted">
                  <MapPin size={12} /> {post.locationName}
                </span>
              )}
              {post.musicTitle && (
                <span className="flex items-center gap-1 text-xs text-dark-muted">
                  <Music size={12} /> {post.musicTitle}
                </span>
              )}
              {post.category && (
                <span className="text-xs text-velix-400 bg-velix-900/30 px-2 py-0.5 rounded-full">
                  {post.category}
                </span>
              )}
            </div>
          )}

          {/* Media */}
          {(() => {
            const urls = post.mediaUrls?.length
              ? post.mediaUrls
              : post.imageUrl ? [post.imageUrl]
              : post.videoUrl ? [post.videoUrl]
              : []
            if (urls.length === 0) return null

            const isVideo = (u: string) => u.includes('/video/upload/') || /\.(mp4|mov|webm)(\?|$)/i.test(u)

            // Single video
            if (urls.length === 1 && isVideo(urls[0])) {
              return (
                <div className="mt-3 rounded-xl overflow-hidden border border-dark-border bg-black">
                  <video src={urls[0]} controls className="w-full max-h-80" />
                </div>
              )
            }

            // Single image
            if (urls.length === 1) {
              return (
                <div className="relative mt-3 group">
                  <img
                    src={urls[0]}
                    alt="post"
                    className="rounded-xl max-h-96 w-full object-cover border border-dark-border cursor-zoom-in"
                    onClick={() => setLightbox({ urls, index: 0 })}
                  />
                  <button
                    onClick={e => { e.stopPropagation(); downloadImage(urls[0], `velix-${post.id}.jpg`) }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    title={t('post.downloadImage')}
                  >
                    <Download size={14} />
                  </button>
                </div>
              )
            }

            // Multiple: swipeable carousel
            return <MediaCarousel urls={urls} onPreview={(us, i) => setLightbox({ urls: us, index: i })} />
          })()}

          {/* Actions */}
          <div className="flex items-center gap-5 mt-3">
            <ActionBtn
              onClick={() => setShowComments(true)}
              icon={<MessageCircle size={18} />}
              count={post.commentsCount}
              className="text-dark-muted hover:text-velix-400"
            />
            <ActionBtn
              onClick={handleLike}
              icon={<Heart size={18} className={liked ? 'fill-red-500 text-red-500' : ''} />}
              count={post.likesCount}
              className={liked ? 'text-red-500' : 'text-dark-muted hover:text-red-400'}
            />
            <ActionBtn
              onClick={handleRepost}
              icon={<Repeat2 size={18} className={reposted ? 'text-green-400' : ''} />}
              count={post.repostsCount}
              className={reposted ? 'text-green-400' : 'text-dark-muted hover:text-green-400'}
            />
            <ActionBtn
              onClick={handleBookmark}
              icon={<Bookmark size={18} className={bookmarked ? 'fill-velix-400 text-velix-400' : ''} />}
              count={0}
              className={bookmarked ? 'text-velix-400' : 'text-dark-muted hover:text-velix-400'}
              hideCount
            />
            <span className="flex items-center gap-1 text-xs text-dark-muted ml-auto">
              <span className="flex items-end gap-[1.5px] h-[13px] overflow-hidden">
                <span className="w-[2.5px] rounded-sm bg-current" style={{ height: '55%' }} />
                <span className="w-[2.5px] rounded-sm bg-current" style={{ height: '100%' }} />
                <span className="w-[2.5px] rounded-sm bg-current" style={{ height: '40%' }} />
                <span className="w-[2.5px] rounded-sm bg-current" style={{ height: '75%' }} />
              </span>
              {post.viewsCount || 0}
            </span>
          </div>
        </div>
      </div>

      {showComments && (
        <CommentSheet post={post} onClose={() => setShowComments(false)} />
      )}
      {lightbox && (
        <ImageLightbox
          urls={lightbox.urls}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          downloadName={`velix-${post.id}.jpg`}
        />
      )}
    </article>
  )
}

function ActionBtn({
  onClick, icon, count, className, hideCount,
}: {
  onClick: () => void
  icon: React.ReactNode
  count: number
  className: string
  hideCount?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-sm transition-colors ${className}`}
    >
      {icon}
      {!hideCount && <span>{count || ''}</span>}
    </button>
  )
}
