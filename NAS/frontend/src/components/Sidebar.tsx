import { useLang } from '../context/LangContext'

interface DriveItem {
  name: string
  isMount?: boolean
}

interface Props {
  currentPath: string
  onNavigate: (segments: string[]) => void
  mountedDrives: DriveItem[]
  onOpenStorage?: () => void
  isAdmin?: boolean
  onOpenVisualStudio?: () => void
  onOpenArduino?: () => void
  onOpenAnaconda?: () => void
  onOpenCircuit?: () => void
  onOpenQuartus?: () => void
  onOpenKiCad?: () => void
  onOpenAndroidStudio?: () => void
  favorites?: string[]
  onOpenSnapshots?: () => void
}

const QUICK_ACCESS = [
  {
    segments: ['根目錄'],
    color: 'text-purple-400',
    labelKey: 'rootDir' as const,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 7.409A2.25 2.25 0 012.25 5.493V5.25" />
      </svg>
    ),
  },
  {
    segments: ['下載'],
    color: 'text-blue-400',
    labelKey: 'sidebarDownloads' as const,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    segments: ['桌面'],
    color: 'text-purple-400',
    labelKey: 'sidebarDesktop' as const,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 7.409A2.25 2.25 0 012.25 5.493V5.25" />
      </svg>
    ),
  },
  {
    segments: ['文件'],
    color: 'text-orange-400',
    labelKey: 'sidebarDocuments' as const,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    segments: ['圖片'],
    color: 'text-green-400',
    labelKey: 'sidebarPictures' as const,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    segments: ['音樂'],
    color: 'text-pink-400',
    labelKey: 'sidebarMusic' as const,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
  },
  {
    segments: ['影片'],
    color: 'text-cyan-400',
    labelKey: 'sidebarVideos' as const,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
]

const codeServerUrl = (import.meta.env.VITE_CODE_SERVER_URL ?? '').replace(/\/+$/, '')

