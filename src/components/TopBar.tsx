import { useNavigate } from 'react-router-dom'
import { useProgress } from '../state/progress'

export default function TopBar() {
  const { xp, streak } = useProgress()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-10 border-b-2 border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="font-display text-lg font-extrabold tracking-tight text-emerald-500"
        >
          여행어
        </button>
        <div className="flex items-center gap-4 font-display text-sm font-extrabold">
          <span className="flex items-center gap-1 text-orange-500">
            🔥 {streak}
          </span>
          <span className="flex items-center gap-1 text-yellow-500">
            ⭐ {xp}
          </span>
        </div>
      </div>
    </header>
  )
}
