import { useEffect, useState } from 'react'
import type { MeaningBankExercise, TokenChunk } from '../data/types'
import { playCorrectSound } from '../lib/sound'
import { pickCharacter } from '../data/characters'
import CharacterBubble from './CharacterBubble'
import SpeakerButton from './SpeakerButton'

interface Props {
  exercise: MeaningBankExercise
  tokenPool: { chunk: TokenChunk; i: number }[]
  pickedIndices: number[]
  status: 'active' | 'correct' | 'incorrect'
  lang: string
  seed: number
  onPick: (i: number) => void
  onRemove: (position: number) => void
}

export default function MeaningBankExerciseView({
  exercise,
  tokenPool,
  pickedIndices,
  status,
  lang,
  seed,
  onPick,
  onRemove,
}: Props) {
  const character = pickCharacter(seed)
  const pickedSet = new Set(pickedIndices)
  const [hintShown, setHintShown] = useState(false)
  const answerBoxState =
    status === 'correct'
      ? 'border-emerald-500 bg-emerald-50'
      : status === 'incorrect'
        ? 'border-rose-500 bg-rose-50'
        : 'border-slate-200 bg-slate-50'

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
            <p className="font-display text-xl font-extrabold text-slate-800">
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

      <div
        className={`mb-6 flex min-h-20 flex-wrap items-start gap-2 rounded-2xl border-2 p-3 ${answerBoxState}`}
      >
        {pickedIndices.length === 0 && (
          <span className="py-2 text-sm text-slate-400">
            아래 단어를 순서대로 선택하세요
          </span>
        )}
        {pickedIndices.map((i, pos) => (
          <button
            key={`${i}-${pos}`}
            type="button"
            disabled={status !== 'active'}
            onClick={() => onRemove(pos)}
            className="flex flex-col items-center rounded-xl border-2 border-slate-300 bg-white px-3 py-2"
          >
            <span className="font-bold text-slate-700">
              {exercise.tokens[i].gloss}
            </span>
            {hintShown && (
              <span className="text-[11px] text-slate-400">
                {exercise.tokens[i].text}
              </span>
            )}
          </button>
        ))}
      </div>

      {!hintShown && (
        <button
          type="button"
          onClick={() => setHintShown(true)}
          className="mb-4 w-full text-center text-sm font-bold text-slate-400 underline underline-offset-2"
        >
          모르겠어요, 힌트 보기
        </button>
      )}

      <div className="flex flex-wrap gap-2">
        {tokenPool.map(({ chunk, i }) =>
          pickedSet.has(i) ? null : (
            <button
              key={i}
              type="button"
              disabled={status !== 'active'}
              onClick={() => onPick(i)}
              className="flex flex-col items-center rounded-xl border-2 border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-100"
            >
              <span className="font-bold text-slate-700">{chunk.gloss}</span>
              {hintShown && (
                <span className="text-[11px] text-slate-400">{chunk.text}</span>
              )}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
