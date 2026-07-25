import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../state/progress'
import { getCourse } from '../data/courses'
import { courseColorClasses } from '../lib/colors'
import { shuffle } from '../lib/shuffle'
import { collectCardPool, collectUnlockedLessons } from '../lib/practice'
import { speak, canSpeak } from '../lib/speech'
import { shortsSearchUrl } from '../lib/youtube'
import SpeakerButton from '../components/SpeakerButton'

const DECK_SIZE = 10
const BASE_REWARD_XP = 5
const PERFECT_BONUS_XP = 5

export default function FlashcardPage() {
  const navigate = useNavigate()
  const { selectedCourseId, isLessonUnlocked, gainXp } = useProgress()
  const course = selectedCourseId ? getCourse(selectedCourseId) : undefined

  const deck = useMemo(() => {
    if (!course) return []
    const pool = collectCardPool(collectUnlockedLessons(course, isLessonUnlocked))
    return shuffle(pool).slice(0, DECK_SIZE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course])

  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [knownCount, setKnownCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [xpGained, setXpGained] = useState(0)

  const card = deck[index]

  useEffect(() => {
    if (card && course && canSpeak()) {
      speak(card.target, course.speechLang)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, card])

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

  if (deck.length === 0) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-500">아직 외울 단어가 없어요. 레슨을 먼저 진행해보세요!</p>
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

  function finishDeck(finalKnownCount: number) {
    const reward =
      BASE_REWARD_XP + (finalKnownCount === total ? PERFECT_BONUS_XP : 0)
    setXpGained(reward)
    gainXp(reward)
    setFinished(true)
  }

  function next(knew: boolean) {
    const nextKnownCount = knownCount + (knew ? 1 : 0)
    if (index + 1 >= total) {
      setKnownCount(nextKnownCount)
      finishDeck(nextKnownCount)
      return
    }
    setKnownCount(nextKnownCount)
    setIndex((i) => i + 1)
    setRevealed(false)
  }

  function restart() {
    setIndex(0)
    setRevealed(false)
    setKnownCount(0)
    setFinished(false)
    setXpGained(0)
  }

  if (finished) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-white px-6 text-center">
        <span className="text-7xl">🗂️</span>
        <h1 className="font-display text-3xl font-extrabold text-slate-800">
          플래시카드 완료!
        </h1>
        <div className="flex gap-4">
          <div className="rounded-2xl bg-emerald-50 px-6 py-3">
            <p className="font-display text-2xl font-extrabold text-emerald-600">
              {knownCount}/{total} 알아요
            </p>
          </div>
          <div className="rounded-2xl bg-yellow-50 px-6 py-3">
            <p className="font-display text-2xl font-extrabold text-yellow-500">
              +{xpGained} XP
            </p>
          </div>
        </div>
        <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={restart}
            className="w-full rounded-2xl border-2 border-slate-200 py-3 font-display font-extrabold text-slate-600"
          >
            다른 카드로 다시하기
          </button>
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="w-full rounded-2xl bg-emerald-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
          >
            홈으로
          </button>
        </div>
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
          단어 암기 · 완료 시 XP 획득
        </p>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full ${colors.bg} rounded-full transition-all`}
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-8">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setRevealed((r) => !r)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setRevealed((r) => !r)
            }
          }}
          className="flex w-full max-w-xs cursor-pointer flex-col items-center gap-4 rounded-3xl border-2 border-slate-200 bg-slate-50 px-6 py-12 text-center shadow-sm"
        >
          <p className="font-display text-3xl font-extrabold text-slate-800">
            {card.target}
          </p>
          {card.note && <p className="text-sm text-slate-400">{card.note}</p>}
          <div className="flex items-center gap-2">
            <SpeakerButton text={card.target} lang={course.speechLang} />
            <a
              href={shortsSearchUrl(`${card.target} ${card.kr}`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-9 items-center gap-1 rounded-full border-2 border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-600 transition hover:bg-slate-100 active:scale-95"
            >
              🎬 쇼츠 찾기
            </a>
          </div>
          <div className="mt-4 min-h-10 border-t-2 border-dashed border-slate-200 pt-4">
            {revealed ? (
              <p className="font-display text-xl font-bold text-slate-600">
                {card.kr}
              </p>
            ) : (
              <p className="text-sm font-bold text-slate-400">
                탭해서 뜻 보기
              </p>
            )}
          </div>
        </div>

        {revealed && (
          <div className="mt-8 flex w-full max-w-xs gap-3">
            <button
              type="button"
              onClick={() => next(false)}
              className="flex-1 rounded-2xl border-2 border-slate-200 py-3 font-display font-extrabold text-slate-600"
            >
              몰라요 😅
            </button>
            <button
              type="button"
              onClick={() => next(true)}
              className="flex-1 rounded-2xl bg-emerald-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
            >
              알아요 👍
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
