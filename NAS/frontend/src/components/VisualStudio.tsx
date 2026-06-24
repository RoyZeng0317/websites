interface Props {
  onClose: () => void
}

const LINKS = [
  {
    label: 'Visual Studio 2022',
    sub: 'visualstudio.microsoft.com — Official site / Download',
    url: 'https://visualstudio.microsoft.com/zh-hant/',
    primary: true,
  },
  {
    label: 'Visual Studio Live Share',
    sub: 'liveshare.visualstudio.com — Real-time collaboration, no full install needed',
    url: 'https://visualstudio.microsoft.com/zh-hant/services/live-share/',
    primary: false,
  },
  {
    label: 'My Visual Studio (License Management)',
    sub: 'my.visualstudio.com — Subscriptions, keys, licenses',
    url: 'https://my.visualstudio.com',
    primary: false,
  },
  {
    label: 'Visual Studio Marketplace',
    sub: 'marketplace.visualstudio.com — Extensions',
    url: 'https://marketplace.visualstudio.com',
    primary: false,
  },
]

function VSLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M15 18 L50 8 L85 18 L85 82 L50 92 L15 82 Z"
        fill="#9333EA" opacity="0.18" />
      <path d="M18 28 L50 62 L82 28 L72 28 L50 52 L28 28 Z"
        fill="white" />
      <path d="M67 28 L82 28 L82 72 L50 62 Z"
        fill="white" opacity="0.55" />
    </svg>
  )
}

export default function VisualStudio({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4c1d95)' }}>
              <VSLogo size={26} />
            </div>
            <div>
              <p className="text-white font-semibold">Microsoft Visual Studio</p>
              <p className="text-gray-500 text-xs">Open in new tab</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info box */}
        <div className="mx-4 mt-4 px-3 py-2.5 rounded-lg bg-purple-950/30 border border-purple-900/40 flex items-start gap-2">
          <svg className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-xs text-purple-300 leading-relaxed">
            Visual Studio is a Windows desktop application and cannot be embedded. Click the links below to open in a new tab or launch from your desktop.
          </p>
        </div>

        {/* Links */}
        <div className="p-4 space-y-2">
          {LINKS.map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group ${
                link.primary
                  ? 'bg-purple-950/20 border-purple-800/40 hover:bg-purple-950/40 hover:border-purple-700/60'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${link.primary ? 'text-purple-300' : 'text-gray-200'}`}>
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
            To use from another device, access via Windows Remote Desktop (RDP).
          </p>
        </div>
      </div>
    </div>
  )
}
