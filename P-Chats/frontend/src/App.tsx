import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import LockPage from './pages/LockPage'

function AppRoutes() {
  const { firebaseUser, userDoc, loading } = useAuth()
  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const authed = !!(firebaseUser && userDoc)

  return (
    <Routes>
      <Route path="/login" element={authed ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={authed ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/" element={authed ? <HomePage /> : <Navigate to="/login" replace />} />
      <Route path="/lock/:peerId" element={authed ? <LockPage /> : <Navigate to="/login" replace />} />
      <Route path="/chat/:peerId" element={authed ? <ChatPage /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
  )
}
