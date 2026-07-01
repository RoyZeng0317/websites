interface FolderItem { name: string }

interface Props {
  folders: FolderItem[]
  onOpenFolder: (name: string) => void
  canGoUp: boolean
  onGoUp: () => void
  /** Tailwind text-color class for the active accent, e.g. 'text-pink-400' */
  accent?: string
  /** Optional label shown above the list */
  label?: string
  /** Hint shown when the current folder has no sub-folders */
  emptyHint?: string
}

/**
 * Left-hand single-level folder explorer shared by the Music / Photos / Video apps.
 * It only lists the sub-folders of the current directory plus an "up one level"
 * button — path breadcrumbs stay in each app's own header.
 */
export default function FolderSidebar({
  folders, onOpenFolder, canGoUp, onGoUp,
  accent = 'text-blue-400', label = 'Folders', emptyHint = '沒有子資料夾',
}: Props) {
  return (
    <aside className="w-52 shrink-0 flex flex-col min-h-0 bg-gray-900/50 border-r border-gray-800">
      <div className="px-3 pt-3 pb-1 shrink-0">
        <p className="text-xs text-gray-600 uppercase tracking-wider">{label}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {canGoUp && (
          <button
            onClick={onGoUp}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors text-left"
          >
            <svg className={`w-4 h-4 shrink-0 ${accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 15l-3-3m0 0l3-3m-3 3h12.75A2.25 2.25 0 0121 11.25v6" />
            </svg>
            <span className="text-sm">上一層</span>
          </button>
        )}
        {folders.length > 0 ? folders.map(f => (
          <button
            key={f.name}
            onClick={() => onOpenFolder(f.name)}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors text-left"
          >
            <svg className="w-4 h-4 text-yellow-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
            <span className="text-sm truncate">{f.name}</span>
          </button>
        )) : (
          !canGoUp && <p className="px-2.5 py-2 text-xs text-gray-600">{emptyHint}</p>
        )}
      </div>
    </aside>
  )
}
