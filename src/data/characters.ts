import kangarooIdle1 from '../assets/characters/kangaroo-idle-1.png'
import kangarooIdle2 from '../assets/characters/kangaroo-idle-2.png'
import kangarooJump from '../assets/characters/kangaroo-jump.png'
import kangarooThumbsUp from '../assets/characters/kangaroo-thumbsup.png'
import kangarooWave from '../assets/characters/kangaroo-wave.png'

export interface CharacterPoses {
  idleOpen: string
  idleClosed: string
  /** Celebration poses; one is picked at random on a correct answer. */
  success: string[]
  /** Farewell pose shown when a lesson/chapter is completed. */
  wave: string
}

export interface Character {
  id: string
  name: string
  /** Emoji fallback, used only if a pose image fails to load. */
  emoji: string
  poses: CharacterPoses
}

const kangaroo: Character = {
  id: 'kangaroo',
  name: '캥거루',
  emoji: '🦘',
  poses: {
    idleOpen: kangarooIdle1,
    idleClosed: kangarooIdle2,
    success: [kangarooJump, kangarooThumbsUp],
    wave: kangarooWave,
  },
}

/** A single mascot is used everywhere; the seed argument is kept so call
 * sites don't need to change if per-lesson variety is reintroduced later. */
export function pickCharacter(_seed?: number): Character {
  return kangaroo
}

export function pickSuccessPose(seed: number): string {
  const poses = kangaroo.poses.success
  const index = ((seed % poses.length) + poses.length) % poses.length
  return poses[index]
}
