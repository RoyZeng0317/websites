interface Props {
  onClose: () => void
}

const CODE_SERVER_URL = (import.meta.env.VITE_CODE_SERVER_URL as string | undefined ?? '').replace(/\/+$/, '')

const LINKS = [
  ...(CODE_SERVER_URL ? [{
    label: 'Open Android project in Code-Server',
    sub: 'Write Kotlin / Java directly in the browser',
    url: CODE_SERVER_URL,
    primary: true,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 00-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 00-1.276.057L.327 7.261A1 1 0 00.326 8.74L3.899 12 .326 15.26a1 1 0 00.001 1.479L1.65 17.94a.999.999 0 001.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 001.704.29l4.942-2.377A1.5 1.5 0 0024 20.06V3.939a1.5 1.5 0 00-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
      </svg>
    ),
  }] : []),
  {
    label: 'Android Studio Download',
    sub: 'developer.android.com — Latest stable release',
    url: 'https://developer.android.com/studio',
    primary: !CODE_SERVER_URL,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    label: 'Android Developer Docs',
    sub: 'developer.android.com — API reference & guides',
    url: 'https://developer.android.com/docs',
    primary: false,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    label: 'Jetpack Compose',
    sub: 'developer.android.com — Modern UI toolkit',
    url: 'https://developer.android.com/compose',
    primary: false,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    label: 'Firebase Console',
    sub: 'console.firebase.google.com — Backend services',
    url: 'https://console.firebase.google.com',
    primary: false,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.89 15.673L6.255.461A.542.542 0 017.27.288l2.543 4.838zM22.11 15.673L19.745.461A.542.542 0 0018.73.288L16.187 5.126zm-13.22 0l6.174-12.585A.542.542 0 0116 3.426L12 21l-4-5.327z"/>
      </svg>
    ),
  },
  {
    label: 'Google Play Console',
    sub: 'play.google.com/console — App publishing',
    url: 'https://play.google.com/console',
    primary: false,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    ),
  },
]

export default function AndroidStudio({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#3ddc84,#1a7a3f)' }}>
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold">Android Studio</p>
              <p className="text-gray-500 text-xs">Android App Development</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="p-4 space-y-2">
          {LINKS.map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group ${
                link.primary
                  ? 'bg-[#3ddc84]/10 border-[#3ddc84]/40 hover:bg-[#3ddc84]/20 hover:border-[#3ddc84]/60'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'
              }`}>
              <span className={link.primary ? 'text-[#3ddc84]' : 'text-gray-400 group-hover:text-gray-300'}>
                {'icon' in link ? link.icon : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${link.primary ? 'text-[#3ddc84]' : 'text-gray-200'}`}>
                  {link.label}
                </p>
                <p className="text-xs text-gray-500 truncate">{link.sub}</p>
              </div>
              <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          ))}
        </div>

        <div className="px-5 pb-4">
          <p className="text-xs text-gray-600 text-center">
            Android Studio must be installed locally. Click the link to download from the official website.
          </p>
        </div>
      </div>
    </div>
  )
}
