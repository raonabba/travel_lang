import type { Card, Exercise, Lesson, RelatedShort, Unit } from './types'

export type { Card }

function rotate<T>(arr: T[], offset: number): T[] {
  if (arr.length === 0) return arr
  const n = offset % arr.length
  return [...arr.slice(n), ...arr.slice(0, n)]
}

function buildChoice(cards: Card[], index: number): Exercise {
  const card = cards[index]
  const others = cards.filter((_, i) => i !== index)
  const distractors = rotate(others, index)
    .slice(0, 2)
    .map((c) => c.kr)
  const options = rotate([card.kr, ...distractors], index % 3)
  return {
    type: 'choice',
    prompt: '이 표현의 뜻은 무엇인가요?',
    source: card.target,
    sourceNote: card.note,
    options,
    answer: card.kr,
  }
}

function buildWordBank(cards: Card[], index: number): Exercise {
  const card = cards[index]
  const otherTokens = cards
    .filter((_, i) => i !== index)
    .flatMap((c) => c.tokens)
    .filter((t) => !card.tokens.includes(t))
  const distractorTokens = rotate(otherTokens, index).slice(0, 3)
  const tokens = rotate([...card.tokens, ...distractorTokens], (index * 2) % Math.max(card.tokens.length + distractorTokens.length, 1))
  return {
    type: 'wordbank',
    prompt: '이 문장을 번역하세요',
    source: card.kr,
    tokens,
    answer: card.tokens,
  }
}

function buildSpeak(card: Card): Exercise {
  return {
    type: 'speak',
    prompt: '이 표현을 소리 내어 말해보세요',
    answer: card.target,
    note: card.note,
  }
}

/**
 * Each card is taught word-first: recognize its meaning (choice) before
 * having to actively reconstruct it (word bank), so a sentence is never
 * the very first thing the learner sees. One speaking check closes out
 * the lesson.
 */
export function buildLesson(id: string, title: string, cards: Card[]): Lesson {
  const exercises = cards.flatMap((_, i) => [
    buildChoice(cards, i),
    buildWordBank(cards, i),
  ])
  exercises.push(buildSpeak(cards[0]))
  return { id, title, exercises, cards }
}

export function buildUnit(
  id: string,
  title: string,
  description: string,
  icon: string,
  lessons: Lesson[],
  relatedShort?: RelatedShort,
): Unit {
  return { id, title, description, icon, lessons, relatedShort }
}
