import { Link } from 'react-router-dom';
import { ArrowRight, CircuitBoard, Code2, Wifi, ChevronDown } from 'lucide-react';

const highlights = [
  {
    icon: CircuitBoard,
    title: '電路設計',
    desc: 'PCB 佈線、高速訊號完整性、電源管理，從原型到量產一站式服務。',
  },
  {
    icon: Code2,
    title: '韌體工程',
    desc: 'RTOS 實時系統、OTA 更新、Secure Boot，完整嵌入式軟體開發能力。',
  },
  {
    icon: Wifi,
    title: 'IoT 整合',
    desc: 'BLE、Wi-Fi、LoRaWAN 多協議支援，端到端無線解決方案。',
  },
];

export default function Home() {
  return (
    <div className="bg-gray-950 text-gray-100">

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-gray-950 to-indigo-900/30 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-900/30 border border-cyan-700/40 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-medium tracking-wider mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            電子電路 × 韌體工程
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            驅動<span className="text-cyan-400">智慧硬體</span>
            <br />的核心力量
          </h1>

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            Stellarix Electronics 專注於電子電路研發與韌體工程，
            <br className="hidden md:block" />
            協助企業將創新構想轉化為可靠的智慧產品。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-8 py-3.5 rounded-xl transition-colors duration-200"
            >
              了解我們的技術 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-gray-700 hover:border-cyan-600 text-gray-300 hover:text-cyan-400 px-8 py-3.5 rounded-xl transition-colors duration-200"
            >
              聯絡我們
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 animate-bounce">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-3">我們的專業領域</h2>
          <p className="text-gray-500 text-sm">從電路設計到系統整合，端到端的技術支援</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-cyan-700 transition-colors duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-900/40 flex items-center justify-center mb-5 group-hover:bg-cyan-900/60 transition-colors">
                <Icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
          >
            查看完整技術介紹 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50+', label: '完成專案' },
            { value: '8+', label: '年產業經驗' },
            { value: '12', label: '支援通訊協議' },
            { value: '99%', label: '量產良率達標' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-cyan-400 mb-1">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">準備開始您的專案？</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          從電路原型到量產韌體，我們的工程師團隊隨時準備提供專業支援。
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-8 py-3.5 rounded-xl transition-colors duration-200"
        >
          立即聯絡我們 <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

    </div>
  );
}
