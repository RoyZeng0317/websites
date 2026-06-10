import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, MapPin, Music, X, ChevronDown, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { createPost } from '../services/postService'
import { uploadMedia } from '../services/storageService'
import { POST_CATEGORIES, type PostCategory } from '../types'
import Avatar from '../components/Avatar'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { checkSensitive } from '../lib/sensitiveWords'

interface MediaItem {
  file: File
  preview: string
  type: 'image' | 'video'
}

export default function CreatePost() {
  const { firebaseUser, userDoc } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [content, setContent] = useState('')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [location, setLocation] = useState('')
  const [musicTitle, setMusicTitle] = useState('')
  const [musicArtist, setMusicArtist] = useState('')
  const [category, setCategory] = useState<PostCategory | ''>('')
  const [showExtras, setShowExtras] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleMediaPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    if (fileRef.current) fileRef.current.value = ''

    const hasVideoInNew = files.some(f => f.type.startsWith('video/'))
    const currentHasVideo = mediaItems.some(m => m.type === 'video')

    if (hasVideoInNew) {
      if (mediaItems.length > 0) { toast.error(t('post.videoMixError')); return }
      if (files.length > 1) { toast.error(t('post.oneVideoOnly')); return }
      const file = files[0]
      setMediaItems([{ file, preview: URL.createObjectURL(file), type: 'video' }])
      return
    }

    if (currentHasVideo) { toast.error(t('post.videoAlreadySelected')); return }

    const images = files.filter(f => f.type.startsWith('image/'))
    setMediaItems(prev => {
      const combined = [...prev, ...images.map(f => ({ file: f, preview: URL.createObjectURL(f), type: 'image' as const }))]
      if (combined.length > 9) { toast.error(t('post.maxPhotos')); return combined.slice(0, 9) }
      return combined
    })
  }

  function removeMedia(index: number) {
    setMediaItems(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    if (!content.trim() && mediaItems.length === 0) { toast.error(t('post.emptyPost')); return }
    if (!firebaseUser || !userDoc) return

    const sensitive = checkSensitive(content)
    if (sensitive.level === 2) { toast.error(t('post.sensitiveBlocked'), { duration: 4000 }); return }
    if (sensitive.level === 1) {
      const ok = window.confirm(t('post.sensitiveWarning', { words: sensitive.matched.join('、') }))
      if (!ok) return
    }

    setSubmitting(true)
    try {
      let mediaUrls: string[] | undefined
      if (mediaItems.length > 0) {
        toast.loading(t('post.uploading'), { id: 'upload' })
        mediaUrls = await Promise.all(mediaItems.map(m => uploadMedia(m.file, firebaseUser.uid)))
        toast.dismiss('upload')
      }

      await createPost(firebaseUser.uid, {
        authorName: userDoc.displayName,
        authorUsername: userDoc.username,
        authorPhotoUrl: userDoc.photoUrl,
        content: content.trim(),
        mediaUrls,
        locationName: location.trim() || undefined,
        musicTitle: musicTitle.trim() || undefined,
        musicArtist: musicArtist.trim() || undefined,
        category: category || undefined,
      })

      toast.success(t('post.publishSuccess'))
      navigate('/')
    } catch {
      toast.error(t('post.publishFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const charCount = content.length
  const isValid = content.trim().length > 0 || mediaItems.length > 0
  const canAddMore = mediaItems.length === 0 || (mediaItems[0]?.type === 'image' && mediaItems.length < 9)

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur border-b border-dark-border px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-dark-muted hover:text-dark-text text-sm">{t('common.cancel')}</button>
        <span className="font-semibold text-dark-text">{t('post.newPost')}</span>
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="btn-primary text-sm py-1.5 px-5 disabled:opacity-50 flex items-center gap-2"
        >
          {submitting ? <LoadingSpinner size={16} /> : t('post.publish')}
        </button>
      </div>

      <div className="p-4">
        <div className="flex gap-3">
          <Avatar src={userDoc?.photoUrl} name={userDoc?.displayName || ''} size={42} />
          <div className="flex-1">
            <p className="font-semibold text-dark-text text-sm mb-2">{userDoc?.displayName}</p>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={t('post.placeholder')}
              rows={5}
              className="w-full bg-transparent text-dark-text placeholder-dark-muted resize-none outline-none text-[15px] leading-relaxed"
              maxLength={1000}
            />
            {charCount > 800 && (
              <p className={`text-xs text-right ${charCount > 950 ? 'text-red-400' : 'text-dark-muted'}`}>
                {charCount}/1000
              </p>
            )}
          </div>
        </div>

        {/* Media preview */}
        {mediaItems.length > 0 && (
          <div className="mt-3 ml-[54px]">
            {mediaItems[0].type === 'video' ? (
              <div className="relative">
                <video src={mediaItems[0].preview} controls className="rounded-xl w-full max-h-80 border border-dark-border bg-black" />
                <button
                  onClick={() => removeMedia(0)}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className={`grid gap-1 ${
                mediaItems.length === 1 ? 'grid-cols-1'
                : mediaItems.length === 2 ? 'grid-cols-2'
                : 'grid-cols-3'
              }`}>
                {mediaItems.map((item, i) => (
                  <div key={i} className="relative aspect-square">
                    <img src={item.preview} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => removeMedia(i)}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
                {canAddMore && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-dark-border rounded-lg hover:border-velix-500 transition-colors gap-1"
                  >
                    <Plus size={20} className="text-dark-muted" />
                    <span className="text-xs text-dark-muted">{t('post.addMore')}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Extras toggle */}
        <div className="mt-4 ml-[54px]">
          <button
            onClick={() => setShowExtras(v => !v)}
            className="flex items-center gap-1.5 text-xs text-dark-muted hover:text-dark-text"
          >
            <ChevronDown size={14} className={`transition-transform ${showExtras ? 'rotate-180' : ''}`} />
            {t('post.addDetail')}
          </button>

          {showExtras && (
            <div className="mt-3 space-y-3">
              <select
                value={category}
                onChange={e => setCategory(e.target.value as PostCategory)}
                className="input-field text-sm py-2"
              >
                <option value="">{t('post.selectCategory')}</option>
                {POST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                <MapPin size={16} className="text-dark-muted mt-3 shrink-0" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder={t('post.location')}
                  className="input-field text-sm py-2 flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Music size={16} className="text-dark-muted mt-3 shrink-0" />
                <div className="flex gap-2 flex-1">
                  <input
                    value={musicTitle}
                    onChange={e => setMusicTitle(e.target.value)}
                    placeholder={t('post.songTitle')}
                    className="input-field text-sm py-2 flex-1"
                  />
                  <input
                    value={musicArtist}
                    onChange={e => setMusicArtist(e.target.value)}
                    placeholder={t('post.artist')}
                    className="input-field text-sm py-2 flex-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="fixed bottom-14 lg:bottom-0 left-0 right-0 lg:relative border-t border-dark-border bg-dark-bg px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={!canAddMore && mediaItems[0]?.type !== 'video'}
            className="text-velix-400 hover:text-velix-300 flex items-center gap-1.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Image size={20} />
            <span>{t('post.mediaPhotoVideo')}</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaPick}
            className="hidden"
          />
          {mediaItems.length > 0 && (
            <span className="text-xs text-dark-muted ml-auto">
              {mediaItems[0].type === 'video' ? t('post.videoCount') : t('post.photoCount', { count: mediaItems.length })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
