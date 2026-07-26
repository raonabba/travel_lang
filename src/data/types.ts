export type ExerciseType = 'learn' | 'repeat' | 'choice' | 'wordbank' | 'meaningBank' | 'speak'

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

export interface RepeatExercise {
  type: 'repeat'
  target: string
  note?: string
  krPronunciation?: string
  /** Originating card's target phrase, used to weight future review by mistakes. */
  cardTarget: string
}

export interface ChoiceExercise {
  type: 'choice'
  prompt: string
  source: string
  sourceNote?: string
  sourcePronunciation?: string
  options: string[]
  answer: string
  /** Originating card's target phrase, used to weight future review by mistakes. */
  cardTarget: string
}

export interface WordBankExercise {
  type: 'wordbank'
  prompt: string
  source: string
  tokens: TokenChunk[]
  answer: string[]
  /** Originating card's target phrase, used to weight future review by mistakes. */
  cardTarget: string
}

/** Mirror of WordBankExercise in the opposite direction: the learner
 * assembles the Korean meaning of a target-language sentence by picking
 * gloss chunks in order, instead of choosing one whole-sentence option. */
export interface MeaningBankExercise {
  type: 'meaningBank'
  prompt: string
  source: string
  sourceNote?: string
  sourcePronunciation?: string
  tokens: TokenChunk[]
  answer: string[]
  /** Originating card's target phrase, used to weight future review by mistakes. */
  cardTarget: string
}

export interface SpeakExercise {
  type: 'speak'
  prompt: string
  /** Korean meaning shown as the prompt; the learner must recall and say the target phrase, not just read it back */
  kr: string
  /** The target-language phrase the learner should say aloud */
  answer: string
  note?: string
  krPronunciation?: string
  /** Originating card's target phrase, used to weight future review by mistakes. */
  cardTarget: string
}

export type Exercise =
  | LearnExercise
  | RepeatExercise
  | ChoiceExercise
  | WordBankExercise
  | MeaningBankExercise
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
  /**
   * Correct order of `tokens` indices for the meaningBank exercise's answer,
   * when the target language's word order (e.g. English SVO) doesn't match
   * natural Korean order (SOV) if the glosses are read off token-by-token.
   * Defaults to tokens' own order when omitted.
   */
  krOrder?: number[]
  /**
   * True when the card is an idiomatic expression whose per-word glosses
   * don't compositionally add up to the translation in any order (e.g.
   * "Nice to meet you" → 반갑습니다) — such cards fall back to the simple
   * multiple-choice quiz instead of the word-by-word meaningBank exercise.
   */
  idiomatic?: boolean
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

/** One line of a scripted multi-turn conversation. The learner always
 * plays the 'user' role; 'staff' lines are context played back via TTS. */
export interface DialogueTurn {
  speaker: 'staff' | 'user'
  /** Korean meaning of this line */
  kr: string
  target: string
  note?: string
  krPronunciation?: string
}

export interface DialogueScenario {
  id: string
  title: string
  turns: DialogueTurn[]
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
  /** Scripted conversation-practice scenarios for the 회화 연습 mode */
  dialogues?: DialogueScenario[]
}

export type CourseColor = 'green' | 'blue' | 'orange' | 'violet'
