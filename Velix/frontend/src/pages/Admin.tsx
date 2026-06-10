import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { UserModel, PostModel } from '../types'
import Avatar from '../components/Avatar'
import LoadingSpinner from '../components/LoadingSpinner'

type Tab = 'stats' | 'users' | 'posts'

export default function Admin() {
  const [tab, setTab] = useState<Tab>('stats')
  const [users, setUsers] = useState<UserModel[]>([])
  const [posts, setPosts] = useState<PostModel[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchUsers() {
    setLoading(true)
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100))
    const snap = await getDocs(q)
    setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() }) as UserModel))
    setLoading(false)
  }

  async function fetchPosts() {
    setLoading(true)
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(100))
    const snap = await getDocs(q)
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() }) as PostModel))
    setLoading(false)
  }

  useEffect(() => {
    if (tab === 'users' && users.length === 0) fetchUsers()
    if (tab === 'posts' && posts.length === 0) fetchPosts()
  }, [tab])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur border-b border-dark-border px-4 h-14 flex items-center">
        <span className="font-bold text-dark-text text-lg">管理員後台</span>
      </div>

      <div className="flex border-b border-dark-border">
        {(['stats', 'users', 'posts'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === t ? 'border-velix-500 text-velix-400' : 'border-transparent text-dark-muted hover:text-dark-text'}`}
          >
            {{ stats: '統計', users: '用戶', posts: '貼文' }[t]}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-12"><LoadingSpinner size={28} /></div>}

      {!loading && tab === 'stats' && (
        <div className="p-6 grid grid-cols-2 gap-4">
          <StatCard
            label="總用戶"
            value={users.length || '—'}
            note={users.length === 0 ? '切換至用戶頁載入' : undefined}
            onLoad={fetchUsers}
          />
          <StatCard
            label="總貼文"
            value={posts.length || '—'}
            note={posts.length === 0 ? '切換至貼文頁載入' : undefined}
            onLoad={fetchPosts}
          />
        </div>
      )}

      {!loading && tab === 'users' && (
        <div className="divide-y divide-dark-border">
          {users.map(u => (
            <div key={u.uid} className="flex items-center gap-3 px-4 py-3">
              <Avatar src={u.photoUrl} name={u.displayName} size={40} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark-text truncate">{u.displayName}</p>
                <p className="text-xs text-dark-muted">@{u.username}</p>
              </div>
              <div className="text-right text-xs text-dark-muted">
                <p>{u.postsCount} 貼文</p>
                <p>{u.followersCount} 追蹤者</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === 'posts' && (
        <div className="divide-y divide-dark-border">
          {posts.map(p => (
            <div key={p.id} className="px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-dark-text">{p.authorName}</span>
                <span className="text-xs text-dark-muted">@{p.authorUsername}</span>
              </div>
              <p className="text-sm text-dark-muted truncate">{p.content}</p>
              <div className="flex gap-4 mt-1 text-xs text-dark-muted">
                <span>❤️ {p.likesCount}</span>
                <span>💬 {p.commentsCount}</span>
                <span>🔁 {p.repostsCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, note, onLoad }: { label: string; value: string | number; note?: string; onLoad?: () => void }) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-2xl p-5">
      <p className="text-2xl font-bold text-dark-text">{value}</p>
      <p className="text-sm text-dark-muted mt-1">{label}</p>
      {note && onLoad && (
        <button onClick={onLoad} className="text-xs text-velix-400 mt-2 hover:underline">{note}</button>
      )}
    </div>
  )
}
