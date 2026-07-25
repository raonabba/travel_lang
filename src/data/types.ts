export type ExerciseType = 'learn' | 'choice' | 'wordbank' | 'speak'

export interface TokenChunk {
  text: string
  /** Korean gloss for this chunk, shown while building a sentence */
  gloss: string
}

export interface LearnExercise {
  type: 'learn'
  kr: string
  target: string
  note?: string
  krPronunciation?: string
}

export interface ChoiceExercise {
  type: 'choice'
  prompt: string
  source: string
  sourceNote?: string
  sourcePronunciation?: string
  options: string[]
  answer: string
}

export interface WordBankExercise {
  type: 'wordbank'
  prompt: string
  source: string
  tokens: TokenChunk[]
  answer: string[]
}

export interface SpeakExercise {
  type: 'speak'
  prompt: string
  /** The target-language phrase the learner should say aloud */
  answer: string
  note?: string
  krPronunciation?: string
}

export type Exercise =
  | LearnExercise
  | ChoiceExercise
  | WordBankExercise
  | SpeakExercise

export interface Card {
  /** Korean phrase (the learner's native language) */
  kr: string
  /** Target-language phrase */
  target: string
  /** Optional pronunciation hint in the target script (e.g. hiragana reading, transliteration) */
  note?: string
  /** Hangul approximation of the pronunciation, for reading aloud without knowing the target script's rules */
  krPronunciation?: string
  /** Target-language phrase split into chunks for the word-bank exercise, each with a Korean gloss */
  tokens: TokenChunk[]
}

export interface Lesson {
  id: string
  title: string
  exercises: Exercise[]
  /** Source vocabulary cards, reused by review mode and the flashcard game */
  cards: Card[]
}

export interface RelatedShort {
  videoId: string
  title: string
}

export interface Unit {
  id: string
  title: string
  description: string
  icon: string
  lessons: Lesson[]
  /** A real, verified YouTube Short related to this unit's topic */
  relatedShort?: RelatedShort
}

export interface Course {
  id: string
  title: string
  flag: string
  tagline: string
  color: CourseColor
  /** BCP 47 language tag used for text-to-speech pronunciation, e.g. "ja-JP" */
  speechLang: string
  comingSoon?: boolean
  units: Unit[]
}

export type CourseColor = 'green' | 'blue' | 'orange' | 'violet'
