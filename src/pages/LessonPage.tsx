import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProgress } from '../state/progress'
import { getLesson } from '../data/courses'
import { courseColorClasses } from '../lib/colors'
import { shuffle } from '../lib/shuffle'
import { getNextLesson } from '../lib/practice'
import { speak, joinSpokenTokens } from '../lib/speech'
import LearnExerciseView from '../components/LearnExerciseView'
import RepeatExerciseView from '../components/RepeatExerciseView'
import ChoiceExerciseView from '../components/ChoiceExerciseView'
import WordBankExerciseView from '../components/WordBankExerciseView'
import MeaningBankExerciseView from '../components/MeaningBankExerciseView'
import SpeakExerciseView from '../components/SpeakExerciseView'
import LessonResult from '../components/LessonResult'
import type { Exercise, TokenChunk } from '../data/types'

type Status = 'active' | 'correct' | 'incorrect'
type TokenPoolEntry = { chunk: TokenChunk; i: number }

export default function LessonPage() {
  const { unitId = '', lessonId = '' } = useParams()
  const navigate = useNavigate()
  const {
    selectedCourseId,
    completeLesson,
    lessonPosition,
    saveLessonPosition,
    clearLessonPosition,
  } = useProgress()
  const { course, unit, lesson } = selectedCourseId
    ? getLesson(selectedCourseId, unitId, lessonId)
    : { course: undefined, unit: undefined, lesson: undefined }

  const exercises: Exercise[] = useMemo(() => {
    if (!lesson) return []
    return lesson.exercises
  }, [lesson])

  const [index, setIndex] = useState(() => {
    if (
      lessonPosition &&
      lessonPosition.courseId === selectedCourseId &&
      lessonPosition.unitId === unitId &&
      lessonPosition.lessonId === lessonId
    ) {
      return Math.min(
        lessonPosition.index,
        Math.max(exercises.length - 1, 0),
      )
    }
    return 0
  })
  const [status, setStatus] = useState<Status>('active')
  const [mistakes, setMistakes] = useState(0)
  const [finished, setFinished] = useState(false)
  const [choiceSelected, setChoiceSelected] = useState<string | null>(null)
  const [pickedIndices, setPickedIndices] = useState<number[]>([])
  const [retryKey, setRetryKey] = useState(0)

  const optionSets = useMemo(() => {
    return exercises.map((ex): string[] | TokenPoolEntry[] | null =>
      ex.type === 'choice'
        ? shuffle(ex.options)
        : ex.type === 'wordbank' || ex.type === 'meaningBank'
          ? shuffle(ex.tokens.map((chunk, i) => ({ chunk, i })))
          : null,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises])

  const total = exercises.length
  const exercise = exercises[index]

  useEffect(() => {
    if (!course || !exercise || finished) return
    if (exercise.type === 'learn' || exercise.type === 'repeat') {
      speak(exercise.target, course.speechLang)
    } else if (exercise.type === 'choice' || exercise.type === 'meaningBank') {
      speak(exercise.source, course.speechLang)
    } else if (exercise.type === 'wordbank') {
      speak(joinSpokenTokens(exercise.answer, course.speechLang), course.speechLang)
    } else if (exercise.type === 'speak') {
      speak(exercise.answer, course.speechLang)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    if (!course || !unit || !lesson || finished) return
    saveLessonPosition(course.id, unit.id, lesson.id, index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

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

  if (finished) {
    const next = getNextLesson(course, unit.id, lesson.id)
    return (
      <LessonResult
        xpEarned={mistakes === 0 ? 15 : 10}
        mistakes={mistakes}
        hasNextLesson={next !== null}
        onContinue={() => {
          if (next) {
            navigate(`/lesson/${next.unitId}/${next.lesson.id}`, {
              replace: true,
            })
          } else {
            navigate('/learn')
          }
        }}
      />
    )
  }

  function resetExerciseState() {
    setStatus('active')
    setChoiceSelected(null)
    setPickedIndices([])
    setRetryKey(0)
  }

  function checkAnswer() {
    if (
      exercise.type !== 'choice' &&
      exercise.type !== 'wordbank' &&
      exercise.type !== 'meaningBank'
    )
      return
    let correct = false
    if (exercise.type === 'choice') {
      correct = choiceSelected === exercise.answer
    } else if (exercise.type === 'wordbank') {
      const words = pickedIndices.map((i) => exercise.tokens[i].text)
      correct = JSON.stringify(words) === JSON.stringify(exercise.answer)
    } else {
      const glosses = pickedIndices.map((i) => exercise.tokens[i].gloss)
      correct = JSON.stringify(glosses) === JSON.stringify(exercise.answer)
    }
    if (correct) {
      setStatus('correct')
    } else {
      setStatus('incorrect')
      setMistakes((m) => m + 1)
    }
  }

  function handleMicResult(correct: boolean) {
    if (status !== 'active') return
    setStatus(correct ? 'correct' : 'incorrect')
    if (!correct) setMistakes((m) => m + 1)
  }

  function handleRetry() {
    setStatus('active')
    setChoiceSelected(null)
    setPickedIndices([])
    setRetryKey((k) => k + 1)
  }

  function handleContinue() {
    if (index + 1 >= total) {
      completeLesson(course!.id, lesson!.id, mistakes === 0)
      clearLessonPosition()
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    resetExerciseState()
  }

  const canCheck =
    exercise.type === 'choice'
      ? choiceSelected !== null
      : exercise.type === 'wordbank' || exercise.type === 'meaningBank'
        ? pickedIndices.length === exercise.answer.length
        : false

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
      </div>

      <div className="mx-auto w-full max-w-md flex-1 px-4 py-8">
        {exercise.type === 'learn' ? (
          <LearnExerciseView
            exercise={exercise}
            lang={course.speechLang}
            colors={colors}
          />
        ) : exercise.type === 'repeat' ? (
          <RepeatExerciseView
            key={`${index}-${retryKey}`}
            exercise={exercise}
            lang={course.speechLang}
            status={status}
            seed={index}
            onResult={handleMicResult}
          />
        ) : exercise.type === 'choice' ? (
          <ChoiceExerciseView
            exercise={exercise}
            options={optionSets[index] as string[]}
            selected={choiceSelected}
            status={status}
            colors={colors}
            lang={course.speechLang}
            seed={index}
            onSelect={setChoiceSelected}
          />
        ) : exercise.type === 'wordbank' ? (
          <WordBankExerciseView
            exercise={exercise}
            tokenPool={optionSets[index] as TokenPoolEntry[]}
            pickedIndices={pickedIndices}
            status={status}
            lang={course.speechLang}
            seed={index}
            onPick={(i) => setPickedIndices((prev) => [...prev, i])}
            onRemove={(pos) =>
              setPickedIndices((prev) => prev.filter((_, idx) => idx !== pos))
            }
          />
        ) : exercise.type === 'meaningBank' ? (
          <MeaningBankExerciseView
            exercise={exercise}
            tokenPool={optionSets[index] as TokenPoolEntry[]}
            pickedIndices={pickedIndices}
            status={status}
            lang={course.speechLang}
            seed={index}
            onPick={(i) => setPickedIndices((prev) => [...prev, i])}
            onRemove={(pos) =>
              setPickedIndices((prev) => prev.filter((_, idx) => idx !== pos))
            }
          />
        ) : (
          <SpeakExerciseView
            key={`${index}-${retryKey}`}
            exercise={exercise}
            lang={course.speechLang}
            status={status}
            onResult={handleMicResult}
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
          {exercise.type === 'learn' && (
            <>
              <span />
              <button
                type="button"
                onClick={handleContinue}
                className={`rounded-2xl px-8 py-3 font-display font-extrabold text-white transition ${colors.bg} shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-none`}
              >
                다음
              </button>
            </>
          )}
          {status === 'active' &&
            (exercise.type === 'choice' ||
              exercise.type === 'wordbank' ||
              exercise.type === 'meaningBank') && (
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
                  : exercise.type === 'wordbank' || exercise.type === 'meaningBank'
                    ? exercise.answer.join(' ')
                    : exercise.type === 'speak'
                      ? exercise.answer
                      : exercise.type === 'repeat'
                        ? exercise.target
                        : ''}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-2xl bg-rose-500 px-8 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
              >
                다시 시도
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
