import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Course } from '../data/types'

const STORAGE_KEY = 'travel_lang_progress_v2'

interface LessonPosition {
  courseId: string
  unitId: string
  lessonId: string
  index: number
}

interface ProgressData {
  selectedCourseId: string | null
  xp: number
  streak: number
  lastActiveDate: string | null
  completedLessons: string[]
  lessonPosition: LessonPosition | null
}

const DEFAULT_DATA: ProgressData = {
  selectedCourseId: null,
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  completedLessons: [],
  lessonPosition: null,
}

function loadData(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DATA
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_DATA, ...parsed }
  } catch {
    return DEFAULT_DATA
  }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayStr(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

interface ProgressContextValue {
  selectedCourseId: string | null
  xp: number
  streak: number
  completedLessonIds: Set<string>
  lessonPosition: LessonPosition | null
  selectCourse: (id: string) => void
  gainXp: (amount: number) => void
  completeLesson: (courseId: string, lessonId: string, perfect: boolean) => void
  isLessonUnlocked: (course: Course, unitId: string, lessonId: string) => boolean
  saveLessonPosition: (
    courseId: string,
    unitId: string,
    lessonId: string,
    index: number,
  ) => void
  clearLessonPosition: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProgressData>(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const value = useMemo<ProgressContextValue>(
    () => ({
      selectedCourseId: data.selectedCourseId,
      xp: data.xp,
      streak: data.streak,
      completedLessonIds: new Set(data.completedLessons),
      lessonPosition: data.lessonPosition,
      selectCourse: (id: string) =>
        setData((d) => ({ ...d, selectedCourseId: id })),
      gainXp: (amount: number) => setData((d) => ({ ...d, xp: d.xp + amount })),
      completeLesson: (courseId: string, lessonId: string, perfect: boolean) =>
        setData((d) => {
          const key = `${courseId}:${lessonId}`
          const completedLessons = d.completedLessons.includes(key)
            ? d.completedLessons
            : [...d.completedLessons, key]
          const today = todayStr()
          let streak = d.streak
          if (d.lastActiveDate === today) {
            streak = d.streak
          } else if (d.lastActiveDate === yesterdayStr()) {
            streak = d.streak + 1
          } else {
            streak = 1
          }
          const earnedXp = perfect ? 15 : 10
          return {
            ...d,
            completedLessons,
            streak,
            lastActiveDate: today,
            xp: d.xp + earnedXp,
            lessonPosition: null,
          }
        }),
      isLessonUnlocked: (course: Course, unitId: string, lessonId: string) => {
        const flat = course.units.flatMap((u) =>
          u.lessons.map((l) => ({ unitId: u.id, lessonId: l.id })),
        )
        const idx = flat.findIndex(
          (f) => f.unitId === unitId && f.lessonId === lessonId,
        )
        if (idx <= 0) return true
        const prev = flat[idx - 1]
        return new Set(data.completedLessons).has(
          `${course.id}:${prev.lessonId}`,
        )
      },
      saveLessonPosition: (
        courseId: string,
        unitId: string,
        lessonId: string,
        index: number,
      ) =>
        setData((d) => ({
          ...d,
          lessonPosition: { courseId, unitId, lessonId, index },
        })),
      clearLessonPosition: () =>
        setData((d) => ({ ...d, lessonPosition: null })),
    }),
    [data],
  )

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
