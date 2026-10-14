import { useNavigate } from 'react-router-dom'
import { vocabDays, allVocabWords } from '../data/vocab'

export default function VocabHomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full bg-white pb-28">
      <div className="mx-auto flex w-full max-w-md items-center gap-4 px-4 pt-6">
        <button
          type="button"
          aria-label="닫기"
          onClick={() => navigate('/learn')}
          className="text-2xl text-slate-400"
        >
          ×
        </button>
        <h1 className="font-display text-xl font-extrabold text-slate-800">
          📘 영단어장
        </h1>
      </div>

      <div className="mx-auto max-w-md px-4 pt-6">
        <button
          type="button"
          disabled={allVocabWords.length === 0}
          onClick={() => navigate('/vocab/review/quiz')}
          className="mb-8 flex w-full items-center gap-3 rounded-2xl bg-amber-500 px-5 py-4 text-left text-white shadow-sm transition active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400"
        >
          <span className="text-3xl">🎯</span>
          <span className="flex-1">
            <span className="block font-display text-lg font-extrabold">
              틀린 단어 집중 복습
            </span>
            <span className="block text-sm text-white/80">
              전체 {allVocabWords.length}단어 중 자주 틀린 것 위주로
            </span>
          </span>
          <span>→</span>
        </button>

        {vocabDays.map((d) => (
          <section
            key={d.day}
            className="mb-5 rounded-2xl border-2 border-slate-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-slate-800">
                {d.title}
              </h2>
              <span className="text-xs font-extrabold text-slate-400">
                {d.words.length}단어
              </span>
            </div>
            {d.words.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                사진을 더 보내주시면 채워질 예정이에요
              </p>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/vocab/${d.day}/flashcards`)}
                  className="flex-1 rounded-xl border-2 border-rose-200 bg-rose-50 py-3 text-center font-display text-sm font-extrabold text-rose-700 transition hover:bg-rose-100 active:scale-[0.98]"
                >
                  🗂️ 플래시카드
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/vocab/${d.day}/quiz`)}
                  className="flex-1 rounded-xl border-2 border-sky-200 bg-sky-50 py-3 text-center font-display text-sm font-extrabold text-sky-700 transition hover:bg-sky-100 active:scale-[0.98]"
                >
                  🎯 뜻 맞히기
                </button>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
