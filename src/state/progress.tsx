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
  /** Per-card mistake score (courseId:target -> score), used to weight
   * which words come up more often in review. Wrong answers raise the
   * score, correct answers lower it, so recently-missed words surface
   * more until they're answered right again. */
  cardStats: Record<string, number>
}

const DEFAULT_DATA: ProgressData = {
  selectedCourseId: null,
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  completedLessons: [],
  lessonPosition: null,
  cardStats: {},
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

function cardKey(courseId: string, target: string): string {
  return `${courseId}:${target}`
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
  /** Call whenever an exercise is graded, so mistakes bias future review. */
  recordCardResult: (courseId: string, target: string, correct: boolean) => void
  /** Sampling weight for a card in review — higher for recently-missed words. */
  getCardWeight: (courseId: string, target: string) => number
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
      recordCardResult: (courseId: string, target: string, correct: boolean) =>
        setData((d) => {
          const key = cardKey(courseId, target)
          const current = d.cardStats[key] ?? 0
          const next = correct ? Math.max(0, current - 1) : current + 2
          return { ...d, cardStats: { ...d.cardStats, [key]: next } }
        }),
      getCardWeight: (courseId: string, target: string) =>
        1 + (data.cardStats[cardKey(courseId, target)] ?? 0),
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
