interface Props {
  words: string[]
}

/** Renders a multi-word answer as separated pill chips instead of one run-on
 * string, so learners can clearly see the word breakdown in feedback. */
export default function AnswerWords({ words }: Props) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 align-middle">
      {words.map((word, i) => (
        <span
          key={i}
          className="rounded-lg border border-rose-300 bg-white px-2 py-0.5 font-display font-extrabold text-rose-600"
        >
          {word}
        </span>
      ))}
    </span>
  )
}
