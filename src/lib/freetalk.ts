import type { Course } from '../data/types'
import { allVocabWords } from '../data/vocab'
import { normalizeForCompare } from './speechRecognition'

export interface PhraseEntry {
  kr: string
  target: string
  note?: string
  krPronunciation?: string
  /** BCP 47 language tag used to recognize/speak `target`. */
  lang: string
}

/** Minimum similarity between what was heard and a stored phrase to treat
 * it as a real match instead of "doesn't know that sentence yet." Free
 * speech rarely matches a stored sentence word-for-word, so this is looser
 * than the in-lesson exercise grading threshold. */
export const FREETALK_MATCH_THRESHOLD = 0.55

function lcsLength(a: string, b: string): number {
  if (a.length === 0 || b.length === 0) return 0
  let prev = new Array(b.length + 1).fill(0)
  for (let i = 1; i <= a.length; i++) {
    const curr = new Array(b.length + 1).fill(0)
    for (let j = 1; j <= b.length; j++) {
      curr[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1])
    }
    prev = curr
  }
  return prev[b.length]
}

/**
 * Similarity between a stored phrase and free-form speech, normalized by
 * the LONGER of the two lengths (not just the stored phrase's length).
 * Searching ~250 short phrases against an open-ended utterance is a very
 * different problem from grading one known exercise: with an
 * asymmetric target-length denominator, a long unrelated ramble can contain
 * enough of a short phrase's characters as a loose subsequence to score as
 * a "match" even though it shares no real meaning. Normalizing by the
 * longer string, plus a length-ratio sanity check, keeps the match honest.
 */
function freeTalkSimilarity(a: string, b: string): number {
  if (a.length === 0 || b.length === 0) return 0
  const lengthRatio = Math.min(a.length, b.length) / Math.max(a.length, b.length)
  if (lengthRatio < 0.5) return 0
  return lcsLength(a, b) / Math.max(a.length, b.length)
}

/** Builds the pool of Korean phrases the free-talk mode can recognize and
 * correct against: every card in the given course plus (for the English
 * course, or when no course is selected) every example sentence in the
 * vocabulary workbook. Only the learner's own lines from scripted dialogues
 * are included — the staff's lines aren't phrases the learner would say. */
export function buildFreeTalkPool(course: Course | undefined): PhraseEntry[] {
  const entries: PhraseEntry[] = []

  if (course) {
    for (const unit of course.units) {
      for (const lesson of unit.lessons) {
        for (const card of lesson.cards) {
          entries.push({
            kr: card.kr,
            target: card.target,
            note: card.note,
            krPronunciation: card.krPronunciation,
            lang: course.speechLang,
          })
        }
      }
    }
    for (const dialogue of course.dialogues ?? []) {
      for (const turn of dialogue.turns) {
        if (turn.speaker !== 'user') continue
        entries.push({
          kr: turn.kr,
          target: turn.target,
          note: turn.note,
          krPronunciation: turn.krPronunciation,
          lang: course.speechLang,
        })
      }
    }
  }

  if (!course || course.id === 'en') {
    for (const word of allVocabWords) {
      for (const ex of word.examples) {
        entries.push({ kr: ex.kr, target: ex.en, lang: 'en-US' })
      }
    }
  }

  return entries
}

export interface FreeTalkMatch {
  entry: PhraseEntry
  score: number
}

/** Finds the pool entry whose Korean phrase best matches the free-form
 * transcript, and how confident that match is (see FREETALK_MATCH_THRESHOLD). */
export function findBestFreeTalkMatch(
  transcript: string,
  pool: PhraseEntry[],
): FreeTalkMatch | null {
  const spoken = normalizeForCompare(transcript)
  let best: FreeTalkMatch | null = null
  for (const entry of pool) {
    const score = freeTalkSimilarity(normalizeForCompare(entry.kr), spoken)
    if (!best || score > best.score) best = { entry, score }
  }
  return best
}
