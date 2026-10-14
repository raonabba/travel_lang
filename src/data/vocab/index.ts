import type { VocabDay } from './types'
import { day1Words } from './day1'
import { day2Words } from './day2'
import { day3Words } from './day3'

export * from './types'

export const vocabDays: VocabDay[] = [
  { day: 1, title: 'DAY 01', words: day1Words },
  { day: 2, title: 'DAY 02', words: day2Words },
  { day: 3, title: 'DAY 03', words: day3Words },
]

export const allVocabWords = vocabDays.flatMap((d) => d.words)

export function getVocabDay(day: number): VocabDay | undefined {
  return vocabDays.find((d) => d.day === day)
}
