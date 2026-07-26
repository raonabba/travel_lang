import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../state/progress'
import { getCourse } from '../data/courses'
import { courseColorClasses } from '../lib/colors'
import { shuffle } from '../lib/shuffle'
import { collectCardPool, collectUnlockedLessons } from '../lib/practice'
import {
  bestMatchRatio,
  canRecognizeSpeech,
  createRecognizer,
  isSpokenMatch,
} from '../lib/speechRecognition'
import { speak } from '../lib/speech'
import { playCorrectSound } from '../lib/sound'
import GaugeText from '../components/GaugeText'
import SpeakerButton from '../components/SpeakerButton'
import SpeakExerciseView from '../components/SpeakExerciseView'
import type { DialogueScenario, SpeakExercise } from '../data/types'

const DECK_SIZE = 10
const BASE_XP = 5
const PERFECT_BONUS_XP = 5
const SCENARIO_XP = 10

type Status = 'active' | 'correct' | 'incorrect'

export default function SpeakingPracticePage() {
  const navigate = useNavigate()
  const { selectedCourseId } = useProgress()
  const course = selectedCourseId ? getCourse(selectedCourseId) : undefined
  const dialogues = course?.dialogues ?? []

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

  if (dialogues.length > 0) {
    return <ScenarioPractice course={course} dialogues={dialogues} />
  }
  return <RandomDeckPractice />
}

