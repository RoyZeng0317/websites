import { useEffect, useRef, useState } from "react"
import { X, Send, Eye } from 'lucide-react'
import { timeAgo } from "../lib/dateUtils"
import { useAuth } from "../context/AuthContext"

interface StoryProps {
  post?: any
  onDelete?: () => void
}

export default function StoryBar({ post, onDelete }: StoryProps) {
  const { firebaseUser } = useAuth()
  const uid = firebaseUser?.uid || ''
  const [story, setStory] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!uid) return
    const el = cardRef.current
    if (!el) return

    let timer: ReturnType<typeof setTimeout>
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // TODO: increment story view count
        } else {
          clearTimeout(timer)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [uid])

  return <div ref={cardRef} />
}
