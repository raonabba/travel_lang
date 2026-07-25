import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../state/progress'
import { getCourse } from '../data/courses'
import { courseColorClasses } from '../lib/colors'
import { shuffle } from '../lib/shuffle'
import { collectCardPool, collectUnlockedLessons } from '../lib/practice'
import { canRecognizeSpeech } from '../lib/speechRecognition'
import SpeakExerciseView from '../components/SpeakExerciseView'
import type { SpeakExercise } from '../data/types'

const DECK_SIZE = 10
const BASE_XP = 5
const PERFECT_BONUS_XP = 5

type Status = 'active' | 'correct' | 'incorrect'

export default function SpeakingPracticePage() {
  const navigate = useNavigate()
  const { selectedCourseId, isLessonUnlocked, gainXp } = useProgress()
  const course = selectedCourseId ? getCourse(selectedCourseId) : undefined

  const deck: SpeakExercise[] = useMemo(() => {
    if (!course) return []
    const cards = collectCardPool(collectUnlockedLessons(course, isLessonUnlocked))
    return shuffle(cards)
      .slice(0, DECK_SIZE)
      .map((card) => ({
        type: 'speak' as const,
        prompt: '이 표현을 소리 내어 말해보세요',
        answer: card.target,
        note: card.note,
        krPronunciation: card.krPronunciation,
      }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course])

  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<Status>('active')
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [xpGained, setXpGained] = useState(0)

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

  if (!canRecognizeSpeech()) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-500">
          이 브라우저는 음성 인식을 지원하지 않아요. Chrome에서 회화 연습을
          이용해보세요.
        </p>
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="rounded-2xl bg-emerald-500 px-6 py-3 font-display font-extrabold text-white"
        >
          홈으로
        </button>
      </div>
    )
  }

  if (deck.length === 0) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-500">아직 연습할 표현이 없어요. 레슨을 먼저 진행해보세요!</p>
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="rounded-2xl bg-emerald-500 px-6 py-3 font-display font-extrabold text-white"
        >
          홈으로
        </button>
      </div>
    )
  }

  const total = deck.length
  const exercise = deck[index]

  function handleResult(correct: boolean) {
    if (status !== 'active') return
    setStatus(correct ? 'correct' : 'incorrect')
    if (correct) setCorrectCount((c) => c + 1)
  }

  function handleContinue() {
    const finalCorrect = correctCount
    if (index + 1 >= total) {
      const reward = BASE_XP + (finalCorrect === total ? PERFECT_BONUS_XP : 0)
      setXpGained(reward)
      gainXp(reward)
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setStatus('active')
  }

  if (finished) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-white px-6 text-center">
        <span className="text-7xl">🗣️</span>
        <h1 className="font-display text-3xl font-extrabold text-slate-800">
          회화 연습 완료!
        </h1>
        <div className="flex gap-4">
          <div className="rounded-2xl bg-emerald-50 px-6 py-3">
            <p className="font-display text-2xl font-extrabold text-emerald-600">
              {correctCount}/{total} 통과
            </p>
          </div>
          <div className="rounded-2xl bg-yellow-50 px-6 py-3">
            <p className="font-display text-2xl font-extrabold text-yellow-500">
              +{xpGained} XP
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="mt-4 w-full max-w-xs rounded-2xl bg-emerald-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
        >
          홈으로
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <div className="mx-auto flex w-full max-w-md items-center gap-4 px-4 pt-4">
        <button
          type="button"
          aria-label="닫기"
          onClick={() => navigate('/learn')}
          className="text-2xl text-slate-400"
        >
          ×
        </button>
        <p className="shrink-0 text-xs font-extrabold text-slate-400">
          회화 연습 · 셀프 스피킹 테스트
        </p>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full ${colors.bg} rounded-full transition-all`}
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-md flex-1 px-4 py-8">
        <SpeakExerciseView
          key={index}
          exercise={exercise}
          lang={course.speechLang}
          status={status}
          onResult={handleResult}
        />
      </div>

      {status !== 'active' && (
        <div
          className={`sticky bottom-0 border-t-2 px-4 py-4 ${
            status === 'correct'
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-rose-200 bg-rose-50'
          }`}
        >
          <div className="mx-auto flex max-w-md items-center justify-between gap-4">
            <p
              className={`font-display font-extrabold ${
                status === 'correct' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {status === 'correct' ? '통과했어요! 🎉' : '다시 연습해봐요'}
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className={`rounded-2xl px-8 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none ${
                status === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            >
              계속하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
