import { useState } from 'react'

interface QAPair {
  question: string
  answer: string
}

export default function QuestionBank() {
  const [bank, setBank] = useState<QAPair[]>([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  function addEntry() {
    if (!question.trim() || !answer.trim()) return
    setBank(prev => [...prev, { question: question.trim(), answer: answer.trim() }])
    setQuestion('')
    setAnswer('')
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h2 className="text-xl font-bold text-white">題庫</h2>

      <div className="flex flex-col gap-3 rounded-2xl bg-slate-900 p-6 ring-1 ring-slate-800">
        <input
          type="text"
          placeholder="輸入題目"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="rounded-lg bg-slate-800 px-4 py-2 text-white outline-none ring-1 ring-slate-700 focus:ring-emerald-500"
        />
        <input
          type="text"
          placeholder="輸入答案"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          className="rounded-lg bg-slate-800 px-4 py-2 text-white outline-none ring-1 ring-slate-700 focus:ring-emerald-500"
        />
        <button
          onClick={addEntry}
          disabled={!question.trim() || !answer.trim()}
          className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-40"
        >
          新增
        </button>
      </div>

      {bank.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-slate-400">題庫列表（{bank.length} 題）</h3>
          {bank.map((entry, i) => (
            <div key={i} className="rounded-xl bg-slate-900 px-4 py-3 ring-1 ring-slate-800">
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-emerald-400">題目：</span>
                {entry.question}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                <span className="font-semibold text-sky-400">答案：</span>
                {entry.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
