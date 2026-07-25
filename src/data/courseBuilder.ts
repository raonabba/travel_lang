import type { Card, Exercise, Lesson, RelatedShort, TokenChunk, Unit } from './types'

export type { Card }

function rotate<T>(arr: T[], offset: number): T[] {
  if (arr.length === 0) return arr
  const n = offset % arr.length
  return [...arr.slice(n), ...arr.slice(0, n)]
}

function buildLearn(card: Card): Exercise {
  return {
    type: 'learn',
    kr: card.kr,
    target: card.target,
    note: card.note,
    krPronunciation: card.krPronunciation,
  }
}

function buildRepeat(card: Card): Exercise {
  return {
    type: 'repeat',
    target: card.target,
    note: card.note,
    krPronunciation: card.krPronunciation,
  }
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
    sourcePronunciation: card.krPronunciation,
    options,
    answer: card.kr,
  }
}

function buildWordBank(cards: Card[], index: number): Exercise {
  const card = cards[index]
  const cardTexts = new Set(card.tokens.map((t) => t.text))
  const otherTokens = cards
    .filter((_, i) => i !== index)
    .flatMap((c) => c.tokens)
    .filter((t) => !cardTexts.has(t.text))
  const distractorTokens = rotate(otherTokens, index).slice(0, 3)
  const tokens: TokenChunk[] = rotate(
    [...card.tokens, ...distractorTokens],
    (index * 2) % Math.max(card.tokens.length + distractorTokens.length, 1),
  )
  return {
    type: 'wordbank',
    prompt: '이 문장을 번역하세요',
    source: card.kr,
    tokens,
    answer: card.tokens.map((t) => t.text),
  }
}

function buildSpeak(card: Card): Exercise {
  return {
    type: 'speak',
    prompt: '이 문장을 말해보세요',
    kr: card.kr,
    answer: card.target,
    note: card.note,
    krPronunciation: card.krPronunciation,
  }
}

/**
 * Each card is taught word-first: a plain "learn" step introduces the
 * meaning before any quiz, then a listen-and-repeat pronunciation check,
 * then recognition (choice), then active reconstruction (word bank), then
 * a recall-and-speak check — so a sentence is never the very first thing
 * the learner sees, and every card gets full listening + speaking practice.
 */
export function buildLesson(id: string, title: string, cards: Card[]): Lesson {
  const exercises = cards.flatMap((_, i) => [
    buildLearn(cards[i]),
    buildRepeat(cards[i]),
    buildChoice(cards, i),
    buildWordBank(cards, i),
    buildSpeak(cards[i]),
  ])
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
