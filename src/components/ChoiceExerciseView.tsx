import { useEffect } from 'react'
import type { ChoiceExercise } from '../data/types'
import type { ColorClasses } from '../lib/colors'
import { playCorrectSound } from '../lib/sound'
import { pickCharacter } from '../data/characters'
import CharacterBubble from './CharacterBubble'
import SpeakerButton from './SpeakerButton'

interface Props {
  exercise: ChoiceExercise
  options: string[]
  selected: string | null
  status: 'active' | 'correct' | 'incorrect'
  colors: ColorClasses
  lang: string
  seed: number
  onSelect: (option: string) => void
}

export default function ChoiceExerciseView({
  exercise,
  options,
  selected,
  status,
  colors,
  lang,
  seed,
  onSelect,
}: Props) {
  const character = pickCharacter(seed)

  useEffect(() => {
    if (status === 'correct') playCorrectSound()
  }, [status])

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-extrabold text-slate-800 md:text-2xl">
        {exercise.prompt}
      </h1>
      <CharacterBubble character={character} status={status}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-display text-2xl font-extrabold text-slate-800">
              {exercise.source}
            </p>
            {exercise.sourceNote && (
              <p className="mt-1 text-sm text-slate-400">{exercise.sourceNote}</p>
            )}
            {exercise.sourcePronunciation && (
              <p className="text-sm text-slate-400">[{exercise.sourcePronunciation}]</p>
            )}
          </div>
          <SpeakerButton text={exercise.source} lang={lang} />
        </div>
      </CharacterBubble>
      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = selected === option
          const isAnswer = option === exercise.answer
          let stateClasses = 'border-slate-200 bg-white hover:border-slate-300'
          if (status !== 'active') {
            if (isAnswer) {
              stateClasses = 'border-emerald-500 bg-emerald-50 text-emerald-700'
            } else if (isSelected) {
              stateClasses = 'border-rose-500 bg-rose-50 text-rose-700'
            } else {
              stateClasses = 'border-slate-200 bg-white opacity-60'
            }
          } else if (isSelected) {
            stateClasses = `${colors.border} ${colors.bgLight}`
          }
          return (
            <button
              key={option}
              type="button"
              disabled={status !== 'active'}
              onClick={() => onSelect(option)}
              className={`rounded-2xl border-2 px-4 py-3 text-left font-bold text-slate-700 transition ${stateClasses}`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
