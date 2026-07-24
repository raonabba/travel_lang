export type ExerciseType = 'choice' | 'wordbank'

export interface ChoiceExercise {
  type: 'choice'
  prompt: string
  source: string
  sourceNote?: string
  options: string[]
  answer: string
}

export interface WordBankExercise {
  type: 'wordbank'
  prompt: string
  source: string
  tokens: string[]
  answer: string[]
}

export type Exercise = ChoiceExercise | WordBankExercise

export interface Card {
  /** Korean phrase (the learner's native language) */
  kr: string
  /** Target-language phrase */
  target: string
  /** Optional pronunciation hint (e.g. romaji) */
  note?: string
  /** Target-language phrase split into chunks for the word-bank exercise */
  tokens: string[]
}

export interface Lesson {
  id: string
  title: string
  exercises: Exercise[]
  /** Source vocabulary cards, reused by review mode and the flashcard game */
  cards: Card[]
}

export interface Unit {
  id: string
  title: string
  description: string
  icon: string
  lessons: Lesson[]
}

export interface LearningChannel {
  name: string
  description: string
  url: string
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
  /** Recommended external YouTube channels for further study */
  channels?: LearningChannel[]
}

export type CourseColor = 'green' | 'blue' | 'orange'
