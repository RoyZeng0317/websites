interface Props {
  onClose: () => void
}

const LINKS = [
    {
    label: 'Circuit Lab',
    sub: '3D Circuit Simulation Lab',
    url: 'https://circuit-lab-3d.web.app/',
    primary: true,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    label: 'Falstad Circuit Simulator',
    sub: 'falstad.com — Online Circuit Simulator',
    url: 'https://www.falstad.com/circuit/',
    primary: true,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    label: 'LTspice Download',
    sub: 'analog.com — Analog Devices SPICE Simulator',
    url: 'https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html',
    primary: false,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    label: 'LCSC Components',
    sub: 'lcsc.com — Component sourcing & specs',
    url: 'https://www.lcsc.com',
    primary: false,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    label: 'DigiKey Component Search',
    sub: 'digikey.com — Global electronic component sourcing',
    url: 'https://www.digikey.com',
    primary: false,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    label: 'JLCPCB PCB Fabrication',
    sub: 'jlcpcb.com — PCB fabrication & assembly',
    url: 'https://jlcpcb.com',
    primary: false,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8.25 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H15.75M9 12h6M9 8.25h6M9 15.75h3" />
      </svg>
    ),
  },
]

export default function Circuit({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#16a34a,#064e3b)' }}>
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold">Circuit Design Tools</p>
              <p className="text-gray-500 text-xs">Simulators & Component Sourcing</p>
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
                  ? 'bg-green-900/20 border-green-700/40 hover:bg-green-900/30 hover:border-green-600/60'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'
              }`}>
              <span className={link.primary ? 'text-green-400' : 'text-gray-400 group-hover:text-gray-300'}>
                {link.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${link.primary ? 'text-green-400' : 'text-gray-200'}`}>
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
      </div>
    </div>
  )
}
