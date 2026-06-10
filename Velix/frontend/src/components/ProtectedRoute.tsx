import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, userDoc, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  if (!firebaseUser) return <Navigate to="/login" replace />

  if ((userDoc as any)?.isSuspended) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
          <span className="text-3xl">⛔</span>
        </div>
        <h1 className="text-xl font-bold text-red-400">帳號已停權</h1>
        <p className="text-sm text-dark-muted max-w-xs">
          您的帳號因違反社群規範已被停權。如有疑問請聯絡：
          <a href="mailto:velix.help@gmail.com" className="text-velix-400 underline ml-1">velix.help@gmail.com</a>
        </p>
        <p className="text-xs text-dark-muted">違規點數達 10 點將永久停權</p>
      </div>
    )
  }

  if (userDoc?.verificationStatus !== 'verified') {
    return <Navigate to="/verify" replace />
  }

  return <>{children}</>
}
