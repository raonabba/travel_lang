interface Props {
  xpEarned: number
  mistakes: number
  hasNextLesson: boolean
  onContinue: () => void
}

export default function LessonResult({
  xpEarned,
  mistakes,
  hasNextLesson,
  onContinue,
}: Props) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      <span className="text-7xl">🎉</span>
      <h1 className="font-display text-3xl font-extrabold text-slate-800">
        레슨 완료!
      </h1>
      <div className="flex gap-4">
        <div className="rounded-2xl bg-yellow-50 px-6 py-3">
          <p className="font-display text-2xl font-extrabold text-yellow-500">
            +{xpEarned} XP
          </p>
        </div>
        <div className="rounded-2xl bg-rose-50 px-6 py-3">
          <p className="font-display text-2xl font-extrabold text-rose-500">
            {mistakes === 0 ? '완벽!' : `실수 ${mistakes}회`}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="mt-4 w-full max-w-xs rounded-2xl bg-emerald-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
      >
        {hasNextLesson ? '다음 레슨으로 →' : '홈으로'}
      </button>
    </div>
  )
}
