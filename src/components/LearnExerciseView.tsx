import type { LearnExercise } from '../data/types'
import type { ColorClasses } from '../lib/colors'
import SpeakerButton from './SpeakerButton'

interface Props {
  exercise: LearnExercise
  lang: string
  colors: ColorClasses
}

export default function LearnExerciseView({ exercise, lang, colors }: Props) {
  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-extrabold text-slate-800 md:text-2xl">
        새 표현을 배워봐요
      </h1>
      <div
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 ${colors.border} ${colors.bgLight} px-5 py-8 text-center`}
      >
        <p className="font-display text-3xl font-extrabold text-slate-800">
          {exercise.target}
        </p>
        {exercise.note && (
          <p className="text-sm text-slate-500">{exercise.note}</p>
        )}
        {exercise.krPronunciation && (
          <p className="text-sm text-slate-400">[{exercise.krPronunciation}]</p>
        )}
        <SpeakerButton text={exercise.target} lang={lang} />
        <div className="mt-2 w-full border-t-2 border-dashed border-slate-300 pt-3">
          <p className="font-display text-xl font-bold text-slate-700">
            {exercise.kr}
          </p>
        </div>
      </div>
    </div>
  )
}
