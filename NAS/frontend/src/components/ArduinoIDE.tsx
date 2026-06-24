interface Props {
  onClose: () => void
}

const LINKS = [
  {
    label: 'Arduino Web Editor',
    sub: 'app.arduino.cc — Cloud version, no install needed',
    url: 'https://app.arduino.cc/sketches',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 21a9 9 0 100-18 9 9 0 000 18zm-3.5-9h7m-5-3l3 3-3 3" />
      </svg>
    ),
    primary: true,
  },
  {
    label: 'Arduino IDE Download',
    sub: 'arduino.cc — Desktop installer',
    url: 'https://www.arduino.cc/en/software',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    primary: false,
  },
  {
    label: 'Arduino Reference',
    sub: 'docs.arduino.cc — Language reference & tutorials',
    url: 'https://docs.arduino.cc',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    primary: false,
  },
]

export default function ArduinoIDE({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#00878A,#005c5e)' }}>
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.25 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H15.75M12 8v8m-4-4h8" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold">Arduino IDE</p>
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

        {/* Links */}
        <div className="p-4 space-y-2">
          {LINKS.map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group ${
                link.primary
                  ? 'bg-[#00878A]/10 border-[#00878A]/40 hover:bg-[#00878A]/20 hover:border-[#00878A]/60'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'
              }`}>
              <span className={link.primary ? 'text-[#00C0C3]' : 'text-gray-400 group-hover:text-gray-300'}>
                {link.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${link.primary ? 'text-[#00C0C3]' : 'text-gray-200'}`}>
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
            Arduino Web Editor cannot be embedded due to security policy. Opening in new tab.
          </p>
        </div>
      </div>
    </div>
  )
}
