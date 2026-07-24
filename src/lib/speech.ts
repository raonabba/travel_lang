export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, lang: string) {
  if (!canSpeak()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.85
  window.speechSynthesis.speak(utterance)
}

/** Joins word-bank tokens into a natural sentence for the given language. */
export function joinSpokenTokens(tokens: string[], lang: string): string {
  return tokens.join(lang.startsWith('ja') ? '' : ' ')
}
