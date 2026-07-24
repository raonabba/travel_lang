import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProgress } from '../state/progress'
import { getLesson } from '../data/courses'
import { courseColorClasses } from '../lib/colors'
import ChoiceExerciseView from '../components/ChoiceExerciseView'
import WordBankExerciseView from '../components/WordBankExerciseView'
import LessonResult from '../components/LessonResult'

type Status = 'active' | 'correct' | 'incorrect'
type TokenChip = { t: string; i: number }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function LessonPage() {
  const { unitId = '', lessonId = '' } = useParams()
  const navigate = useNavigate()
  const { selectedCourseId, hearts, loseHeart, completeLesson } = useProgress()
  const { course, unit, lesson } = selectedCourseId
    ? getLesson(selectedCourseId, unitId, lessonId)
    : { course: undefined, unit: undefined, lesson: undefined }

  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<Status>('active')
  const [mistakes, setMistakes] = useState(0)
  const [heartsLeft, setHeartsLeft] = useState(hearts)
  const [finished, setFinished] = useState<'success' | 'fail' | null>(null)
  const [choiceSelected, setChoiceSelected] = useState<string | null>(null)
  const [pickedIndices, setPickedIndices] = useState<number[]>([])
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (hearts <= 0) {
      navigate('/learn', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const optionSets = useMemo(() => {
    if (!lesson) return []
    return lesson.exercises.map((ex): string[] | TokenChip[] =>
      ex.type === 'choice'
        ? shuffle(ex.options)
        : shuffle(ex.tokens.map((t, i) => ({ t, i }))),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, attempt])

  if (!course || !unit || !lesson) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-500">레슨을 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="font-bold text-emerald-600"
        >
          홈으로
        </button>
      </div>
    )
  }

  const colors = courseColorClasses[course.color]
  const total = lesson.exercises.length
  const exercise = lesson.exercises[index]

  if (finished === 'success') {
    return (
      <LessonResult
        outcome="success"
        xpEarned={mistakes === 0 ? 15 : 10}
        mistakes={mistakes}
        onContinue={() => navigate('/learn')}
      />
    )
  }

  if (finished === 'fail') {
    return (
      <LessonResult
        outcome="fail"
        onHome={() => navigate('/learn')}
        onRetry={() => {
          setIndex(0)
          setMistakes(0)
          setHeartsLeft(hearts)
          setStatus('active')
          setChoiceSelected(null)
          setPickedIndices([])
          setFinished(null)
          setAttempt((a) => a + 1)
        }}
      />
    )
  }

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

    if (correct) {
      setStatus('correct')
    } else {
      setStatus('incorrect')
      setMistakes((m) => m + 1)
      loseHeart()
      setHeartsLeft((h) => Math.max(0, h - 1))
    }
  }

  function handleContinue() {
    if (status === 'incorrect' && heartsLeft <= 0) {
      setFinished('fail')
      return
    }
    if (index + 1 >= total) {
      completeLesson(course!.id, lesson!.id, mistakes === 0)
      setFinished('success')
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
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full ${colors.bg} rounded-full transition-all`}
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
        <span className="flex items-center gap-1 font-display font-extrabold text-rose-500">
          ❤️ {heartsLeft}
        </span>
      </div>

      <div className="mx-auto w-full max-w-md flex-1 px-4 py-8">
        {exercise.type === 'choice' ? (
          <ChoiceExerciseView
            exercise={exercise}
            options={optionSets[index] as string[]}
            selected={choiceSelected}
            status={status}
            colors={colors}
            onSelect={setChoiceSelected}
          />
        ) : (
          <WordBankExerciseView
            exercise={exercise}
            tokenPool={optionSets[index] as TokenChip[]}
            pickedIndices={pickedIndices}
            status={status}
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
                    ? `${colors.bg} shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-none`
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
