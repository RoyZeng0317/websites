import { Mail, Phone, MapPin, Clock, MessageSquare, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContactUsProps {
  className?: string;
}

const contactItems = [
  {
    icon: Mail,
    label: '電子郵件',
    labelEn: 'Email',
    value: 'stellarix.help@gmail.com',
    href: 'mailto:stellarix.help@gmail.com',
  },
  {
    icon: Phone,
    label: '聯絡電話',
    labelEn: 'Phone',
    value: '+8860981935030',
    href: 'tel:+8860981935030',
  },
  {
    icon: MapPin,
    label: '公司地址',
    labelEn: 'Address',
    value: '台灣 雲林縣 虎尾鎮 興南里 147 號',
    href: 'https://maps.google.com',
  },
  {
    icon: Clock,
    label: '服務時間',
    labelEn: 'Business Hours',
    value: '週一 ～ 週五　09:00 – 18:00',
    href: null,
  },
  {
    icon: Globe,
    label: '官方網站',
    labelEn: 'Website',
    value: 'www.stellarix-electronics.com',
    href: 'https://stellarix-electronics.web.app',
  },
  {
    icon: MessageSquare,
    label: '線上諮詢',
    labelEn: 'Online Inquiry',
    value: '填寫表單，我們將於 3-5 個工作日內回覆',
    href: 'mailto:contact@stellarix-electronics.com',
  },
];

export default function ContactUs({ className = '' }: ContactUsProps) {
  
  return (
    <div className={`bg-gray-950 text-gray-100 min-h-screen ${className}`}>

      {/* Header */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-gray-950 to-cyan-900/20 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Stellarix Electronics
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            聯絡<span className="text-cyan-400">我們</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            無論是專案諮詢、電路開發合作或技術支援，歡迎透過以下方式與我們聯繫。
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactItems.map(({ icon: Icon, label, labelEn, value, href }) => {
            const inner = (
              <>
                <div className="w-10 h-10 rounded-lg bg-cyan-900/40 flex items-center justify-center mb-4 flex-shrink-0">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-xs text-gray-500 mb-1">{labelEn}</p>
                <h3 className="font-semibold text-gray-200 mb-2">{label}</h3>
                <p className="text-sm text-gray-400 leading-relaxed break-all">{value}</p>
              </>
            );

            const base =
              'bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col transition-colors duration-300';

            return href ? (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`${base} hover:border-cyan-700 cursor-pointer`}
              >
                {inner}
              </a>
            ) : (
              <div key={label} className={base}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-cyan-900/30 to-indigo-900/30 border border-cyan-800/40 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">準備開始您的專案？</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            從電路原型到量產韌體，我們的工程師團隊隨時準備提供專業支援。
          </p>
          <Link
            to="/order"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
          >
            立即發送需求
          </Link>
        </div>
      </section>

    </div>
  );
}
