export interface VocabExample {
  en: string
  kr: string
}

export interface VocabWord {
  /** Stable id, e.g. "day1-05" (the workbook's own entry number) */
  id: string
  day: number
  word: string
  pronunciation: string
  /** e.g. "통 주다, 건네주다" or "형 긴장한, 과민한" */
  partOfSpeech?: string
  /** Irregular conjugation shown in the book, e.g. "give-gave-given" */
  conjugation?: string
  meaning: string
  /** Usage note, nuance comparison with a similar word, or synonym/antonym */
  note?: string
  examples: VocabExample[]
}

export interface VocabDay {
  day: number
  title: string
  words: VocabWord[]
}
