import type { LearningChannel } from '../data/types'

interface Props {
  channels: LearningChannel[]
}

export default function ChannelList({ channels }: Props) {
  return (
    <div className="mb-8">
      <h3 className="mb-3 font-display text-sm font-extrabold text-slate-500">
        📺 추천 유튜브 채널
      </h3>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {channels.map((channel) => (
          <a
            key={channel.url}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-52 shrink-0 flex-col gap-1 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 transition hover:border-red-300 hover:bg-red-50"
          >
            <span className="flex items-center gap-1 font-display text-sm font-extrabold text-slate-800">
              ▶️ {channel.name}
            </span>
            <span className="text-xs text-slate-500">{channel.description}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
