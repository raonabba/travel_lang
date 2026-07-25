export interface Character {
  id: string
  name: string
  emoji: string
  /** Filled in once real character art is provided; falls back to the emoji until then. */
  avatarUrl?: string
}

export const characters: Character[] = [
  { id: 'duo', name: '두오', emoji: '🦉' },
  { id: 'gubi', name: '구비', emoji: '🐊' },
  { id: 'oscar', name: '오스카', emoji: '🐻' },
  { id: 'lily', name: '릴리', emoji: '🌸' },
]

export function pickCharacter(seed: number): Character {
  const index = ((seed % characters.length) + characters.length) % characters.length
  return characters[index]
}
