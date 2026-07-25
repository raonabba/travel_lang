import type { Course } from '../types'
import { jaCourse } from './ja'
import { enCourse } from './en'
import { ruCourse } from './ru'
import { esCourse } from './es'

export const courses: Course[] = [jaCourse, enCourse, ruCourse, esCourse]

export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id)
}

export function getLesson(courseId: string, unitId: string, lessonId: string) {
  const course = getCourse(courseId)
  const unit = course?.units.find((u) => u.id === unitId)
  const lesson = unit?.lessons.find((l) => l.id === lessonId)
  return { course, unit, lesson }
}
