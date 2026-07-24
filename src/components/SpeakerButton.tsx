import { canSpeak, speak } from '../lib/speech'

interface Props {
  text: string
  lang: string
  className?: string
}

export default function SpeakerButton({ text, lang, className = '' }: Props) {
  if (!canSpeak()) return null

  return (
    <button
      type="button"
      aria-label="발음 듣기"
      onClick={(e) => {
        e.stopPropagation()
        speak(text, lang)
      }}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-lg transition hover:bg-slate-100 active:scale-95 ${className}`}
    >
      🔊
    </button>
  )
}
