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
    cardTarget: card.target,
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
    cardTarget: card.target,
  }
}

function buildMeaning(cards: Card[], index: number): Exercise {
  const card = cards[index]
  if (card.tokens.length <= 1 || card.idiomatic) return buildChoice(cards, index)
  const cardGlosses = new Set(card.tokens.map((t) => t.gloss))
  const otherTokens = cards
    .filter((_, i) => i !== index)
    .flatMap((c) => c.tokens)
    .filter((t) => !cardGlosses.has(t.gloss))
  const distractorTokens = rotate(otherTokens, index).slice(0, 3)
  const tokens: TokenChunk[] = rotate(
    [...card.tokens, ...distractorTokens],
    (index * 2) % Math.max(card.tokens.length + distractorTokens.length, 1),
  )
  const order = card.krOrder ?? card.tokens.map((_, i) => i)
  return {
    type: 'meaningBank',
    prompt: '이 표현의 뜻을 순서대로 조합하세요',
    source: card.target,
    sourceNote: card.note,
    sourcePronunciation: card.krPronunciation,
    tokens,
    answer: order.map((i) => card.tokens[i].gloss),
    cardTarget: card.target,
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
    cardTarget: card.target,
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
    cardTarget: card.target,
  }
}

/**
 * Each card is taught word-first: a plain "learn" step introduces the
 * meaning, then one active-recall quiz and one mic exercise. Which quiz
 * (meaning-assembly vs word-bank) and which mic exercise (listen-and-repeat
 * vs recall-and-speak) alternates by card, so a full lesson still touches
 * every exercise type without stacking all four onto every single card —
 * that made lessons feel long and repetitive.
 */
export function buildLesson(id: string, title: string, cards: Card[]): Lesson {
  const exercises = cards.flatMap((_, i) => [
    buildLearn(cards[i]),
    i % 2 === 0 ? buildMeaning(cards, i) : buildWordBank(cards, i),
    i % 2 === 0 ? buildRepeat(cards[i]) : buildSpeak(cards[i]),
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
