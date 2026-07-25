import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../state/progress'
import { getCourse } from '../data/courses'
import { courseColorClasses } from '../lib/colors'
import { shuffle } from '../lib/shuffle'
import { collectExercisePool, collectUnlockedLessons } from '../lib/practice'
import ChoiceExerciseView from '../components/ChoiceExerciseView'
import WordBankExerciseView from '../components/WordBankExerciseView'
import type { ChoiceExercise, WordBankExercise as WordBankExerciseType } from '../data/types'

const REVIEW_LENGTH = 8
const REVIEW_XP = 8

type Status = 'active' | 'correct' | 'incorrect'
type TokenChip = { t: string; i: number }
type ReviewExercise = ChoiceExercise | WordBankExerciseType

export default function ReviewPage() {
  const navigate = useNavigate()
  const { selectedCourseId, isLessonUnlocked, gainXp } = useProgress()
  const course = selectedCourseId ? getCourse(selectedCourseId) : undefined

  const exercises = useMemo(() => {
    if (!course) return []
    // collectExercisePool never returns 'speak' exercises (review is quiz-only).
    const pool = collectExercisePool(
      collectUnlockedLessons(course, isLessonUnlocked),
    ) as ReviewExercise[]
    return shuffle(pool).slice(0, REVIEW_LENGTH)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course])

  const optionSets = useMemo(() => {
    return exercises.map((ex): string[] | TokenChip[] =>
      ex.type === 'choice'
        ? shuffle(ex.options)
        : shuffle(ex.tokens.map((t, i) => ({ t, i }))),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises])

  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<Status>('active')
  const [choiceSelected, setChoiceSelected] = useState<string | null>(null)
  const [pickedIndices, setPickedIndices] = useState<number[]>([])
  const [finished, setFinished] = useState(false)

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

  if (exercises.length === 0) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-500">아직 복습할 내용이 없어요. 레슨을 먼저 진행해보세요!</p>
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

  if (finished) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-white px-6 text-center">
        <span className="text-7xl">🔁</span>
        <h1 className="font-display text-3xl font-extrabold text-slate-800">
          복습 완료!
        </h1>
        <div className="rounded-2xl bg-yellow-50 px-6 py-3">
          <p className="font-display text-2xl font-extrabold text-yellow-500">
            +{REVIEW_XP} XP
          </p>
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

  const exercise = exercises[index]
  const total = exercises.length

  function resetExerciseState() {
    setStatus('active')
    setChoiceSelected(null)
    setPickedIndices([])
  }

  function checkAnswer() {
    let correct = false
    if (exercise.type === 'choice') {
      correct = choiceSelected === exercise.answer
    } else {
      const words = pickedIndices.map((i) => exercise.tokens[i])
      correct = JSON.stringify(words) === JSON.stringify(exercise.answer)
    }
    setStatus(correct ? 'correct' : 'incorrect')
  }

  function handleContinue() {
    if (index + 1 >= total) {
      gainXp(REVIEW_XP)
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    resetExerciseState()
  }

  const canCheck =
    exercise.type === 'choice'
      ? choiceSelected !== null
      : pickedIndices.length === exercise.answer.length

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
        <p className="shrink-0 text-xs font-extrabold text-slate-400">복습 모드</p>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-sky-400 transition-all"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-md flex-1 px-4 py-8">
        {exercise.type === 'choice' ? (
          <ChoiceExerciseView
            exercise={exercise}
            options={optionSets[index] as string[]}
            selected={choiceSelected}
            status={status}
            colors={colors}
            lang={course.speechLang}
            onSelect={setChoiceSelected}
          />
        ) : (
          <WordBankExerciseView
            exercise={exercise}
            tokenPool={optionSets[index] as TokenChip[]}
            pickedIndices={pickedIndices}
            status={status}
            lang={course.speechLang}
            onPick={(i) => setPickedIndices((prev) => [...prev, i])}
            onRemove={(pos) =>
              setPickedIndices((prev) => prev.filter((_, idx) => idx !== pos))
            }
          />
        )}
      </div>

      <div
        className={`sticky bottom-0 border-t-2 px-4 py-4 ${
          status === 'correct'
            ? 'border-emerald-200 bg-emerald-50'
            : status === 'incorrect'
              ? 'border-rose-200 bg-rose-50'
              : 'border-slate-100 bg-white'
        }`}
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          {status === 'active' && (
            <>
              <span />
              <button
                type="button"
                disabled={!canCheck}
                onClick={checkAnswer}
                className={`rounded-2xl px-8 py-3 font-display font-extrabold text-white transition ${
                  canCheck
                    ? 'bg-sky-400 shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-none'
                    : 'cursor-not-allowed bg-slate-200 text-slate-400'
                }`}
              >
                확인
              </button>
            </>
          )}
          {status === 'correct' && (
            <>
              <p className="font-display font-extrabold text-emerald-600">
                정답이에요! 🎉
              </p>
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-2xl bg-emerald-500 px-8 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
              >
                계속하기
              </button>
            </>
          )}
          {status === 'incorrect' && (
            <>
              <p className="font-display font-extrabold text-rose-600">
                정답:{' '}
                {exercise.type === 'choice'
                  ? exercise.answer
                  : exercise.answer.join(' ')}
              </p>
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-2xl bg-rose-500 px-8 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
              >
                계속하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
