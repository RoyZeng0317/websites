import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseReady } from '../lib/firebase';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  products: string;
  quantity: string;
  message: string;
}

const empty: FormData = {
  name: '', email: '', phone: '', company: '', products: '', quantity: '', message: '',
};

function Field({ label, required, error, children }: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-cyan-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputClass =
  'bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors duration-200 w-full';

export default function Order() {
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<Status>('idle');

  function set(key: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      setErrors(err => ({ ...err, [key]: '' }));
    };
  }

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.name.trim())      e.name     = '請填寫姓名';
    if (!form.email.trim())     e.email    = '請填寫電子郵件';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                e.email    = '電子郵件格式不正確';
    if (!form.products.trim())  e.products = '請填寫產品名稱';
    if (!form.quantity.trim())  e.quantity = '請填寫數量';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    try {
      await addDoc(collection(db, 'orders'), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setForm(empty);
    } catch {
      setStatus('error');
    }
  }

  if (!isFirebaseReady) {
    return (
      <div className="bg-gray-950 text-gray-100 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Firebase 尚未設定</h2>
          <p className="text-sm text-gray-400">請在 <code className="text-cyan-400">src/.env</code> 填入 Firebase 專案設定值後重新建置。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen">

      {/* Header */}
      <section className="relative overflow-hidden py-20 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-gray-950 to-indigo-900/20 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Stellarix Electronics
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            產品<span className="text-cyan-400">訂購</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            填寫以下表單訂購產品，我們將盡快與您聯繫確認訂單細節。
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 px-6 max-w-2xl mx-auto">
        {status === 'success' ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <CheckCircle className="w-12 h-12 text-cyan-400 mx-auto mb-5" />
            <h2 className="text-xl font-bold mb-2">訂單已送出</h2>
            <p className="text-gray-400 text-sm mb-8">感謝您的訂購，我們將盡快與您聯繫確認。</p>
            <button
              onClick={() => setStatus('idle')}
              className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
            >
              再次填寫
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col gap-6">

            {/* Row: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="姓名" required error={errors.name}>
                <input
                  type="text"
                  placeholder="王小明"
                  value={form.name}
                  onChange={set('name')}
                  className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                />
              </Field>
              <Field label="電子郵件" required error={errors.email}>
                <input
                  type="email"
                  placeholder="example@company.com"
                  value={form.email}
                  onChange={set('email')}
                  className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`}
                />
              </Field>
            </div>

            {/* Row: Phone + Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="聯絡電話">
                <input
                  type="tel"
                  placeholder="0912-345-678"
                  value={form.phone}
                  onChange={set('phone')}
                  className={inputClass}
                />
              </Field>
              <Field label="公司名稱">
                <input
                  type="text"
                  placeholder="星元科技有限公司"
                  value={form.company}
                  onChange={set('company')}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Row: Products + Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="產品名稱" required error={errors.products}>
                <input
                  type="text"
                  placeholder="例：IC 型號、模組名稱"
                  value={form.products}
                  onChange={set('products')}
                  className={`${inputClass} ${errors.products ? 'border-red-500' : ''}`}
                />
              </Field>
              <Field label="數量" required error={errors.quantity}>
                <input
                  type="text"
                  placeholder="例：100 pcs"
                  value={form.quantity}
                  onChange={set('quantity')}
                  className={`${inputClass} ${errors.quantity ? 'border-red-500' : ''}`}
                />
              </Field>
            </div>

            {/* Message */}
            <Field label="備註說明">
              <textarea
                rows={5}
                placeholder="其他需求或規格說明…"
                value={form.message}
                onChange={set('message')}
                className={`${inputClass} resize-none`}
              />
            </Field>

            {/* Error banner */}
            {status === 'error' && (
              <div className="flex items-center gap-3 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                送出失敗，請稍後再試或直接來信聯繫我們。
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-800 disabled:cursor-not-allowed text-gray-950 font-semibold px-8 py-3.5 rounded-xl transition-colors duration-200"
            >
              {status === 'loading' ? (
                <><Loader2 className="w-4 h-4 animate-spin" />送出中…</>
              ) : (
                <><Send className="w-4 h-4" />送出訂單</>
              )}
            </button>

          </form>
        )}
      </section>

    </div>
  );
}
