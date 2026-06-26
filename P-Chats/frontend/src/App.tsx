import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './firebase'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'

type View = 'loading' | 'login' | 'register' | 'home'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [view, setView] = useState<View>('loading')

  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      setUser(u)
      setView(u ? 'home' : 'login')
    })
  }, [])

  if (view === 'loading') {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (view === 'home' && user) return <HomePage user={user} />
  if (view === 'register') return <RegisterPage onBack={() => setView('login')} />
  return <LoginPage onRegister={() => setView('register')} />
}
