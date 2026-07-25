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
    lesson.exercises.filter((e) => e.type === 'choice' || e.type === 'wordbank'),
  )
}

export function collectCardPool(lessons: UnlockedLesson[]): Card[] {
  return lessons.flatMap(({ lesson }) => lesson.cards)
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
