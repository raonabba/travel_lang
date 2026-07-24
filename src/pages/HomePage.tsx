import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import LessonNode from '../components/LessonNode'
import { useProgress, MAX_HEARTS } from '../state/progress'
import { getCourse } from '../data/courses'
import { courseColorClasses } from '../lib/colors'

const SNAKE_OFFSETS = [0, 56, 84, 56, 0, -56, -84, -56]

export default function HomePage() {
  const navigate = useNavigate()
  const { selectedCourseId, completedLessonIds, isLessonUnlocked, hearts, msToNextHeart } =
    useProgress()
  const [showNoHearts, setShowNoHearts] = useState(false)
  const course = selectedCourseId ? getCourse(selectedCourseId) : undefined

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

  let globalIndex = 0
  let currentFound = false

  const minutesLeft = Math.max(1, Math.ceil(msToNextHeart / 60000))

  return (
    <div className="min-h-full bg-white pb-28">
      <TopBar />

      <div className="mx-auto max-w-md px-4 pt-8">
        {course.units.map((unit) => (
          <section key={unit.id} className="mb-12">
            <div
              className={`mb-10 rounded-2xl ${colors.bg} px-5 py-4 text-white shadow-sm`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{unit.icon}</span>
                <div>
                  <h2 className="font-display text-lg font-extrabold">
                    {unit.title}
                  </h2>
                  <p className="text-sm text-white/80">{unit.description}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-10">
              {unit.lessons.map((lesson) => {
                const key = `${course.id}:${lesson.id}`
                const completed = completedLessonIds.has(key)
                const unlocked = isLessonUnlocked(course, unit.id, lesson.id)
                const isCurrent = !currentFound && unlocked && !completed
                if (isCurrent) currentFound = true
                const offset = SNAKE_OFFSETS[globalIndex % SNAKE_OFFSETS.length]
                globalIndex += 1

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
                      if (hearts <= 0) {
                        setShowNoHearts(true)
                        return
                      }
                      navigate(`/lesson/${unit.id}/${lesson.id}`)
                    }}
                  />
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {showNoHearts && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-rose-200 bg-rose-50 px-4 py-4">
          <div className="mx-auto flex max-w-md items-center justify-between gap-4">
            <p className="text-sm font-bold text-rose-600">
              하트가 모두 소진됐어요! 약 {minutesLeft}분 후 하트가 채워져요. (최대{' '}
              {MAX_HEARTS}개)
            </p>
            <button
              type="button"
              onClick={() => setShowNoHearts(false)}
              className="shrink-0 rounded-xl bg-rose-500 px-4 py-2 text-sm font-extrabold text-white"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
