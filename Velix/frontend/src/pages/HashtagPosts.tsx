import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Hash } from 'lucide-react'
import { getHashtagPosts } from '../services/postService'
import type { PostModel } from '../types'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HashtagPosts() {
  const { tag } = useParams<{ tag: string }>()
  const [posts, setPosts] = useState<PostModel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tag) return
    setLoading(true)
    getHashtagPosts(tag).then(data => { setPosts(data); setLoading(false) })
  }, [tag])

  return (
    <div>
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur border-b border-dark-border px-4 h-14 flex items-center gap-2">
        <Hash size={20} className="text-velix-400" />
        <span className="font-bold text-dark-text text-lg">{tag}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size={28} /></div>
      ) : posts.length === 0 ? (
        <p className="text-center py-20 text-dark-muted text-sm">找不到 #{tag} 的貼文</p>
      ) : (
        <>
          <p className="px-4 py-3 text-sm text-dark-muted">{posts.length} 則貼文</p>
          {posts.map(p => <PostCard key={p.id} post={p} />)}
        </>
      )}
    </div>
  )
}
