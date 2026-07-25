interface MinimalSpeechRecognition {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionCtor = new () => MinimalSpeechRecognition

function getCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function canRecognizeSpeech(): boolean {
  return getCtor() !== null
}

export function createRecognizer(lang: string): MinimalSpeechRecognition | null {
  const Ctor = getCtor()
  if (!Ctor) return null
  const recognizer = new Ctor()
  recognizer.lang = lang
  recognizer.interimResults = false
  recognizer.maxAlternatives = 1
  return recognizer
}

/** Strips punctuation/whitespace and lowercases so transcripts can be fuzzy-compared. */
export function normalizeForCompare(text: string): string {
  return text
    .replace(/[。、！？.,!?~〜\s]/g, '')
    .toLowerCase()
    .trim()
}
