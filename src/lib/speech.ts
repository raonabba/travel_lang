export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let voiceList: SpeechSynthesisVoice[] = []
const chosenVoice = new Map<string, SpeechSynthesisVoice | null>()

function refreshVoiceList() {
  if (!canSpeak()) return
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) {
    voiceList = voices
    // Deliberately NOT clearing chosenVoice here: some browsers fire
    // voiceschanged more than once as voices load in progressively, and
    // re-resolving on every firing is exactly what caused the pinned
    // voice to drift to a different (often worse-sounding) one mid-session.
    // Once a language has a pinned voice, it keeps it for the whole session.
  }
}

if (canSpeak()) {
  refreshVoiceList()
  window.speechSynthesis.onvoiceschanged = refreshVoiceList
}

/**
 * Picks one voice per language and keeps reusing that exact voice object.
 * Without this, some browsers re-resolve a voice on every speak() call and
 * can silently drop from a natural network voice to a robotic local one.
 */
function pickVoice(lang: string): SpeechSynthesisVoice | null {
  if (chosenVoice.has(lang)) return chosenVoice.get(lang) ?? null
  if (voiceList.length === 0) refreshVoiceList()

  const exact = voiceList.filter((v) => v.lang.toLowerCase() === lang.toLowerCase())
  const prefix = lang.split('-')[0].toLowerCase()
  const partial = voiceList.filter((v) => v.lang.toLowerCase().startsWith(prefix))
  const candidates = exact.length > 0 ? exact : partial

  // Prefer the browser's own flagged default for this language first (this
  // is what it auto-selects when no voice is specified, so it matches the
  // "first call sounded right" experience), then a network/cloud voice,
  // then whatever's left.
  const best =
    candidates.find((v) => v.default) ??
    candidates.find((v) => v.localService === false) ??
    candidates[0] ??
    null

  chosenVoice.set(lang, best)
  return best
}

export function speak(text: string, lang: string) {
  if (!canSpeak()) return
  const synth = window.speechSynthesis
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.85
  const voice = pickVoice(lang)
  if (voice) utterance.voice = voice

  if (synth.speaking || synth.pending) {
    synth.cancel()
  }
  // Calling speak() in the same tick as cancel() can garble or drop the
  // utterance in Chrome; yielding a tick avoids that.
  setTimeout(() => synth.speak(utterance), 0)
}

/** Joins word-bank tokens into a natural sentence for the given language. */
export function joinSpokenTokens(tokens: string[], lang: string): string {
  return tokens.join(lang.startsWith('ja') ? '' : ' ')
}
