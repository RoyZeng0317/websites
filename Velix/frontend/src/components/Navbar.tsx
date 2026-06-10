import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, PlusSquare, Bell, MessageCircle, Bot, Settings, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { logOut } from '../services/authService'
import Avatar from './Avatar'
import { subscribeNotifications } from '../services/userService'
import { useEffect, useRef, useState } from 'react'
import type { NotificationModel } from '../types'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const ADMIN_UIDS = new Set<string>([])

export default function Navbar() {
  const { firebaseUser, userDoc } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNav, setShowNav] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    if (!firebaseUser) return
    const unsub = subscribeNotifications(firebaseUser.uid, notifs => {
      setUnreadCount(notifs.filter(n => !n.isRead).length)
    })
    return unsub
  }, [firebaseUser])

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setShowNav(currentY <= lastScrollY.current || currentY < 50)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleLogout() {
    await logOut()
    navigate('/login')
    toast.success(t('auth.loggedOut'))
  }

  const active = (path: string) =>
    location.pathname === path ? 'text-velix-400' : 'text-dark-muted hover:text-dark-text'

  if (!firebaseUser) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/80 backdrop-blur border-b border-dark-border">
        <div className="max-w-[430px] lg:max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-velix-400">Velix</Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-dark-muted hover:text-dark-text transition-colors px-2 py-1">{t('nav.login')}</Link>
            <Link to="/register" className="text-sm font-semibold bg-velix-600 hover:bg-velix-700 text-white px-4 py-1.5 rounded-full transition-colors">{t('nav.register')}</Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      {/* Desktop sidebar (lg+) */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-56 flex-col px-4 py-6 border-r border-dark-border bg-dark-bg z-40">
        <Link to="/" className="text-2xl font-bold text-velix-400 mb-8 px-3">Velix</Link>

        <div className="flex-1 flex flex-col gap-1">
          <NavItem to="/" icon={<Home size={22} />} label={t('nav.home')} active={active('/')} />
          <NavItem to="/search" icon={<Search size={22} />} label={t('nav.search')} active={active('/search')} />
          <NavItem to="/create-post" icon={<PlusSquare size={22} />} label={t('nav.createPost')} active={active('/create-post')} />
          <NavItem
            to="/notifications"
            icon={
              <div className="relative">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-velix-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
            }
            label={t('nav.notifications')}
            active={active('/notifications')}
          />
          <NavItem to="/inbox" icon={<MessageCircle size={22} />} label={t('nav.messages')} active={active('/inbox')} />
          <NavItem to="/ai-chat" icon={<Bot size={22} />} label={t('nav.aiAssistant')} active={active('/ai-chat')} />
          {ADMIN_UIDS.has(firebaseUser.uid) && (
            <NavItem to="/admin" icon={<Shield size={22} />} label={t('nav.admin')} active={active('/admin')} />
          )}
        </div>

        <div className="flex flex-col gap-1 mt-4 border-t border-dark-border pt-4">
          <Link
            to={`/profile/${firebaseUser.uid}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${active(`/profile/${firebaseUser.uid}`)}`}
          >
            <Avatar src={userDoc?.photoUrl} name={userDoc?.displayName || ''} size={28} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-dark-text truncate">{userDoc?.displayName}</p>
              <p className="text-xs text-dark-muted truncate">@{userDoc?.username}</p>
            </div>
          </Link>
          <NavItem to="/settings" icon={<Settings size={22} />} label={t('nav.settings')} active={active('/settings')} />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dark-muted hover:text-red-400 transition-colors"
          >
            <LogOut size={22} />
            <span className="text-sm font-medium">{t('nav.logout')}</span>
          </button>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-bg border-t border-dark-border flex justify-around items-center px-2 transition-transform duration-300 ${showNav ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ height: 'calc(3.5rem + env(safe-area-inset-bottom))', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <MobileNavItem to="/" icon={<Home size={24} />} active={location.pathname === '/'} />
        <MobileNavItem to="/search" icon={<Search size={24} />} active={location.pathname === '/search'} />
        <Link
          to="/create-post"
          className="bg-velix-600 rounded-xl p-2 text-white"
        >
          <PlusSquare size={24} />
        </Link>
        <MobileNavItem
          to="/notifications"
          icon={
            <div className="relative">
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-velix-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          }
          active={location.pathname === '/notifications'}
        />
        <MobileNavItem
          to={`/profile/${firebaseUser.uid}`}
          icon={<Avatar src={userDoc?.photoUrl} name={userDoc?.displayName || ''} size={28} />}
          active={location.pathname === `/profile/${firebaseUser.uid}`}
        />
      </nav>
    </>
  )
}

function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: string }) {
  return (
    <Link to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${active}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

function MobileNavItem({ to, icon, active }: { to: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link to={to} className={`p-2 ${active ? 'text-velix-400' : 'text-dark-muted'}`}>
      {icon}
    </Link>
  )
}
