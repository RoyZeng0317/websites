import { X, Plus } from 'lucide-react'
import type { SavedAccount } from '../services/authService'

interface Props {
  accounts: SavedAccount[]
  onSelect: (account: SavedAccount) => void
  onAddNew: () => void
  onClose: () => void
}

export default function AccountSwitcher({ accounts, onSelect, onAddNew, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-dark-surface rounded-t-3xl sm:rounded-3xl border border-dark-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
          <h2 className="text-sm font-semibold text-dark-text">選擇帳號</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-dark-text p-0.5">
            <X size={18} />
          </button>
        </div>

        <div className="py-2 max-h-72 overflow-y-auto">
          {accounts.map(account => (
            <button
              key={account.uid}
              onClick={() => onSelect(account)}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-dark-bg transition-colors text-left"
            >
              {account.photoURL ? (
                <img src={account.photoURL} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-velix-700 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">
                    {(account.displayName || account.email)[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-text truncate">{account.displayName}</p>
                <p className="text-xs text-dark-muted truncate">{account.email}</p>
              </div>
            </button>
          ))}

          <button
            onClick={onAddNew}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-dark-bg transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-dark-border flex items-center justify-center shrink-0">
              <Plus size={16} className="text-dark-muted" />
            </div>
            <p className="text-sm text-dark-muted">新增帳號</p>
          </button>
        </div>
      </div>
    </div>
  )
}
