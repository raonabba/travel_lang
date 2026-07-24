interface SuccessProps {
  outcome: 'success'
  xpEarned: number
  mistakes: number
  onContinue: () => void
}

interface FailProps {
  outcome: 'fail'
  onRetry: () => void
  onHome: () => void
}

type Props = SuccessProps | FailProps

export default function LessonResult(props: Props) {
  if (props.outcome === 'success') {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-white px-6 text-center">
        <span className="text-7xl">🎉</span>
        <h1 className="font-display text-3xl font-extrabold text-slate-800">
          레슨 완료!
        </h1>
        <div className="flex gap-4">
          <div className="rounded-2xl bg-yellow-50 px-6 py-3">
            <p className="font-display text-2xl font-extrabold text-yellow-500">
              +{props.xpEarned} XP
            </p>
          </div>
          <div className="rounded-2xl bg-rose-50 px-6 py-3">
            <p className="font-display text-2xl font-extrabold text-rose-500">
              {props.mistakes === 0 ? '완벽!' : `실수 ${props.mistakes}회`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={props.onContinue}
          className="mt-4 w-full max-w-xs rounded-2xl bg-emerald-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
        >
          계속하기
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      <span className="text-7xl">💔</span>
      <h1 className="font-display text-3xl font-extrabold text-slate-800">
        하트를 모두 잃었어요
      </h1>
      <p className="text-slate-500">하트가 채워지면 다시 도전할 수 있어요</p>
      <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          onClick={props.onRetry}
          className="w-full rounded-2xl border-2 border-slate-200 py-3 font-display font-extrabold text-slate-600"
        >
          다시 도전하기
        </button>
        <button
          type="button"
          onClick={props.onHome}
          className="w-full rounded-2xl bg-emerald-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
        >
          홈으로
        </button>
      </div>
    </div>
  )
}
