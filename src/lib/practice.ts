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
  return lessons.flatMap(({ lesson }) => lesson.exercises)
}

export function collectCardPool(lessons: UnlockedLesson[]): Card[] {
  return lessons.flatMap(({ lesson }) => lesson.cards)
}