function ScenarioPractice({
  course,
  dialogues,
}: {
  course: NonNullable<ReturnType<typeof getCourse>>
  dialogues: DialogueScenario[]
}) {
  const navigate = useNavigate()
  const { gainXp } = useProgress()
  const colors = courseColorClasses[course.color]
  const supported = canRecognizeSpeech()

  const [scenario, setScenario] = useState<DialogueScenario | null>(null)
  const [turnIndex, setTurnIndex] = useState(0)
  const [status, setStatus] = useState<Status>('active')
  const [finished, setFinished] = useState(false)
  const [listening, setListening] = useState(false)
  const [progress, setProgress] = useState(0)

  const turn = scenario?.turns[turnIndex]

  useEffect(() => {
    if (!scenario || !turn || finished) return
    speak(turn.target, course.speechLang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, turnIndex])

  function startScenario(s: DialogueScenario) {
    setScenario(s)
    setTurnIndex(0)
    setStatus('active')
    setFinished(false)
    setProgress(0)
  }

  function handleContinue() {
    if (!scenario) return
    if (turnIndex + 1 >= scenario.turns.length) {
      gainXp(SCENARIO_XP)
      setFinished(true)
      return
    }
    setTurnIndex((i) => i + 1)
    setStatus('active')
    setProgress(0)
  }

  function handleRetry() {
    setStatus('active')
    setProgress(0)
  }

  function handleMicResult(correct: boolean) {
    if (status !== 'active') return
    if (correct) playCorrectSound()
    setStatus(correct ? 'correct' : 'incorrect')
  }

  function startListening() {
    if (!turn) return
    const recognizer = createRecognizer(course.speechLang)
    if (!recognizer) return
    const readings = turn.note ? [turn.target, turn.note] : [turn.target]
    setListening(true)
    setProgress(0)
    recognizer.onresult = (event) => {
      const last = event.results[event.results.length - 1]
      const transcript = last[0].transcript
      setProgress(bestMatchRatio(readings, transcript))
      if (last.isFinal) {
        handleMicResult(isSpokenMatch(readings, transcript))
      }
    }
    recognizer.onerror = () => {
      setListening(false)
      handleMicResult(false)
    }
    recognizer.onend = () => setListening(false)
    recognizer.start()
  }

  if (!scenario) {
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
          <p className="text-xs font-extrabold text-slate-400">회화 연습 · 상황 선택</p>
        </div>
        <div className="mx-auto w-full max-w-md flex-1 px-4 py-6">
          <h1 className="mb-1 font-display text-2xl font-extrabold text-slate-800">
            어떤 상황을 연습할까요?
          </h1>
          <p className="mb-6 text-sm text-slate-400">
            나는 손님(여행객) 입장에서 대화를 이어가요.
          </p>
          <div className="flex flex-col gap-3">
            {dialogues.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => startScenario(d)}
                className="rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-left font-display font-extrabold text-slate-700 transition hover:border-slate-300"
              >
                {d.title}
                <span className="mt-1 block text-xs font-normal text-slate-400">
                  {d.turns.length}턴 대화
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-white px-6 text-center">
        <span className="text-7xl">🗣️</span>
        <h1 className="font-display text-3xl font-extrabold text-slate-800">
          {scenario.title} 완료!
        </h1>
        <div className="rounded-2xl bg-yellow-50 px-6 py-3">
          <p className="font-display text-2xl font-extrabold text-yellow-500">
            +{SCENARIO_XP} XP
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={() => setScenario(null)}
            className="w-full rounded-2xl bg-emerald-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
          >
            다른 상황 연습하기
          </button>
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="w-full rounded-2xl bg-slate-100 py-3 font-display font-extrabold text-slate-500 transition"
          >
            홈으로
          </button>
        </div>
      </div>
    )
  }

  if (!turn) return null
  const total = scenario.turns.length

  return (
    <div className="flex min-h-full flex-col bg-white">
      <div className="mx-auto flex w-full max-w-md items-center gap-4 px-4 pt-4">
        <button
          type="button"
          aria-label="닫기"
          onClick={() => setScenario(null)}
          className="text-2xl text-slate-400"
        >
          ×
        </button>
        <p className="shrink-0 text-xs font-extrabold text-slate-400">{scenario.title}</p>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full ${colors.bg} rounded-full transition-all`}
            style={{ width: `${(turnIndex / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-md flex-1 px-4 py-8">
        {turn.speaker === 'staff' ? (
          <div>
            <h1 className="mb-6 font-display text-xl font-extrabold text-slate-800 md:text-2xl">
              점원이 이렇게 말해요
            </h1>
            <div className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-6">
              <span className="text-3xl">🧑‍🍳</span>
              <div className="flex-1">
                <p className="font-display text-xl font-extrabold text-slate-800">
                  {turn.target}
                </p>
                {turn.krPronunciation && (
                  <p className="text-sm text-slate-400">[{turn.krPronunciation}]</p>
                )}
                <p className="mt-1 text-sm text-slate-500">{turn.kr}</p>
              </div>
              <SpeakerButton text={turn.target} lang={course.speechLang} />
            </div>
          </div>
        ) : (
          <div>
            <h1 className="mb-6 font-display text-xl font-extrabold text-slate-800 md:text-2xl">
              내 차례예요, 이렇게 말해보세요
            </h1>
            <div className="mb-6 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 px-5 py-6 text-center">
              <p className="mb-2 text-sm font-bold text-violet-500">{turn.kr}</p>
              <GaugeText
                text={turn.target}
                progress={progress}
                active={listening}
                className="justify-center text-xl"
              />
              {turn.krPronunciation && (
                <p className="mt-1 text-sm text-slate-400">[{turn.krPronunciation}]</p>
              )}
              <div className="mt-2 flex justify-center">
                <SpeakerButton text={turn.target} lang={course.speechLang} />
              </div>
            </div>

            {!supported ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-center text-sm text-slate-400">
                  이 브라우저는 음성 인식을 지원하지 않아요.
                </p>
                <button
                  type="button"
                  disabled={status !== 'active'}
                  onClick={() => handleMicResult(true)}
                  className="rounded-2xl bg-sky-500 px-6 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none disabled:opacity-50"
                >
                  말했어요, 확인
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  disabled={status !== 'active'}
                  onClick={startListening}
                  className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition ${
                    listening ? 'animate-pulse bg-rose-500' : 'bg-sky-500'
                  }`}
                >
                  🎤
                </button>
                <p className="text-sm font-bold text-slate-500">
                  {listening ? '듣고 있어요...' : '마이크를 눌러 말해보세요'}
                </p>
              </div>
            )}
          </div>
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
          {turn.speaker === 'staff' && (
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
          {turn.speaker === 'user' && status === 'correct' && (
            <>
              <p className="font-display font-extrabold text-emerald-600">통과했어요! 🎉</p>
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-2xl bg-emerald-500 px-8 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
              >
                계속하기
              </button>
            </>
          )}
          {turn.speaker === 'user' && status === 'incorrect' && (
            <div className="flex w-full flex-col gap-3">
              <p className="font-display font-extrabold text-rose-600">다시 연습해봐요</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex-1 rounded-2xl bg-slate-200 px-4 py-3 font-display font-extrabold text-slate-600 transition active:translate-y-1"
                >
                  다음
                </button>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RandomDeckPractice() {
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
        prompt: '이 문장을 말해보세요',
        kr: card.kr,
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
  const [retryKey, setRetryKey] = useState(0)

  if (!course) return null
  const colors = courseColorClasses[course.color]

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
    if (index + 1 >= total) {
      const reward = BASE_XP + (correctCount === total ? PERFECT_BONUS_XP : 0)
      setXpGained(reward)
      gainXp(reward)
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setStatus('active')
    setRetryKey(0)
  }

  function handleRetry() {
    setStatus('active')
    setRetryKey((k) => k + 1)
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
          key={`${index}-${retryKey}`}
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
          {status === 'correct' ? (
            <div className="mx-auto flex max-w-md items-center justify-between gap-4">
              <p className="font-display font-extrabold text-emerald-600">통과했어요! 🎉</p>
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-2xl bg-emerald-500 px-8 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
              >
                계속하기
              </button>
            </div>
          ) : (
            <div className="mx-auto flex max-w-md flex-col gap-3">
              <p className="font-display font-extrabold text-rose-600">다시 연습해봐요</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex-1 rounded-2xl bg-slate-200 px-4 py-3 font-display font-extrabold text-slate-600 transition active:translate-y-1"
                >
                  다음
                </button>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
