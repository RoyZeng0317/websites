import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Search from './pages/Search'
import CreatePost from './pages/CreatePost'
import Notifications from './pages/Notifications'
import Inbox from './pages/Inbox'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import AiChat from './pages/AiChat'
import HashtagPosts from './pages/HashtagPosts'
import Policy from './pages/Policy'
import Verify from './pages/Verify'

function AppRoutes() {
  const { firebaseUser, userDoc, loading } = useAuth()

  if (loading) return null

  // Require both firebaseUser AND userDoc to redirect away from public pages.
  // If userDoc is null (new Google user pending terms acceptance), stay on Login
  // so the terms overlay remains visible instead of being unmounted.
  const fullyAuthed = !!(firebaseUser && userDoc)

  return (
    <Routes>
      <Route path="/" element={fullyAuthed ? <Navigate to="/home" replace /> : <Landing />} />
      <Route path="/login" element={fullyAuthed ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/register" element={fullyAuthed ? <Navigate to="/home" replace /> : <Register />} />

      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
      <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
      <Route path="/inbox/:chatId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/profile/:uid" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/ai-chat" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />
      <Route path="/hashtag/:tag" element={<ProtectedRoute><HashtagPosts /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/verify" element={<Verify />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const { firebaseUser } = useAuth()

  return (
    <BrowserRouter>
      <div className="flex bg-dark-bg min-h-dvh" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <Navbar />
        {/* Mobile-first: full width on phone, centered phone-width on desktop */}
        <main
          className={`flex-1 min-w-0 w-full ${firebaseUser ? 'lg:ml-56' : ''}`}
          style={{
            paddingTop: firebaseUser ? undefined : '56px',
            paddingBottom: firebaseUser ? 'calc(3.5rem + env(safe-area-inset-bottom))' : undefined,
          }}
        >
          <div className="max-w-[430px] lg:max-w-2xl mx-auto">
            <AppRoutes />
          </div>
        </main>
      </div>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '12px',
            marginBottom: 'env(safe-area-inset-bottom)',
          },
        }}
      />
    </BrowserRouter>
  )
}
