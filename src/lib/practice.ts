import type { Card, Course, Exercise, Lesson } from '../data/types'

export interface UnlockedLesson {
  unitId: string
  lesson: Lesson
}

export function collectUnlockedLessons(
  course: Course,
  isLessonUnlocked: (course: Course, unitId: string, lessonId: string) => boolean,
): UnlockedLesson[] {
  const result: UnlockedLesson[] = []
  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      if (isLessonUnlocked(course, unit.id, lesson.id)) {
        result.push({ unitId: unit.id, lesson })
      }
    }
  }
  return result
}

export function collectExercisePool(lessons: UnlockedLesson[]): Exercise[] {
  // Review is quiz-only: skip the plain "learn" intro cards and speaking
  // checks (those live in the guided lesson flow and the conversation
  // practice mode instead).
  return lessons.flatMap(({ lesson }) =>
    lesson.exercises.filter(
      (e) => e.type === 'choice' || e.type === 'wordbank' || e.type === 'meaningBank',
    ),
  )
}

export function collectCardPool(lessons: UnlockedLesson[]): Card[] {
  return lessons.flatMap(({ lesson }) => lesson.cards)
}

/** Weighted sample without replacement — items whose card has a higher
 * weight (e.g. more recent mistakes) are more likely to be picked, so
 * review sessions surface previously-missed words more often. */
export function weightedSample<T extends { cardTarget: string }>(
  pool: T[],
  count: number,
  getWeight: (target: string) => number,
): T[] {
  const remaining = pool.map((item) => ({ item, weight: Math.max(0.0001, getWeight(item.cardTarget)) }))
  const result: T[] = []
  for (let i = 0; i < count && remaining.length > 0; i++) {
    const total = remaining.reduce((sum, r) => sum + r.weight, 0)
    let r = Math.random() * total
    let pickIndex = remaining.length - 1
    for (let j = 0; j < remaining.length; j++) {
      r -= remaining[j].weight
      if (r <= 0) {
        pickIndex = j
        break
      }
    }
    result.push(remaining[pickIndex].item)
    remaining.splice(pickIndex, 1)
  }
  return result
}

export function getNextLesson(
  course: Course,
  unitId: string,
  lessonId: string,
): UnlockedLesson | null {
  const flat: UnlockedLesson[] = course.units.flatMap((u) =>
    u.lessons.map((lesson) => ({ unitId: u.id, lesson })),
  )
  const idx = flat.findIndex(
    (f) => f.unitId === unitId && f.lesson.id === lessonId,
  )
  if (idx === -1 || idx + 1 >= flat.length) return null
  return flat[idx + 1]
}
