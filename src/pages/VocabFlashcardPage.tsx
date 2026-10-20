import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getVocabDay, type VocabWord } from '../data/vocab'
import { shuffle } from '../lib/shuffle'
import { speak, canSpeak } from '../lib/speech'
import { useProgress } from '../state/progress'
import SpeakerButton from '../components/SpeakerButton'

const VOCAB_COURSE_KEY = 'vocab'

export default function VocabFlashcardPage() {
  const navigate = useNavigate()
  const { day } = useParams()
  const { recordCardResult } = useProgress()
  const vocabDay = getVocabDay(Number(day))

  const [deck, setDeck] = useState(() => (vocabDay ? shuffle(vocabDay.words) : []))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [knownCount, setKnownCount] = useState(0)
  const [missed, setMissed] = useState<VocabWord[]>([])
  const [finished, setFinished] = useState(false)
  // Guards against a fast double-tap on 알아요/몰라요 firing `next` twice for
  // the same card before React re-renders — the second call would otherwise
  // still see the stale `index`, pass the bounds check, and push `index`
  // one past the deck's end, crashing the page on the next render.
  const advancingRef = useRef(false)

  const word = deck[index]

  useEffect(() => {
    advancingRef.current = false
    if (word && canSpeak()) speak(word.word, 'en-US')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, word])

  if (!vocabDay || deck.length === 0) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-500">아직 외울 단어가 없어요.</p>
        <button
          type="button"
          onClick={() => navigate('/vocab')}
          className="rounded-2xl bg-emerald-500 px-6 py-3 font-display font-extrabold text-white"
        >
          단어장으로
        </button>
      </div>
    )
  }

  const total = deck.length

  function next(knew: boolean) {
    if (advancingRef.current) return
    advancingRef.current = true

    recordCardResult(VOCAB_COURSE_KEY, word.id, knew)
    const nextKnownCount = knownCount + (knew ? 1 : 0)
    if (!knew) setMissed((m) => [...m, word])
    if (index + 1 >= total) {
      setKnownCount(nextKnownCount)
      setFinished(true)
      return
    }
    setKnownCount(nextKnownCount)
    setIndex((i) => i + 1)
    setRevealed(false)
  }

  function restart() {
    setDeck(vocabDay ? shuffle(vocabDay.words) : [])
    setMissed([])
    setIndex(0)
    setRevealed(false)
    setKnownCount(0)
    setFinished(false)
  }

  function restartWithMissed() {
    if (missed.length === 0) return
    setDeck(shuffle(missed))
    setMissed([])
    setIndex(0)
    setRevealed(false)
    setKnownCount(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-white px-6 text-center">
        <span className="text-7xl">🗂️</span>
        <h1 className="font-display text-3xl font-extrabold text-slate-800">
          {vocabDay.title} 플래시카드 완료!
        </h1>
        <div className="rounded-2xl bg-emerald-50 px-6 py-3">
          <p className="font-display text-2xl font-extrabold text-emerald-600">
            {knownCount}/{total} 알아요
          </p>
        </div>
        <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
          {missed.length > 0 && (
            <button
              type="button"
              onClick={restartWithMissed}
              className="w-full rounded-2xl bg-rose-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
            >
              모르는 단어만 다시 복습 ({missed.length}개)
            </button>
          )}
          <button
            type="button"
            onClick={restart}
            className="w-full rounded-2xl border-2 border-slate-200 py-3 font-display font-extrabold text-slate-600"
          >
            다시하기
          </button>
          <button
            type="button"
            onClick={() => navigate('/vocab')}
            className="w-full rounded-2xl bg-emerald-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
          >
            단어장으로
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
          onClick={() => navigate('/vocab')}
          className="text-2xl text-slate-400"
        >
          ×
        </button>
        <p className="shrink-0 text-xs font-extrabold text-slate-400">
          {vocabDay.title} · 단어 암기
        </p>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-rose-400 transition-all"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-8">
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            const willReveal = !revealed
            setRevealed(willReveal)
            if (!willReveal && canSpeak()) speak(word.word, 'en-US')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setRevealed((r) => !r)
            }
          }}
          className="relative flex w-full max-w-xs cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-slate-200 bg-slate-50 px-6 py-10 text-center shadow-sm"
        >
          {/* Positioned out of the card's center so a tap here doesn't land on
              the speaker button and get swallowed by its stopPropagation
              instead of flipping the card. */}
          <div className="absolute right-3 top-3">
            <SpeakerButton text={word.word} lang="en-US" />
          </div>
          {!revealed ? (
            <>
              <p className="font-display text-3xl font-extrabold text-slate-800">
                {word.word}
              </p>
              <p className="text-sm text-slate-400">[{word.pronunciation}]</p>
              {word.conjugation && (
                <p className="text-xs text-slate-400">{word.conjugation}</p>
              )}
              <p className="mt-4 text-sm font-bold text-slate-400">
                탭해서 뜻 보기
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-xl font-extrabold text-slate-800">
                {word.word}
              </p>
              <p className="font-display text-2xl font-bold text-emerald-600">
                {word.partOfSpeech ? `[${word.partOfSpeech}] ` : ''}
                {word.meaning}
              </p>
              {word.note && (
                <p className="text-xs text-slate-400">{word.note}</p>
              )}
              <div className="mt-3 w-full border-t-2 border-dashed border-slate-200 pt-3 text-left">
                {word.examples.map((ex, i) => (
                  <p key={i} className="mb-2 text-sm">
                    <span className="font-bold text-slate-700">{ex.en}</span>
                    <br />
                    <span className="text-slate-400">{ex.kr}</span>
                  </p>
                ))}
              </div>
            </>
          )}
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
