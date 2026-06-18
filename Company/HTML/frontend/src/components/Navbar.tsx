import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CircuitBoard, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: '首頁' },
  { to: '/about', label: '關於我們' },
  { to: '/products', label: '產品' },
  { to: '/order', label: '專案委託' },
  { to: '/contact', label: '聯絡我們' },
  { to: '/inquiry', label: '線上諮詢' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2.5 font-bold text-gray-100">
          <CircuitBoard className="w-5 h-5 text-cyan-400" />
          <span>Stellarix <span className="text-cyan-400">Electronics</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                pathname === to
                  ? 'text-cyan-400 bg-cyan-900/20'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/60'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-gray-400 hover:text-gray-100 p-2"
          onClick={() => setOpen(o => !o)}
          aria-label="toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-6 py-4 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? 'text-cyan-400 bg-cyan-900/20'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/60'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
