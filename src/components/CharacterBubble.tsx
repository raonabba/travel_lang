import type { ReactNode } from 'react'
import type { Character } from '../data/characters'

interface Props {
  character: Character
  children: ReactNode
}

export default function CharacterBubble({ character, children }: Props) {
  return (
    <div className="mb-8 flex items-end gap-3">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-3xl ring-2 ring-slate-200">
        {character.avatarUrl ? (
          <img
            src={character.avatarUrl}
            alt={character.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{character.emoji}</span>
        )}
      </div>
      <div className="relative flex-1 rounded-2xl rounded-bl-none border-2 border-slate-200 bg-slate-50 px-4 py-4 text-left">
        {children}
      </div>
    </div>
  )
}
