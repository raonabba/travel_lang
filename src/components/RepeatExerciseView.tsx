import { useEffect, useState } from 'react'
import type { RepeatExercise } from '../data/types'
import {
  canRecognizeSpeech,
  createRecognizer,
  matchedPrefixRatio,
  normalizeForCompare,
} from '../lib/speechRecognition'
import { playCorrectSound } from '../lib/sound'
import { pickCharacter } from '../data/characters'
import CharacterBubble from './CharacterBubble'
import SpeakerButton from './SpeakerButton'
import GaugeText from './GaugeText'

interface Props {
  exercise: RepeatExercise
  lang: string
  status: 'active' | 'correct' | 'incorrect'
  seed: number
  onResult: (correct: boolean) => void
}

export default function RepeatExerciseView({
  exercise,
  lang,
  status,
  seed,
  onResult,
}: Props) {
  const [listening, setListening] = useState(false)
  const [progress, setProgress] = useState(0)
  const supported = canRecognizeSpeech()
  const character = pickCharacter(seed)

  useEffect(() => {
    if (status === 'correct') playCorrectSound()
  }, [status])

  function startListening() {
    const recognizer = createRecognizer(lang)
    if (!recognizer) return
    setListening(true)
    setProgress(0)
    recognizer.onresult = (event) => {
      const last = event.results[event.results.length - 1]
      const transcript = last[0].transcript
      setProgress(matchedPrefixRatio(exercise.target, transcript))
      if (last.isFinal) {
        const a = normalizeForCompare(transcript)
        const b = normalizeForCompare(exercise.target)
        const correct = a.length > 0 && (a.includes(b) || b.includes(a))
        onResult(correct)
      }
    }
    recognizer.onerror = () => setListening(false)
    recognizer.onend = () => setListening(false)
    recognizer.start()
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-extrabold text-slate-800 md:text-2xl">
        {character.name}의 말을 듣고 따라하세요
      </h1>
      <CharacterBubble character={character} status={status}>
        <div className="flex items-center gap-3">
          <SpeakerButton text={exercise.target} lang={lang} />
          <div>
            <GaugeText text={exercise.target} progress={progress} active={listening} className="text-xl" />
            {exercise.note && (
              <p className="text-sm text-slate-400">{exercise.note}</p>
            )}
            {exercise.krPronunciation && (
              <p className="text-sm text-slate-400">[{exercise.krPronunciation}]</p>
            )}
          </div>
        </div>
      </CharacterBubble>

      {!supported ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-center text-sm text-slate-400">
            이 브라우저는 음성 인식을 지원하지 않아요.
          </p>
          <button
            type="button"
            disabled={status !== 'active'}
            onClick={() => onResult(true)}
            className="rounded-2xl bg-sky-500 px-6 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none disabled:opacity-50"
          >
            따라 말했어요, 계속하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            disabled={status !== 'active'}
            onClick={startListening}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition ${
              listening ? 'animate-pulse bg-rose-500' : 'bg-sky-500'
            }`}
          >
            🎤
          </button>
          <p className="text-sm font-bold text-slate-500">
            {listening ? '듣고 있어요...' : '마이크를 눌러 따라 말해보세요'}
          </p>
        </div>
      )}
    </div>
  )
}
