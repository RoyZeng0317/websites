import { Cpu, Zap, Wifi, Code2, TrendingUp, Shield, CircuitBoard, Layers, HardDrive, Earth } from 'lucide-react';
interface IntroduceProps {
  className?: string;
}

const coreServices = [
  {
    icon: CircuitBoard,
    title: '電路設計與 PCB 開發',
    titleEn: 'Circuit Design & PCB Development',
    desc: '從原理圖設計到多層 PCB 佈線，涵蓋高速差分訊號、電源完整性分析與 EMC 合規，確保量產可靠性。',
  },
//   {
//     icon: Cpu,
//     title: '嵌入式系統整合',
//     titleEn: 'Embedded System Integration',
//     desc: '以 ARM Cortex-M / RISC-V 為核心，整合外圍電路與韌體，從 Bare-metal 到 RTOS 全面支援。',
//   },
//   {
//     icon: Zap,
//     title: '電源管理設計',
//     titleEn: 'Power Management Design',
//     desc: '高效率 DC-DC 轉換、低功耗喚醒策略、電池充放電管理，針對工業與消費性產品優化能效。',
//   },
//   {
//     icon: Wifi,
//     title: 'IoT 連接方案',
//     titleEn: 'IoT Connectivity Solutions',
//     desc: '支援 BLE 5.x、Wi-Fi 6、LoRaWAN、NB-IoT 等協議，提供端到端的無線硬體與韌體整合服務。',
//   },
  {
    icon: HardDrive,
    title: 'NAS 私人雲端硬碟',
    titleEn: 'Cloud & Server Solutions',
    desc: '採用Linux系統，並使用生物識別2FA驗證，提供資料安全保障。',
  },
  {
    icon: Earth,
    title: '網頁平台與系統開發',
    titleEn: 'Web Platform Development',
    desc: '客製化網站、後台管理系統、雲端平台。',
  },
  {
    icon: Earth,
    title: '行動應用程式開發',
    titleEn: 'Mobile App Development',
    desc: 'Android、iOS、Flutter 跨平台開發',
  },
//   {
//     icon: Earth,
//     title: '雲端服務與資料庫系統建置',
//     titleEn: '',
//     desc: '',
//   },
];

const firmwareTrends = [
  {
    icon: Code2,
    title: 'RTOS 與即時性優化',
    body: 'FreeRTOS / Zephyr 已成為嵌入式開發主流，任務調度精度達微秒級，適用於工業控制與醫療設備對即時響應的嚴格要求。',
  },
  {
    icon: TrendingUp,
    title: 'OTA 遠端更新',
    body: '空中下載更新（OTA）已從選配走向標配。透過差分更新與 A/B 分區機制，現場設備可在不中斷運作的情況下安全升版，大幅降低維護成本。',
  },
  {
    icon: Shield,
    title: '安全啟動與硬體信任根',
    body: 'Secure Boot、TrustZone 與 HSM 晶片整合成為 IoT 韌體設計核心議題，從開機驗簽到加密金鑰儲存，構建完整的裝置身份信任鏈。',
  },
  {
    icon: Layers,
    title: 'Edge AI 推論',
    body: 'TinyML 與 CMSIS-NN 框架讓 MCU 端具備輕量推論能力，圖像分類、異常偵測等 AI 功能已可在無雲端依賴的離線場景中穩定運行。',
  },
];

export default function Introduce({ className = '' }: IntroduceProps) {
  return (
    <div className={`bg-gray-950 text-gray-100 min-h-screen ${className}`}>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-gray-950 to-indigo-900/20 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Stellarix Electronics
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            驅動下一代
            <span className="text-cyan-400"> 智慧硬體</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            我們專注於電子電路研發與韌體工程，從原型設計到量產落地，
            協助客戶將創新構想轉化為可靠的智慧產品。
          </p>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">核心能力</h2>
          <p className="text-gray-500 text-sm">Core Competencies</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreServices.map(({ icon: Icon, title, titleEn, desc }) => (
            <div
              key={title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-700 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-900/40 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-1">{title}</h3>
              <p className="text-xs text-gray-500 mb-3">{titleEn}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-gray-800" />
      </div>

      {/* Firmware Trends */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">韌體設計趨勢</h2>
          <p className="text-gray-500 text-sm">Firmware Design Trends</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {firmwareTrends.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-900/40 flex items-center justify-center mt-1">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
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

    </div>
  );
}
