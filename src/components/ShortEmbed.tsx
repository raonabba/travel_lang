import { useState } from 'react'
import type { RelatedShort } from '../data/types'

interface Props {
  short: RelatedShort
}

export default function ShortEmbed({ short }: Props) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="mb-8 flex flex-col items-center">
      <p className="mb-2 self-start text-xs font-extrabold text-slate-400">
        🎬 관련 쇼츠
      </p>
      <div className="w-full max-w-[220px] overflow-hidden rounded-2xl border-2 border-slate-200 bg-black shadow-sm">
        <div className="relative aspect-[9/16] w-full">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&playsinline=1`}
              title={short.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`${short.title} 재생`}
              className="absolute inset-0 h-full w-full"
              style={{
                backgroundImage: `url(https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <span className="absolute inset-0 bg-black/20 transition hover:bg-black/10" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl shadow-lg">
                  ▶️
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 py-3 text-left text-xs font-bold leading-snug text-white">
                {short.title}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