export default function Sidebar({ currentPath, onNavigate, mountedDrives, onOpenStorage, isAdmin, onOpenVisualStudio, onOpenArduino, onOpenAnaconda, onOpenCircuit, onOpenQuartus, onOpenKiCad, onOpenAndroidStudio, favorites = [], onOpenSnapshots }: Props) {
  const { t } = useLang()
  const topLevel = currentPath.split('/')[0] ?? ''

  function isActive(segments: string[]) {
    return currentPath === segments.join('/') || currentPath.startsWith(segments.join('/') + '/')
  }

  return (
    <aside className="w-44 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col overflow-y-auto">
      {/* Quick access */}
      <div className="px-2 pt-4 pb-2">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1 px-2 font-medium">
          {t.sidebarQuickAccess}
        </p>
        {QUICK_ACCESS.map(item => {
          const active = isActive(item.segments)
          return (
            <button
              key={item.segments[0]}
              onClick={() => onNavigate(item.segments)}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                active
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className={active ? 'text-white' : item.color}>{item.icon}</span>
              {t[item.labelKey]}
            </button>
          )
        })}
      </div>

      {/* External drives */}
      <div className="px-2 pt-2 pb-2 border-t border-gray-800">
        <div className="flex items-center justify-between px-2 mb-1">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
            {t.sidebarExtDrives}
          </p>
          {isAdmin && onOpenStorage && (
            <button
              onClick={onOpenStorage}
              title="Disk Manager"
              className="text-gray-600 hover:text-gray-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          )}
        </div>

        {mountedDrives.length === 0 ? (
          <p className="text-xs text-gray-700 px-2 py-1">{t.sidebarNoDrives}</p>
        ) : (
          mountedDrives.map(drive => {
            const active = topLevel === drive.name
            return (
              <button
                key={drive.name}
                onClick={() => onNavigate([drive.name])}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                  active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <svg className={`w-4 h-4 shrink-0 ${active ? 'text-blue-300' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-1 5a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
                <span className="truncate">{drive.name}</span>
              </button>
            )
          })
        )}
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="px-2 pt-2 pb-2 border-t border-gray-800">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1 px-2 font-medium">
            Favorites
          </p>
          {favorites.map(fav => {
            const parts = fav.split('/').filter(Boolean)
            const name = parts[parts.length - 1] ?? (fav || 'Root')
            const active = currentPath === fav || currentPath.startsWith(fav + '/')
            return (
              <button
                key={fav}
                onClick={() => onNavigate(fav ? fav.split('/').filter(Boolean) : [])}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors mb-0.5 ${
                  active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                title={fav || '/'}
              >
                <svg className="w-3.5 h-3.5 shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/>
                </svg>
                <span className="truncate text-xs">{name}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Snapshots shortcut */}
      {onOpenSnapshots && (
        <div className="px-2 pb-2 border-t border-gray-800 pt-2">
          <button
            onClick={onOpenSnapshots}
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
            </svg>
            Snapshot Manager
          </button>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Dev tools list */}
      {(codeServerUrl || onOpenVisualStudio || onOpenArduino || onOpenAnaconda || onOpenCircuit || onOpenQuartus || onOpenKiCad || onOpenAndroidStudio) && (
        <div className="px-2 pt-2 pb-3 border-t border-gray-800">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1 px-2 font-medium">Dev Tools</p>

          {codeServerUrl && (
            <a href={codeServerUrl} target="_blank" rel="noopener noreferrer" title={t.openVSCode}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mb-0.5">
              <svg className="w-4 h-4 shrink-0 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.15 2.587L18.21.21a1.494 1.494 0 00-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 00-1.276.057L.327 7.261A1 1 0 00.326 8.74L3.899 12 .326 15.26a1 1 0 00.001 1.479L1.65 17.94a.999.999 0 001.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 001.704.29l4.942-2.377A1.5 1.5 0 0024 20.06V3.939a1.5 1.5 0 00-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
              </svg>
              VS Code
            </a>
          )}

          {onOpenVisualStudio && (
            <button onClick={onOpenVisualStudio}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mb-0.5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 100 100" fill="none">
                <path d="M18 28 L50 62 L82 28 L72 28 L50 52 L28 28 Z" fill="#9333ea"/>
                <path d="M67 28 L82 28 L82 72 L50 62 Z" fill="#9333ea" opacity="0.55"/>
              </svg>
              Visual Studio
            </button>
          )}

          {onOpenArduino && (
            <button onClick={onOpenArduino}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mb-0.5">
              <svg className="w-4 h-4 shrink-0 text-[#00878A]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M8.25 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H15.75M12 8v8m-4-4h8" />
              </svg>
              Arduino IDE
            </button>
          )}

          {onOpenAnaconda && (
            <button onClick={onOpenAnaconda}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mb-0.5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#43B049" strokeWidth="1.5"/>
                <path d="M9 8.5c0-.83.67-1.5 1.5-1.5h3a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h3a1.5 1.5 0 010 3h-3A1.5 1.5 0 019 14.5"
                  stroke="#43B049" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Jupyter
            </button>
          )}

          {onOpenCircuit && (
            <button onClick={onOpenCircuit}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mb-0.5">
              <svg className="w-4 h-4 shrink-0 text-[#0071c5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                  d="M8.25 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H15.75M9 12h6M9 8.25h6M9 15.75h3" />
              </svg>
              3D Circuit Lab
            </button>
          )}

          {onOpenQuartus && (
            <button onClick={onOpenQuartus}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mb-0.5">
              <svg className="w-4 h-4 shrink-0 text-[#0071c5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                  d="M8.25 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H15.75M9 12h6M9 8.25h6M9 15.75h3" />
              </svg>
              Quartus Prime
            </button>
          )}

          {onOpenKiCad && (
            <button onClick={onOpenKiCad}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mb-0.5">
              <svg className="w-4 h-4 shrink-0 text-[#6b8cff]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              KiCad EDA
            </button>
          )}
          {onOpenAndroidStudio && (
            <button onClick={onOpenAndroidStudio}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mb-0.5">
              <svg className="w-4 h-4 shrink-0 text-[#3ddc84]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              Android Studio
            </button>
          )}
        </div>
      )}
    </aside>
  )
}
