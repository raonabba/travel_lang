interface Props {
  text: string
  progress: number
  active: boolean
  className?: string
}

/** Renders text as plain bold, or — while `active` (mic listening) — as a
 * per-character gray→green fill gauge showing how much of `text` has been
 * matched so far. */
export default function GaugeText({ text, progress, active, className = '' }: Props) {
  if (!active) {
    return <p className={`font-display font-extrabold text-slate-800 ${className}`}>{text}</p>
  }
  const filledCount = Math.round(progress * text.length)
  return (
    <p className={`font-display font-extrabold ${className}`}>
      {[...text].map((ch, i) => (
        <span key={i} className={i < filledCount ? 'text-emerald-500' : 'text-slate-300'}>
          {ch}
        </span>
      ))}
    </p>
  )
}
