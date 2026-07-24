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

export interface Lesson {
  id: string
  title: string
  exercises: Exercise[]
}

export interface Unit {
  id: string
  title: string
  description: string
  icon: string
  lessons: Lesson[]
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

export type CourseColor = 'green' | 'blue' | 'orange'
