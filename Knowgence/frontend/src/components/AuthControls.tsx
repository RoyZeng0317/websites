import { clearStoredUser } from './Login'

export default function AuthControls({ onLogout }: { onLogout: () => void }) {
  function handleLogout() {
    clearStoredUser()
    onLogout()
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
    >
      登出
    </button>
  )
}
