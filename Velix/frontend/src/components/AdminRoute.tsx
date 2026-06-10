import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'
import type { ReactNode } from 'react'

const ADMIN_UIDS = new Set<string>([
  // Add your admin UID here
])

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  if (!firebaseUser) return <Navigate to="/login" replace />
  if (!ADMIN_UIDS.has(firebaseUser.uid)) return <Navigate to="/" replace />
  return <>{children}</>
}
