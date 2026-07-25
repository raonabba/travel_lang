import { useState } from 'react'
import type { SpeakExercise } from '../data/types'
import {
  canRecognizeSpeech,
  createRecognizer,
  normalizeForCompare,
} from '../lib/speechRecognition'
import SpeakerButton from './SpeakerButton'

interface Props {
  exercise: SpeakExercise
  lang: string
  status: 'active' | 'correct' | 'incorrect'
  onResult: (correct: boolean) => void
}

export default function SpeakExerciseView({
  exercise,
  lang,
  status,
  onResult,
}: Props) {
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState<string | null>(null)
  const supported = canRecognizeSpeech()

  function startListening() {
    const recognizer = createRecognizer(lang)
    if (!recognizer) return
    setListening(true)
    setHeard(null)
    recognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setHeard(transcript)
      const a = normalizeForCompare(transcript)
      const b = normalizeForCompare(exercise.answer)
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
        {exercise.prompt}
      </h1>
      <div className="mb-8 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-6 text-center">
        <p className="font-display text-2xl font-extrabold text-slate-800">
          {exercise.answer}
        </p>
        {exercise.note && (
          <p className="mt-1 text-sm text-slate-400">{exercise.note}</p>
        )}
        {exercise.krPronunciation && (
          <p className="text-sm text-slate-400">[{exercise.krPronunciation}]</p>
        )}
        <div className="mt-3 flex justify-center">
          <SpeakerButton text={exercise.answer} lang={lang} />
        </div>
      </div>

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
            className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition ${
              listening ? 'animate-pulse bg-rose-500' : 'bg-sky-500'
            }`}
          >
            🎤
          </button>
          <p className="text-sm font-bold text-slate-500">
            {listening ? '듣고 있어요...' : '마이크를 눌러 따라 말해보세요'}
          </p>
          {heard && (
            <p className="text-sm text-slate-400">인식된 문장: “{heard}”</p>
          )}
        </div>
      )}
    </div>
  )
}
