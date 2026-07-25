import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import LessonNode from '../components/LessonNode'
import ShortEmbed from '../components/ShortEmbed'
import { useProgress } from '../state/progress'
import { getCourse, getLesson } from '../data/courses'
import { courseColorClasses } from '../lib/colors'

const SNAKE_OFFSETS = [0, 56, 84, 56, 0, -56, -84, -56]

export default function HomePage() {
  const navigate = useNavigate()
  const { selectedCourseId, completedLessonIds, isLessonUnlocked, lessonPosition } =
    useProgress()
  const course = selectedCourseId ? getCourse(selectedCourseId) : undefined
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null)

  useEffect(() => {
    if (!course) return
    const currentUnit = course.units.find((unit) =>
      unit.lessons.some(
        (l) =>
          isLessonUnlocked(course, unit.id, l.id) &&
          !completedLessonIds.has(`${course.id}:${l.id}`),
      ),
    )
    setExpandedUnitId(currentUnit?.id ?? course.units[0]?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id])

  if (!course) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-500">먼저 배울 언어를 선택해주세요.</p>
        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="rounded-2xl bg-emerald-500 px-6 py-3 font-display font-extrabold text-white"
        >
          코스 선택하기
        </button>
      </div>
    )
  }

  const colors = courseColorClasses[course.color]
  let currentFound = false

  const resumeLesson =
    lessonPosition && lessonPosition.courseId === course.id
      ? getLesson(course.id, lessonPosition.unitId, lessonPosition.lessonId).lesson
      : null

  return (
    <div className="min-h-full bg-white pb-28">
      <TopBar />

      <div className="mx-auto max-w-md px-4 pt-6">
        {resumeLesson && lessonPosition && (
          <button
            type="button"
            onClick={() =>
              navigate(`/lesson/${lessonPosition.unitId}/${lessonPosition.lessonId}`)
            }
            className="mb-6 flex w-full items-center gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-left transition hover:bg-emerald-100 active:scale-[0.99]"
          >
            <span className="text-2xl">📖</span>
            <span className="flex-1">
              <span className="block font-display text-sm font-extrabold text-emerald-700">
                이어서 학습하기
              </span>
              <span className="block text-xs text-emerald-600">
                {resumeLesson.title} · {lessonPosition.index}/
                {resumeLesson.exercises.length}
              </span>
            </span>
            <span className="text-emerald-500">→</span>
          </button>
        )}

        <div className="mb-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate('/review')}
            className="flex flex-col items-center gap-1 rounded-2xl border-2 border-sky-200 bg-sky-50 px-3 py-4 text-center transition hover:bg-sky-100 active:scale-[0.98]"
          >
            <span className="text-2xl">🔁</span>
            <span className="font-display text-sm font-extrabold text-sky-700">
              복습하기
            </span>
            <span className="text-xs text-sky-500">추가 XP 획득</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/flashcards')}
            className="flex flex-col items-center gap-1 rounded-2xl border-2 border-rose-200 bg-rose-50 px-3 py-4 text-center transition hover:bg-rose-100 active:scale-[0.98]"
          >
            <span className="text-2xl">🗂️</span>
            <span className="font-display text-sm font-extrabold text-rose-700">
              단어 암기
            </span>
            <span className="text-xs text-rose-500">듣고 뜻 맞히기</span>
          </button>
        </div>

        {course.units.map((unit) => {
          const isExpanded = expandedUnitId === unit.id

          return (
            <section key={unit.id} className="mb-6">
              <button
                type="button"
                onClick={() => setExpandedUnitId(isExpanded ? null : unit.id)}
                className={`flex w-full items-center gap-3 rounded-2xl ${colors.bg} px-5 py-4 text-left text-white shadow-sm transition active:scale-[0.99]`}
                aria-expanded={isExpanded}
              >
                <span className="text-3xl">{unit.icon}</span>
                <span className="flex-1">
                  <span className="block font-display text-lg font-extrabold">
                    {unit.title}
                  </span>
                  <span className="block text-sm text-white/80">
                    {unit.description}
                  </span>
                </span>
                <span
                  className={`text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                >
                  ⌄
                </span>
              </button>

              {isExpanded && (
                <div className="pt-8">
                  {unit.relatedShort && <ShortEmbed short={unit.relatedShort} />}

                  <div className="flex flex-col items-center gap-10">
                    {unit.lessons.map((lesson, i) => {
                      const key = `${course.id}:${lesson.id}`
                      const completed = completedLessonIds.has(key)
                      const unlocked = isLessonUnlocked(course, unit.id, lesson.id)
                      const isCurrent = !currentFound && unlocked && !completed
                      if (isCurrent) currentFound = true
                      const offset = SNAKE_OFFSETS[i % SNAKE_OFFSETS.length]

                      return (
                        <LessonNode
                          key={lesson.id}
                          lesson={lesson}
                          completed={completed}
                          unlocked={unlocked}
                          current={isCurrent}
                          offset={offset}
                          colors={colors}
                          onClick={() => {
                            if (!unlocked) return
                            navigate(`/lesson/${unit.id}/${lesson.id}`)
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
