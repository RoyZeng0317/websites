import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createIdol, updateIdol, getIdol, type Idol } from '../api'

const BLOOD_TYPES = ['A', 'B', 'O', 'AB']
const ZODIAC_SIGNS = [
  '牡羊座', '金牛座', '雙子座', '巨蟹座',
  '獅子座', '處女座', '天秤座', '天蠍座',
  '射手座', '摩羯座', '水瓶座', '雙魚座',
]

interface SocialEntry {
  platform: string
  url: string
}

function socialToEntries(social?: Record<string, string>): SocialEntry[] {
  if (!social) return [{ platform: '', url: '' }]
  const entries = Object.entries(social)
  return entries.length === 0
    ? [{ platform: '', url: '' }]
    : entries.map(([platform, url]) => ({ platform, url }))
}

function entriesToSocial(entries: SocialEntry[]): Record<string, string> {
  return Object.fromEntries(
    entries.filter((e) => e.platform && e.url).map((e) => [e.platform, e.url])
  )
}

export default function IdolFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    stage_name: '',
    stage_name_zh: '',
    stage_name_ja: '',
    stage_name_ko: '',
    real_name: '',
    nickname: '',
    birth_date: '',
    birthplace: '',
    blood_type: '',
    height_cm: '',
    zodiac_sign: '',
    image_url: '',
    biography: '',
  })
  const [socialEntries, setSocialEntries] = useState<SocialEntry[]>([{ platform: '', url: '' }])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!id) return
    getIdol(Number(id))
      .then((idol) => {
        setForm({
          stage_name: idol.stage_name ?? '',
          stage_name_zh: idol.stage_name_zh ?? '',
          stage_name_ja: idol.stage_name_ja ?? '',
          stage_name_ko: idol.stage_name_ko ?? '',
          real_name: idol.real_name ?? '',
          nickname: idol.nickname ?? '',
          birth_date: idol.birth_date ?? '',
          birthplace: idol.birthplace ?? '',
          blood_type: idol.blood_type ?? '',
          height_cm: idol.height_cm ? String(idol.height_cm) : '',
          zodiac_sign: idol.zodiac_sign ?? '',
          image_url: idol.image_url ?? '',
          biography: idol.biography ?? '',
        })
        setSocialEntries(socialToEntries(idol.social_media))
      })
      .catch(() => navigate('/idols'))
      .finally(() => setFetching(false))
  }, [id, navigate])

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function addSocial() {
    setSocialEntries((prev) => [...prev, { platform: '', url: '' }])
  }

  function removeSocial(index: number) {
    setSocialEntries((prev) => prev.filter((_, i) => i !== index))
  }

  function updateSocial(index: number, field: 'platform' | 'url', value: string) {
    setSocialEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.stage_name.trim()) return

    setLoading(true)
    try {
      const data = {
        ...form,
        height_cm: form.height_cm ? Number(form.height_cm) : undefined,
        birth_date: form.birth_date || undefined,
        blood_type: form.blood_type || undefined,
        zodiac_sign: form.zodiac_sign || undefined,
        social_media: entriesToSocial(socialEntries),
      } as Partial<Idol>

      const idol = isEdit
        ? await updateIdol(Number(id), data)
        : await createIdol(data)

      navigate(`/idols/${idol.id}`)
    } catch {
      alert('儲存失敗，請確認欄位資料')
    } finally {
      setLoading(false)
    }
  }

  function input(field: keyof typeof form, label: string, options?: { type?: string; required?: boolean }) {
    const { type = 'text', required = false } = options ?? {}
    return (
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">
          {label}{required && <span className="text-pink-400 ml-0.5">*</span>}
        </label>
        <input
          type={type}
          value={form[field]}
          onChange={(e) => update(field, e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
          required={required}
        />
      </div>
    )
  }

  if (fetching) {
    return <div className="text-center py-12 text-slate-500">載入中...</div>
  }

  return (
    <div>
      <Link to={isEdit ? `/idols/${id}` : '/idols'} className="text-sm text-pink-400 hover:underline mb-4 inline-block">
        &larr; 回上一頁
      </Link>

      <h1 className="text-2xl font-bold text-slate-100 mb-6">
        {isEdit ? '編輯偶像' : '新增偶像'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Basic Info */}
        <section className="bg-slate-800 rounded-xl border border-slate-700/50 p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">基本資訊</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {input('stage_name', '藝名', { required: true })}
            {input('stage_name_zh', '中文藝名')}
            {input('stage_name_ja', '日文藝名')}
            {input('stage_name_ko', '韓文藝名')}
            {input('real_name', '本名')}
            {input('nickname', '暱稱')}
            {input('birth_date', '生日', { type: 'date' })}
            {input('birthplace', '出身地')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">血型</label>
              <select
                value={form.blood_type}
                onChange={(e) => update('blood_type', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
              >
                <option value="">--</option>
                {BLOOD_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">身高 (cm)</label>
              <input
                type="number"
                value={form.height_cm}
                onChange={(e) => update('height_cm', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">星座</label>
              <select
                value={form.zodiac_sign}
                onChange={(e) => update('zodiac_sign', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
              >
                <option value="">--</option>
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Media & Bio */}
        <section className="bg-slate-800 rounded-xl border border-slate-700/50 p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">媒體與簡介</h2>
          {input('image_url', '圖片網址')}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">簡介</label>
            <textarea
              value={form.biography}
              onChange={(e) => update('biography', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors resize-none"
            />
          </div>
        </section>

        {/* Social Media */}
        <section className="bg-slate-800 rounded-xl border border-slate-700/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">社交媒體</h2>
            <button
              type="button"
              onClick={addSocial}
              className="text-xs px-3 py-1 rounded-full bg-slate-700 hover:bg-pink-500/20 hover:text-pink-400 transition-colors text-slate-300"
            >
              + 新增
            </button>
          </div>
          {socialEntries.map((entry, index) => (
            <div key={index} className="flex gap-2 items-start">
              <input
                type="text"
                placeholder="平台 (如 Twitter)"
                value={entry.platform}
                onChange={(e) => updateSocial(index, 'platform', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
              />
              <input
                type="text"
                placeholder="網址"
                value={entry.url}
                onChange={(e) => updateSocial(index, 'url', e.target.value)}
                className="flex-[2] px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => removeSocial(index)}
                className="px-2 py-2 text-slate-500 hover:text-red-400 transition-colors"
              >
                &times;
              </button>
            </div>
          ))}
        </section>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !form.stage_name.trim()}
            className="px-6 py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {loading ? '儲存中...' : isEdit ? '更新' : '新增'}
          </button>
          <Link
            to={isEdit ? `/idols/${id}` : '/idols'}
            className="px-6 py-2.5 rounded-lg border border-slate-600/50 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  )
}
