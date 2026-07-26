interface MinimalSpeechRecognition {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult:
    | ((event: {
        results: { [i: number]: { isFinal: boolean; [j: number]: { transcript: string } }; length: number }
      }) => void)
    | null
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
  recognizer.interimResults = true
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

/**
 * How far into `target` the live-recognized `spoken` text matches, as a
 * 0-1 ratio, used to fill a progress gauge while the user is still
 * speaking. Compares normalized forms, so the ratio is an approximation
 * rather than an exact character alignment.
 */
export function matchedPrefixRatio(target: string, spoken: string): number {
  const normTarget = normalizeForCompare(target)
  const normSpoken = normalizeForCompare(spoken)
  if (normTarget.length === 0) return 0
  let i = 0
  while (i < normTarget.length && i < normSpoken.length && normTarget[i] === normSpoken[i]) {
    i++
  }
  return i / normTarget.length
}

/**
 * Best prefix-match ratio across several acceptable readings of the same
 * phrase (e.g. a kanji target and its hiragana `note`) — browser speech
 * recognition for Japanese often transcribes using whichever script it
 * considers "standard," which doesn't always match how the phrase happens
 * to be stored, so a single-candidate comparison can under-report progress
 * even when the learner said it correctly.
 */
export function bestPrefixRatio(candidates: string[], spoken: string): number {
  return Math.max(0, ...candidates.map((c) => matchedPrefixRatio(c, spoken)))
}

/** Same multi-candidate tolerance as bestPrefixRatio, for the final correct/incorrect check. */
export function isSpokenMatch(candidates: string[], spoken: string): boolean {
  const a = normalizeForCompare(spoken)
  if (a.length === 0) return false
  return candidates.some((c) => {
    const b = normalizeForCompare(c)
    return b.length > 0 && (a.includes(b) || b.includes(a))
  })
}
