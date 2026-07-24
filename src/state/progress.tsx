import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Course } from '../data/types'

const STORAGE_KEY = 'travel_lang_progress_v1'
export const MAX_HEARTS = 5
const HEART_REGEN_MS = 30 * 60 * 1000 // 30 minutes per heart

interface ProgressData {
  selectedCourseId: string | null
  xp: number
  streak: number
  lastActiveDate: string | null
  completedLessons: string[]
  hearts: number
  heartsUpdatedAt: number
}

const DEFAULT_DATA: ProgressData = {
  selectedCourseId: null,
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  completedLessons: [],
  hearts: MAX_HEARTS,
  heartsUpdatedAt: Date.now(),
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

export function currentHearts(hearts: number, heartsUpdatedAt: number, now = Date.now()): number {
  if (hearts >= MAX_HEARTS) return MAX_HEARTS
  const elapsed = now - heartsUpdatedAt
  const regen = Math.floor(elapsed / HEART_REGEN_MS)
  return Math.min(MAX_HEARTS, hearts + regen)
}

export function msUntilNextHeart(hearts: number, heartsUpdatedAt: number, now = Date.now()): number {
  const have = currentHearts(hearts, heartsUpdatedAt, now)
  if (have >= MAX_HEARTS) return 0
  const elapsed = now - heartsUpdatedAt
  const remainder = HEART_REGEN_MS - (elapsed % HEART_REGEN_MS)
  return remainder
}

interface ProgressContextValue {
  selectedCourseId: string | null
  xp: number
  streak: number
  hearts: number
  msToNextHeart: number
  completedLessonIds: Set<string>
  selectCourse: (id: string) => void
  loseHeart: () => void
  refillHearts: () => void
  completeLesson: (courseId: string, lessonId: string, perfect: boolean) => void
  isLessonUnlocked: (course: Course, unitId: string, lessonId: string) => boolean
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProgressData>(loadData)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])

  const hearts = currentHearts(data.hearts, data.heartsUpdatedAt, now)
  const msToNextHeart = msUntilNextHeart(data.hearts, data.heartsUpdatedAt, now)

  const value = useMemo<ProgressContextValue>(
    () => ({
      selectedCourseId: data.selectedCourseId,
      xp: data.xp,
      streak: data.streak,
      hearts,
      msToNextHeart,
      completedLessonIds: new Set(data.completedLessons),
      selectCourse: (id: string) =>
        setData((d) => ({ ...d, selectedCourseId: id })),
      loseHeart: () =>
        setData((d) => {
          const have = currentHearts(d.hearts, d.heartsUpdatedAt)
          const next = Math.max(0, have - 1)
          return { ...d, hearts: next, heartsUpdatedAt: Date.now() }
        }),
      refillHearts: () =>
        setData((d) => ({ ...d, hearts: MAX_HEARTS, heartsUpdatedAt: Date.now() })),
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
    }),
    [data, hearts, msToNextHeart],
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
