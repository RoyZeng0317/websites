import { ExternalLink, BookOpen, Box, TrendingUp, Share2, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ProductItem {
  labelL: string;
  value: string;
  href: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
}

const productsItems: ProductItem[] = [
  {
    icon: BookOpen,
    labelL: '全英文學習平台',
    value: '沉浸式全英文學習環境，結合 AI 輔助課程與即時發音分析，適合各階段學習者快速提升英語能力。',
    href: 'https://linugapath.web.app/',
  },
  {
    icon: Box,
    labelL: '電子電路 3D 模擬器',
    value: '瀏覽器端即時 3D 電路模擬工具，支援常見元件拖曳擺放與波形分析，適合教學與快速原型驗證。',
    href: 'https://circuit-lab-3d.web.app/',
  },
  {
    icon: TrendingUp,
    labelL: '全球股票追蹤平台',
    value: '即時追蹤全球主要交易所股市動態，支援自選清單、K 線圖表與多幣別匯率換算。',
    href: 'https://stocks-global.web.app/',
  },
  {
    icon: Share2,
    labelL: '檔案分享平台',
    value: '安全快速的點對點檔案傳輸服務，無需帳號即可上傳並產生分享連結，支援大型檔案傳輸。',
    href: 'https://file-share-platfrom.web.app/',
  },
  { labelL: '', value: '', href: '', comingSoon: true },
  { labelL: '', value: '', href: '', comingSoon: true },
  { labelL: '', value: '', href: '', comingSoon: true },
  { labelL: '', value: '', href: '', comingSoon: true },
  { labelL: '', value: '', href: '', comingSoon: true },
  { labelL: '', value: '', href: '', comingSoon: true },
];

export default function Products() {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen">

      {/* Header */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-gray-950 to-cyan-900/20 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Stellarix Electronics
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            我們的<span className="text-cyan-400">產品</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            結合硬體工程與軟體開發能力，打造涵蓋教育、金融、工具的多元數位產品。
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsItems.map((item, i) => {
            if (item.comingSoon) {
              return (
                <div
                  key={i}
                  className="bg-gray-900/40 border border-gray-800/50 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]"
                >
                  <Clock className="w-6 h-6 text-gray-600" />
                  <p className="text-sm text-gray-600 font-medium">即將推出</p>
                </div>
              );
            }

            const Icon = item.icon!;
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-cyan-700 transition-colors duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-cyan-900/40 flex items-center justify-center group-hover:bg-cyan-900/60 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-cyan-500 transition-colors mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-2">{item.labelL}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.value}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

    </div>
  );
}
