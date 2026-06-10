import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PlusSquare, RefreshCw, Sparkles, Clock, UserPlus, Settings } from 'lucide-react'
import { subscribeFollowingFeed, getRecommendedFeed } from '../services/postService'
import { getFollowingUids } from '../services/userService'
import { useAuth } from '../context/AuthContext'
import type { PostModel } from '../types'
import PostCard from '../components/PostCard'
import LoadingSpinner from '../components/LoadingSpinner'
import StoryBar from '../components/story'

type FeedTab = 'latest' | 'recommend'

export default function Home() {
  const { t } = useTranslation()
  const { firebaseUser } = useAuth()
  const [tab, setTab] = useState<FeedTab>('latest')

  const [latestPosts, setLatestPosts] = useState<PostModel[]>([])
  const [welcomePost, setWelcomePost] = useState<PostModel | null>(null)
  const [latestLoading, setLatestLoading] = useState(true)

  const [recPosts, setRecPosts] = useState<PostModel[]>([])
  const [recLoading, setRecLoading] = useState(false)
  const recLoaded = useRef(false)

  // Latest feed — following-based, real-time
  useEffect(() => {
    if (!firebaseUser) return
    let unsub: (() => void) | undefined

    getFollowingUids(firebaseUser.uid).then(followingUids => {
      unsub = subscribeFollowingFeed(
        firebaseUser.uid,
        followingUids,
        (posts, wp) => {
          setLatestPosts(posts)
          setWelcomePost(wp)
          setLatestLoading(false)
        }
      )
    })

    return () => unsub?.()
  }, [firebaseUser?.uid])

  // Recommended feed — load on first tab switch
  useEffect(() => {
    if (tab !== 'recommend' || !firebaseUser || recLoaded.current) return
    loadRecommended()
  }, [tab, firebaseUser])

  async function loadRecommended() {
    if (!firebaseUser) return
    setRecLoading(true)
    recLoaded.current = true
    try {
      const posts = await getRecommendedFeed(firebaseUser.uid)
      setRecPosts(posts)
    } finally {
      setRecLoading(false)
    }
  }

  async function refreshRecommended() {
    recLoaded.current = false
    await loadRecommended()
  }

  const activePosts = tab === 'latest' ? latestPosts : recPosts
  const activeLoading = tab === 'latest' ? latestLoading : recLoading

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur border-b border-dark-border px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-bold text-dark-text lg:hidden">Velix</h1>
        <span className="text-lg font-bold text-dark-text hidden lg:block">{t('nav.home')}</span>
        <div className="flex items-center gap-3">
          {tab === 'recommend' && !recLoading && (
            <button onClick={refreshRecommended} className="text-dark-muted hover:text-dark-text transition-colors">
              <RefreshCw size={18} />
            </button>
          )}
          <Link to="/create-post" className="lg:hidden text-dark-muted hover:text-dark-text">
            <PlusSquare size={24} />
          </Link>
          <Link to="/settings" className="lg:hidden text-dark-muted hover:text-dark-text">
            <Settings size={22} />
          </Link>
        </div>
      </div>

      {/* Feed tabs */}
      <div className="flex border-b border-dark-border">
        <TabBtn label={t('home.latest')} icon={<Clock size={14} />} active={tab === 'latest'} onClick={() => setTab('latest')} />
        <TabBtn label={t('home.recommended')} icon={<Sparkles size={14} />} active={tab === 'recommend'} onClick={() => setTab('recommend')} />
      </div>

      <StoryBar />

      {activeLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>
      ) : tab === 'latest' && latestPosts.length === 0 ? (
        // No following yet — guide new users
        <div className="flex flex-col items-center text-center py-20 px-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-dark-surface flex items-center justify-center">
            <UserPlus size={28} className="text-dark-muted" />
          </div>
          <div>
            <p className="text-base font-semibold text-dark-text">{t('home.followPeople')}</p>
            <p className="mt-1.5 text-sm text-dark-muted leading-relaxed">
              {t('home.noFollowing')}
            </p>
          </div>
          <Link to="/search" className="btn-primary px-6 py-2.5 rounded-full text-sm flex items-center gap-2">
            <UserPlus size={16} /> {t('home.exploreUsers')}
          </Link>
          {/* Always show welcome post if available */}
          {welcomePost && (
            <div className="w-full mt-4 border-t border-dark-border pt-4">
              <p className="text-xs text-dark-muted mb-2 text-left">{t('home.fromVelix')}</p>
              <PostCard post={welcomePost} />
            </div>
          )}
        </div>
      ) : tab === 'recommend' && recPosts.length === 0 ? (
        <div className="text-center py-20 text-dark-muted">
          <Sparkles size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-base">{t('home.startInteracting')}</p>
          <p className="mt-2 text-sm">{t('home.interactHint')}</p>
        </div>
      ) : (
        <div>
          {/* Welcome post pinned at top for users who don't follow the owner */}
          {tab === 'latest' && welcomePost && (
            <div className="border-b border-dark-border/50">
              <div className="px-4 pt-2 pb-0.5">
                <span className="text-[11px] text-dark-muted bg-dark-surface px-2 py-0.5 rounded-full">{t('home.velixOfficial')}</span>
              </div>
              <PostCard post={welcomePost} />
            </div>
          )}
          {activePosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

function TabBtn({ label, icon, active, onClick }: {
  label: string; icon: React.ReactNode; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-colors ${
        active ? 'border-velix-500 text-velix-400' : 'border-transparent text-dark-muted hover:text-dark-text'
      }`}
    >
      {icon}{label}
    </button>
  )
}
