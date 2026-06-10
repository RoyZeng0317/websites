import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Heart, Share2, Bot, Zap } from 'lucide-react'

export default function Landing() {
  const { t } = useTranslation()

  const features = [
    { icon: Heart, title: t('landing.feature1Title'), desc: t('landing.feature1Desc') },
    { icon: MessageCircle, title: t('landing.feature2Title'), desc: t('landing.feature2Desc') },
    { icon: Share2, title: t('landing.feature3Title'), desc: t('landing.feature3Desc') },
    { icon: Bot, title: t('landing.feature4Title'), desc: t('landing.feature4Desc') },
    { icon: Zap, title: t('landing.feature5Title'), desc: t('landing.feature5Desc') },
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="w-20 h-20 bg-velix-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-velix-900/60">
          <span className="text-white text-4xl font-black">V</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-br from-velix-300 to-velix-600 bg-clip-text text-transparent">
          Velix
        </h1>
        <p className="mt-4 text-base sm:text-lg text-dark-muted max-w-xs leading-relaxed">
          {t('landing.tagline')}<br />{t('landing.subtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link to="/register" className="btn-primary px-10 py-3.5 text-base rounded-full shadow-lg shadow-velix-900/40">
            {t('landing.joinFree')}
          </Link>
          <Link to="/login" className="px-8 py-3.5 text-base rounded-full border border-dark-border text-dark-muted hover:border-velix-500 hover:text-velix-400 transition-colors">
            {t('landing.loginBtn')}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-dark-border py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-bold text-dark-text mb-12">{t('landing.whyVelix')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => (
              <div key={f.title} className="bg-dark-surface border border-dark-border rounded-2xl p-6">
                <div className="inline-flex rounded-xl bg-velix-900/50 p-3 mb-4">
                  <f.icon className="h-6 w-6 text-velix-400" />
                </div>
                <h3 className="text-lg font-semibold text-dark-text">{f.title}</h3>
                <p className="mt-2 text-sm text-dark-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-dark-border py-8 text-center text-sm text-dark-muted">
        Velix &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
