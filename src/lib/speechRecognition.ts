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

function longestCommonSubsequenceLength(a: string, b: string): number {
  if (a.length === 0 || b.length === 0) return 0
  let prev = new Array(b.length + 1).fill(0)
  for (let i = 1; i <= a.length; i++) {
    const curr = new Array(b.length + 1).fill(0)
    for (let j = 1; j <= b.length; j++) {
      curr[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1])
    }
    prev = curr
  }
  return prev[b.length]
}

/**
 * How much of `target` the live-recognized `spoken` text matches, as a 0-1
 * ratio, used to fill a progress gauge while the user is still speaking.
 * Uses longest-common-subsequence rather than a strict prefix match, so an
 * isolated recognition slip in the middle of a phrase (very common with
 * real speech recognition) doesn't permanently cap the gauge even though
 * the rest of the phrase keeps coming through correctly.
 */
export function matchRatio(target: string, spoken: string): number {
  const normTarget = normalizeForCompare(target)
  const normSpoken = normalizeForCompare(spoken)
  if (normTarget.length === 0 || normSpoken.length === 0) return 0
  return longestCommonSubsequenceLength(normTarget, normSpoken) / normTarget.length
}

/**
 * Best match ratio across several acceptable readings of the same phrase
 * (e.g. a kanji target and its hiragana `note`) — browser speech
 * recognition for Japanese often transcribes using whichever script it
 * considers "standard," which doesn't always match how the phrase happens
 * to be stored, so a single-candidate comparison can under-report progress
 * even when the learner said it correctly.
 */
export function bestMatchRatio(candidates: string[], spoken: string): number {
  return Math.max(0, ...candidates.map((c) => matchRatio(c, spoken)))
}

const MATCH_THRESHOLD = 0.75

/**
 * Same multi-candidate tolerance as bestMatchRatio, for the final
 * correct/incorrect check. Exact substring containment still passes
 * immediately; otherwise a high-similarity fuzzy match (allowing for a
 * single mis-heard word, e.g. an uncommon name transcribed as a similar
 * common one) also counts as correct, instead of requiring a perfect
 * transcript.
 */
export function isSpokenMatch(candidates: string[], spoken: string): boolean {
  const a = normalizeForCompare(spoken)
  if (a.length === 0) return false
  return candidates.some((c) => {
    const b = normalizeForCompare(c)
    if (b.length === 0) return false
    if (a.includes(b) || b.includes(a)) return true
    return longestCommonSubsequenceLength(a, b) / b.length >= MATCH_THRESHOLD
  })
}
