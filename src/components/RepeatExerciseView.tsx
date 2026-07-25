import { useState } from 'react'
import type { RepeatExercise } from '../data/types'
import {
  canRecognizeSpeech,
  createRecognizer,
  normalizeForCompare,
} from '../lib/speechRecognition'
import { pickCharacter } from '../data/characters'
import CharacterBubble from './CharacterBubble'
import SpeakerButton from './SpeakerButton'

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
  const supported = canRecognizeSpeech()
  const character = pickCharacter(seed)

  function startListening() {
    const recognizer = createRecognizer(lang)
    if (!recognizer) return
    setListening(true)
    recognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      const a = normalizeForCompare(transcript)
      const b = normalizeForCompare(exercise.target)
      const correct = a.length > 0 && (a.includes(b) || b.includes(a))
      onResult(correct)
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
      <CharacterBubble character={character}>
        <div className="flex items-center gap-3">
          <SpeakerButton text={exercise.target} lang={lang} />
          <div>
            <p className="font-display text-xl font-extrabold text-slate-800">
              {exercise.target}
            </p>
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
        <p className="text-center text-sm text-slate-400">
          이 브라우저는 음성 인식을 지원하지 않아요. Chrome에서 시도해보세요.
        </p>
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
