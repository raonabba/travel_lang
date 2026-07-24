import type { WordBankExercise } from '../data/types'

interface Props {
  exercise: WordBankExercise
  tokenPool: { t: string; i: number }[]
  pickedIndices: number[]
  status: 'active' | 'correct' | 'incorrect'
  onPick: (i: number) => void
  onRemove: (position: number) => void
}

export default function WordBankExerciseView({
  exercise,
  tokenPool,
  pickedIndices,
  status,
  onPick,
  onRemove,
}: Props) {
  const pickedSet = new Set(pickedIndices)
  const answerBoxState =
    status === 'correct'
      ? 'border-emerald-500 bg-emerald-50'
      : status === 'incorrect'
        ? 'border-rose-500 bg-rose-50'
        : 'border-slate-200 bg-slate-50'

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-extrabold text-slate-800 md:text-2xl">
        {exercise.prompt}
      </h1>
      <p className="mb-4 font-display text-xl font-extrabold text-slate-800">
        {exercise.source}
      </p>

      <div
        className={`mb-6 flex min-h-16 flex-wrap items-start gap-2 rounded-2xl border-2 p-3 ${answerBoxState}`}
      >
        {pickedIndices.length === 0 && (
          <span className="py-2 text-sm text-slate-400">
            아래 단어를 순서대로 선택하세요
          </span>
        )}
        {pickedIndices.map((i, pos) => (
          <button
            key={`${i}-${pos}`}
            type="button"
            disabled={status !== 'active'}
            onClick={() => onRemove(pos)}
            className="rounded-xl border-2 border-slate-300 bg-white px-3 py-2 font-bold text-slate-700"
          >
            {exercise.tokens[i]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {tokenPool.map(({ t, i }) =>
          pickedSet.has(i) ? null : (
            <button
              key={i}
              type="button"
              disabled={status !== 'active'}
              onClick={() => onPick(i)}
              className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 font-bold text-slate-700 transition hover:bg-slate-100"
            >
              {t}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
