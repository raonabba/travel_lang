import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { allVocabWords, getVocabDay, type VocabWord } from '../data/vocab'
import { shuffle } from '../lib/shuffle'
import { weightedSample } from '../lib/practice'
import { useProgress } from '../state/progress'
import { speak, canSpeak } from '../lib/speech'
import SpeakerButton from '../components/SpeakerButton'

const REVIEW_QUIZ_LENGTH = 15
const VOCAB_COURSE_KEY = 'vocab'

type Status = 'active' | 'correct' | 'incorrect'

function buildOptions(word: VocabWord, pool: VocabWord[]): string[] {
  const distractorPool = pool.filter(
    (w) => w.id !== word.id && w.meaning !== word.meaning,
  )
  const extra = allVocabWords.filter(
    (w) => w.id !== word.id && w.meaning !== word.meaning,
  )
  const source = distractorPool.length >= 3 ? distractorPool : extra
  const distractors = shuffle(source).slice(0, 3).map((w) => w.meaning)
  return shuffle([word.meaning, ...distractors])
}

export default function VocabQuizPage() {
  const navigate = useNavigate()
  const { day } = useParams()
  const { getCardWeight, recordCardResult } = useProgress()
  const isReview = day === 'review'
  const vocabDay = isReview ? undefined : getVocabDay(Number(day))

  const [deck] = useState(() => {
    if (isReview) {
      const items = allVocabWords.map((w) => ({ ...w, cardTarget: w.id }))
      return weightedSample(items, REVIEW_QUIZ_LENGTH, (id) =>
        getCardWeight(VOCAB_COURSE_KEY, id),
      )
    }
    if (!vocabDay) return []
    // No cap — quiz covers every word in the day, not a random subset.
    return shuffle(vocabDay.words)
  })

  const [optionSets] = useState(() =>
    deck.map((w) => buildOptions(w, isReview ? allVocabWords : vocabDay!.words)),
  )

  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<Status>('active')
  const [selected, setSelected] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const word = deck[index]

  useEffect(() => {
    if (word && canSpeak()) speak(word.word, 'en-US')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, word])

  if (deck.length === 0) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-500">아직 퀴즈를 낼 단어가 없어요.</p>
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
  const title = isReview ? '틀린 단어 집중 복습' : `${vocabDay!.title} · 뜻 맞히기`

  if (finished) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-white px-6 text-center">
        <span className="text-7xl">🎯</span>
        <h1 className="font-display text-3xl font-extrabold text-slate-800">
          퀴즈 완료!
        </h1>
        <div className="rounded-2xl bg-emerald-50 px-6 py-3">
          <p className="font-display text-2xl font-extrabold text-emerald-600">
            {correctCount}/{total} 정답
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/vocab')}
          className="mt-4 w-full max-w-xs rounded-2xl bg-emerald-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
        >
          단어장으로
        </button>
      </div>
    )
  }

  function checkAnswer() {
    const correct = selected === word.meaning
    setStatus(correct ? 'correct' : 'incorrect')
    if (correct) setCorrectCount((c) => c + 1)
    recordCardResult(VOCAB_COURSE_KEY, word.id, correct)
  }

  function handleRetry() {
    setStatus('active')
    setSelected(null)
  }

  function handleContinue() {
    if (index + 1 >= total) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setStatus('active')
    setSelected(null)
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
        <p className="shrink-0 text-xs font-extrabold text-slate-400">{title}</p>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-sky-400 transition-all"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-md flex-1 px-4 py-8">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-extrabold text-slate-400">
            이 단어의 뜻은?
          </p>
          <div className="flex items-center gap-2">
            <p className="font-display text-3xl font-extrabold text-slate-800">
              {word.word}
            </p>
            <SpeakerButton text={word.word} lang="en-US" />
          </div>
          <p className="text-sm text-slate-400">[{word.pronunciation}]</p>
        </div>

        <div className="flex flex-col gap-3">
          {optionSets[index].map((option) => {
            const isSelected = selected === option
            const isAnswer = option === word.meaning
            let stateClasses = 'border-slate-200 bg-white hover:bg-slate-50'
            if (status !== 'active') {
              if (isAnswer) stateClasses = 'border-emerald-400 bg-emerald-50'
              else if (isSelected) stateClasses = 'border-rose-400 bg-rose-50'
              else stateClasses = 'border-slate-200 bg-white opacity-60'
            } else if (isSelected) {
              stateClasses = 'border-sky-400 bg-sky-50'
            }
            return (
              <button
                key={option}
                type="button"
                disabled={status !== 'active'}
                onClick={() => setSelected(option)}
                className={`rounded-2xl border-2 px-4 py-3 text-left font-bold text-slate-700 transition ${stateClasses}`}
              >
                {option}
              </button>
            )
          })}
        </div>

        {status === 'incorrect' && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left">
            {word.note && (
              <p className="mb-2 text-xs text-slate-400">{word.note}</p>
            )}
            {word.examples.map((ex, i) => (
              <p key={i} className="mb-2 text-sm">
                <span className="font-bold text-slate-700">{ex.en}</span>
                <br />
                <span className="text-slate-400">{ex.kr}</span>
              </p>
            ))}
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
          {status === 'active' && (
            <>
              <span />
              <button
                type="button"
                disabled={selected === null}
                onClick={checkAnswer}
                className={`rounded-2xl px-8 py-3 font-display font-extrabold text-white transition ${
                  selected !== null
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
            <div className="flex w-full flex-col gap-3">
              <p className="font-display font-extrabold text-rose-600">
                정답: {word.meaning}
              </p>
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
