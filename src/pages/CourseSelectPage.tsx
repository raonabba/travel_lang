import { useNavigate } from 'react-router-dom'
import { courses } from '../data/courses'
import { useProgress } from '../state/progress'

export default function CourseSelectPage() {
  const navigate = useNavigate()
  const { selectCourse, selectedCourseId } = useProgress()

  function choose(id: string) {
    selectCourse(id)
    navigate('/learn')
  }

  return (
    <div className="flex min-h-full flex-col items-center bg-gradient-to-b from-emerald-50 to-white px-6 py-16">
      <h1 className="mb-2 text-center font-display text-3xl font-extrabold text-slate-800 md:text-4xl">
        어떤 언어를 배우고 싶으세요?
      </h1>
      <p className="mb-10 text-center text-slate-500">
        여행에서 바로 써먹는 회화를 배워보세요
      </p>
      <div className="grid w-full max-w-md gap-4">
        {courses.map((c) => (
          <button
            key={c.id}
            type="button"
            disabled={c.comingSoon}
            onClick={() => choose(c.id)}
            className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition ${
              c.comingSoon
                ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 active:scale-[0.98]'
            } ${selectedCourseId === c.id ? 'border-emerald-500 bg-emerald-50' : ''}`}
          >
            <span className="text-4xl">{c.flag}</span>
            <span className="flex-1">
              <span className="block font-display text-lg font-extrabold text-slate-800">
                {c.title}
              </span>
              <span className="block text-sm text-slate-500">{c.tagline}</span>
            </span>
            {c.comingSoon && (
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-400">
                준비 중
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
