import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { timeAgo } from '../lib/dateUtils'
import { markStoryViewed } from '../services/storyService'
import Avatar from './Avatar'
import type { StoryGroup } from '../types'

interface Props {
  groups: StoryGroup[]
  startGroupIdx: number
  viewerUid: string
  onClose: () => void
}

const STORY_DURATION = 5000 // ms per story

export default function StoryViewer({ groups, startGroupIdx, viewerUid, onClose }: Props) {
  const [groupIdx, setGroupIdx] = useState(startGroupIdx)
  const [itemIdx, setItemIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(Date.now())
  const elapsedRef = useRef(0)

  const group = groups[groupIdx]
  const story = group?.items[itemIdx]

  // Mark viewed
  useEffect(() => {
    if (story && !story.viewedBy.includes(viewerUid)) {
      markStoryViewed(story.id, viewerUid).catch(() => {})
    }
  }, [story?.id])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
    }
  }, [groupIdx, itemIdx])

  // Progress timer
  useEffect(() => {
    elapsedRef.current = 0
    setProgress(0)
    startTimer()
    return stopTimer
  }, [groupIdx, itemIdx])

  function startTimer() {
    stopTimer()
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 50
      const pct = Math.min((elapsedRef.current / STORY_DURATION) * 100, 100)
      setProgress(pct)
      if (pct >= 100) goNext()
    }, 50)
  }

  function stopTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function goNext() {
    if (!group) return
    if (itemIdx < group.items.length - 1) {
      setItemIdx(i => i + 1)
    } else if (groupIdx < groups.length - 1) {
      setGroupIdx(g => g + 1)
      setItemIdx(0)
    } else {
      onClose()
    }
  }

  function goPrev() {
    if (itemIdx > 0) {
      setItemIdx(i => i - 1)
    } else if (groupIdx > 0) {
      const prevGroup = groups[groupIdx - 1]
      setGroupIdx(g => g - 1)
      setItemIdx(prevGroup.items.length - 1)
    }
  }

  if (!group || !story) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Story image */}
      <img
        src={story.imageUrl}
        alt="story"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {/* Dark gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40 pointer-events-none" />

      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 px-3 pt-3 z-10">
        {group.items.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width: i < itemIdx ? '100%' : i === itemIdx ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 px-3 flex items-center gap-3 z-10">
        <Avatar src={group.photoUrl} name={group.displayName} size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">{group.displayName}</p>
          <p className="text-xs text-white/70">{timeAgo(story.createdAt)}</p>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white p-1">
          <X size={22} />
        </button>
      </div>

      {/* Tap zones */}
      <div className="absolute inset-0 flex z-10">
        <div
          className="w-1/3 h-full cursor-pointer"
          onPointerDown={() => { setPaused(true); stopTimer() }}
          onPointerUp={() => { goPrev(); setPaused(false) }}
        />
        <div className="flex-1 h-full" />
        <div
          className="w-1/3 h-full cursor-pointer"
          onPointerDown={() => { setPaused(true); stopTimer() }}
          onPointerUp={() => { goNext(); setPaused(false) }}
        />
      </div>

      {/* Arrow buttons (desktop hint) */}
      {groupIdx > 0 && (
        <button
          onClick={e => { e.stopPropagation(); goPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden lg:flex w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full items-center justify-center text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {(groupIdx < groups.length - 1 || itemIdx < group.items.length - 1) && (
        <button
          onClick={e => { e.stopPropagation(); goNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden lg:flex w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full items-center justify-center text-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Viewer count */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <span className="text-xs text-white/50">
          {story.viewedBy.length} 人觀看
        </span>
      </div>
    </div>
  )
}
