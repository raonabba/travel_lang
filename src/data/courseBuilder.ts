import type { Card, Exercise, Lesson, Unit } from './types'

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

export function buildLesson(id: string, title: string, cards: Card[]): Lesson {
  const exercises = cards.map((_, i) =>
    i % 2 === 0 ? buildChoice(cards, i) : buildWordBank(cards, i),
  )
  return { id, title, exercises, cards }
}

export function buildUnit(
  id: string,
  title: string,
  description: string,
  icon: string,
  lessons: Lesson[],
): Unit {
  return { id, title, description, icon, lessons }
}
