import type { ColorClasses } from '../lib/colors'
import type { Lesson } from '../data/types'

interface Props {
  lesson: Lesson
  completed: boolean
  unlocked: boolean
  current: boolean
  offset: number
  colors: ColorClasses
  onClick: () => void
}

export default function LessonNode({
  lesson,
  completed,
  unlocked,
  current,
  offset,
  colors,
  onClick,
}: Props) {
  const locked = !unlocked

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {current && (
        <span className="absolute -top-8 whitespace-nowrap rounded-lg border-2 border-slate-200 bg-white px-2 py-1 text-xs font-extrabold text-slate-600 shadow-sm">
          시작하기
        </span>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={locked}
        aria-label={lesson.title}
        className={`flex h-16 w-16 items-center justify-center rounded-full border-b-4 text-2xl transition active:translate-y-0.5 active:border-b-2 ${
          locked
            ? 'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-400'
            : `${colors.bg} border-black/15 text-white ${colors.bgHover}`
        }`}
      >
        {completed ? '✓' : locked ? '🔒' : '★'}
      </button>
      <span className="mt-2 max-w-[84px] text-center text-xs font-bold text-slate-500">
        {lesson.title}
      </span>
    </div>
  )
}
