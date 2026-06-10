import { useState, useEffect, useCallback } from 'react'
import { SearchIcon, X, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { searchUsers } from '../services/userService'
import { getHashtagPosts } from '../services/postService'
import type { UserModel, PostModel } from '../types'
import Avatar from '../components/Avatar'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'

const HISTORY_KEY = 'velix_search_history'

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}
function addHistory(q: string) {
  const h = [q, ...getHistory().filter(x => x !== q)].slice(0, 10)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
}
function removeHistory(q: string) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(x => x !== q)))
}

export default function Search() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'users' | 'posts'>('users')
  const [users, setUsers] = useState<UserModel[]>([])
  const [posts, setPosts] = useState<PostModel[]>([])
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<string[]>(getHistory())
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    addHistory(q.trim())
    setHistory(getHistory())
    try {
      if (q.startsWith('#')) {
        const tag = q.slice(1)
        const p = await getHashtagPosts(tag)
        setPosts(p)
        setTab('posts')
      } else {
        const u = await searchUsers(q.trim().toLowerCase())
        setUsers(u)
        setTab('users')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    doSearch(query)
  }

  function clearSearch() {
    setQuery('')
    setSearched(false)
    setUsers([])
    setPosts([])
  }

  return (
    <div>
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur border-b border-dark-border px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full bg-dark-surface border border-dark-border rounded-xl pl-9 pr-8 py-2.5 text-sm text-dark-text placeholder-dark-muted outline-none focus:border-velix-500"
            />
            {query && (
              <button type="button" onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-muted">
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn-primary text-sm py-2">{t('search.title')}</button>
        </form>
      </div>

      {!searched ? (
        <div className="px-4 py-4">
          {history.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-dark-text">{t('search.history')}</span>
                <button
                  onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]) }}
                  className="text-xs text-dark-muted hover:text-red-400"
                >
                  {t('search.clearAll')}
                </button>
              </div>
              <div className="space-y-1">
                {history.map(h => (
                  <div key={h} className="flex items-center justify-between group">
                    <button
                      onClick={() => { setQuery(h); doSearch(h) }}
                      className="flex items-center gap-2.5 text-sm text-dark-text py-2 flex-1 text-left"
                    >
                      <Clock size={14} className="text-dark-muted" />
                      {h}
                    </button>
                    <button
                      onClick={() => { removeHistory(h); setHistory(getHistory()) }}
                      className="text-dark-muted opacity-0 group-hover:opacity-100 p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size={28} /></div>
          ) : (
            <>
              {tab === 'users' && (
                <div className="divide-y divide-dark-border">
                  {users.length === 0 ? (
                    <p className="text-center text-dark-muted py-12 text-sm">{t('search.noUsers')}</p>
                  ) : (
                    users.map(u => <UserRow key={u.uid} user={u} />)
                  )}
                </div>
              )}
              {tab === 'posts' && (
                <div>
                  {posts.length === 0 ? (
                    <p className="text-center text-dark-muted py-12 text-sm">{t('search.noPosts')}</p>
                  ) : (
                    posts.map(p => <PostCard key={p.id} post={p} />)
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function UserRow({ user }: { user: UserModel }) {
  const { t } = useTranslation()
  return (
    <Link to={`/profile/${user.uid}`} className="flex items-center gap-3 px-4 py-3 hover:bg-dark-surface/50 transition-colors">
      <Avatar src={user.photoUrl} name={user.displayName} size={44} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-dark-text text-sm truncate">{user.displayName}</p>
        <p className="text-xs text-dark-muted">@{user.username}</p>
        {user.bio && <p className="text-xs text-dark-muted mt-0.5 truncate">{user.bio}</p>}
      </div>
      <div className="text-xs text-dark-muted text-right">
        <p>{user.followersCount} {t('search.followers')}</p>
      </div>
    </Link>
  )
}
