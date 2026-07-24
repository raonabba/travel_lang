import type { CourseColor } from '../data/types'

export interface ColorClasses {
  bg: string
  bgHover: string
  bgLight: string
  text: string
  border: string
  ring: string
}

export const courseColorClasses: Record<CourseColor, ColorClasses> = {
  green: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    bgLight: 'bg-emerald-100',
    text: 'text-emerald-500',
    border: 'border-emerald-600',
    ring: 'ring-emerald-300',
  },
  blue: {
    bg: 'bg-sky-500',
    bgHover: 'hover:bg-sky-600',
    bgLight: 'bg-sky-100',
    text: 'text-sky-500',
    border: 'border-sky-600',
    ring: 'ring-sky-300',
  },
  orange: {
    bg: 'bg-orange-500',
    bgHover: 'hover:bg-orange-600',
    bgLight: 'bg-orange-100',
    text: 'text-orange-500',
    border: 'border-orange-600',
    ring: 'ring-orange-300',
  },
}
