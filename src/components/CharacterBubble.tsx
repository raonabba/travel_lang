import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Character } from '../data/characters'

interface Props {
  character: Character
  status?: 'active' | 'correct' | 'incorrect'
  children: ReactNode
}

const BLINK_INTERVAL_MS = 3500
const BLINK_DURATION_MS = 200

export default function CharacterBubble({ character, status = 'active', children }: Props) {
  const [blinkClosed, setBlinkClosed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const successPoseRef = useRef(
    character.poses.success[Math.floor(Math.random() * character.poses.success.length)],
  )

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setBlinkClosed(true)
      setTimeout(() => setBlinkClosed(false), BLINK_DURATION_MS)
    }, BLINK_INTERVAL_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (status === 'correct') {
      const poses = character.poses.success
      successPoseRef.current = poses[Math.floor(Math.random() * poses.length)]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const poseImage =
    status === 'correct'
      ? successPoseRef.current
      : blinkClosed
        ? character.poses.idleClosed
        : character.poses.idleOpen

  return (
    <div className="mb-8 flex items-end gap-3">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200 transition-transform ${
          status === 'correct' ? 'animate-bounce' : ''
        }`}
      >
        <img src={poseImage} alt={character.name} className="h-full w-full object-cover" />
      </div>
      <div className="relative flex-1 rounded-2xl rounded-bl-none border-2 border-slate-200 bg-slate-50 px-4 py-4 text-left">
        {children}
      </div>
    </div>
  )
}
