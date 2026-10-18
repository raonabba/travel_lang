import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../state/progress'
import { getCourse } from '../data/courses'
import {
  buildFreeTalkPool,
  findBestFreeTalkMatch,
  FREETALK_MATCH_THRESHOLD,
  type PhraseEntry,
} from '../lib/freetalk'
import {
  bestMatchRatio,
  canRecognizeSpeech,
  createRecognizer,
  isSpokenMatch,
} from '../lib/speechRecognition'
import { playCorrectSound } from '../lib/sound'
import { speak, canSpeak } from '../lib/speech'
import GaugeText from '../components/GaugeText'
import SpeakerButton from '../components/SpeakerButton'

type Stage = 'idle' | 'listening-free' | 'matched' | 'listening-repeat' | 'result'

interface Round {
  id: number
  heard: string
  match: PhraseEntry | null
  repeatCorrect?: boolean
}

export default function FreeTalkPage() {
  const navigate = useNavigate()
  const { selectedCourseId } = useProgress()
  const course = selectedCourseId ? getCourse(selectedCourseId) : undefined

  const [pool] = useState(() => buildFreeTalkPool(course))
  const [stage, setStage] = useState<Stage>('idle')
  const [progress, setProgress] = useState(0)
  const [heard, setHeard] = useState('')
  const [rounds, setRounds] = useState<Round[]>([])
  const nextId = useRef(0)

  const supported = canRecognizeSpeech()

  function startFreeListening() {
    const recognizer = createRecognizer('ko-KR')
    if (!recognizer) return
    setStage('listening-free')
    setHeard('')
    recognizer.onresult = (event) => {
      const last = event.results[event.results.length - 1]
      const transcript = last[0].transcript
      setHeard(transcript)
      if (last.isFinal) {
        const bestMatch = findBestFreeTalkMatch(transcript, pool)
        const match =
          bestMatch && bestMatch.score >= FREETALK_MATCH_THRESHOLD ? bestMatch.entry : null
        const round: Round = { id: nextId.current++, heard: transcript, match }
        setRounds((r) => [...r, round])
        setStage('matched')
        if (match && canSpeak()) speak(match.target, match.lang)
      }
    }
    recognizer.onerror = () => setStage('idle')
    recognizer.onend = () => setStage((s) => (s === 'listening-free' ? 'idle' : s))
    recognizer.start()
  }

  function startRepeatListening(entry: PhraseEntry) {
    const recognizer = createRecognizer(entry.lang)
    if (!recognizer) return
    setStage('listening-repeat')
    setProgress(0)
    const candidates = [entry.target, entry.note].filter((c): c is string => !!c)
    recognizer.onresult = (event) => {
      const last = event.results[event.results.length - 1]
      const transcript = last[0].transcript
      setProgress(bestMatchRatio(candidates, transcript))
      if (last.isFinal) {
        const correct = isSpokenMatch(candidates, transcript)
        if (correct) playCorrectSound()
        setRounds((r) =>
          r.map((round, i) =>
            i === r.length - 1 ? { ...round, repeatCorrect: correct } : round,
          ),
        )
        setStage('result')
      }
    }
    recognizer.onerror = () => {
      setRounds((r) =>
        r.map((round, i) => (i === r.length - 1 ? { ...round, repeatCorrect: false } : round)),
      )
      setStage('result')
    }
    recognizer.start()
  }

  function reset() {
    setStage('idle')
    setHeard('')
    setProgress(0)
  }

  if (!supported) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-slate-500">이 브라우저는 음성 인식을 지원하지 않아요.</p>
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="rounded-2xl bg-emerald-500 px-6 py-3 font-display font-extrabold text-white"
        >
          홈으로
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <div className="mx-auto flex w-full max-w-md items-center gap-4 px-4 pt-4">
        <button
          type="button"
          aria-label="닫기"
          onClick={() => navigate('/learn')}
          className="text-2xl text-slate-400"
        >
          ×
        </button>
        <p className="shrink-0 text-xs font-extrabold text-slate-400">
          🗣️ 프리토킹 · {pool.length}개 문장 중에서 찾아요
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
        {rounds.length === 0 && (
          <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            자유롭게 한국어로 말해보세요. 아는 문장과 비슷하면 영어로 어떻게
            말하는지 알려드릴게요.
          </p>
        )}

        {rounds.map((round, i) => (
          <div key={round.id} className="flex flex-col gap-2">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-sky-500 px-4 py-2 text-right text-white">
              {round.heard}
            </div>
            {round.match ? (
              <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3">
                <p className="text-xs font-extrabold text-slate-400">
                  이렇게 말해보세요
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-display text-lg font-extrabold text-slate-800">
                    {round.match.target}
                  </p>
                  <SpeakerButton text={round.match.target} lang={round.match.lang} />
                </div>
                {round.match.note && (
                  <p className="text-sm text-slate-400">{round.match.note}</p>
                )}
                {round.match.krPronunciation && (
                  <p className="text-sm text-slate-400">
                    [{round.match.krPronunciation}]
                  </p>
                )}

                {round.repeatCorrect === undefined &&
                  i === rounds.length - 1 &&
                  stage === 'matched' && (
                    <button
                      type="button"
                      onClick={() => startRepeatListening(round.match!)}
                      className="mt-3 w-full rounded-xl bg-sky-500 py-2 font-display text-sm font-extrabold text-white shadow-[0_3px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
                    >
                      🎤 다시 말해보자
                    </button>
                  )}

                {i === rounds.length - 1 && stage === 'listening-repeat' && (
                  <div className="mt-3 flex flex-col items-center gap-1">
                    <GaugeText
                      text={round.match.target}
                      progress={progress}
                      active
                      className="justify-center text-base"
                    />
                    <p className="text-xs font-bold text-rose-500">듣고 있어요...</p>
                  </div>
                )}

                {round.repeatCorrect !== undefined && (
                  <p
                    className={`mt-3 font-display text-sm font-extrabold ${
                      round.repeatCorrect ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {round.repeatCorrect ? '정답이에요! 🎉' : '다시 한번 들어볼까요? 😅'}
                  </p>
                )}
              </div>
            ) : (
              <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-500">
                  아직 모르는 문장이에요. 지금까지 배운 문장으로 다시
                  말해볼까요?
                </p>
              </div>
            )}
          </div>
        ))}

        {stage === 'listening-free' && (
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-sky-100 px-4 py-2 text-right text-sky-600">
            {heard || '...'}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 flex flex-col items-center gap-2 border-t-2 border-slate-100 bg-white px-4 py-5">
        {(stage === 'idle' || stage === 'listening-free') && (
          <>
            <button
              type="button"
              onClick={startFreeListening}
              disabled={stage === 'listening-free'}
              className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition ${
                stage === 'listening-free' ? 'animate-pulse bg-rose-500' : 'bg-sky-500'
              }`}
            >
              🎤
            </button>
            <p className="text-xs font-bold text-slate-500">
              {stage === 'listening-free' ? '듣고 있어요...' : '눌러서 한국어로 말하기'}
            </p>
          </>
        )}
        {stage === 'matched' && (
          <button
            type="button"
            onClick={startFreeListening}
            className="rounded-2xl border-2 border-slate-200 px-6 py-3 font-display font-extrabold text-slate-600"
          >
            건너뛰고 다음 문장 말하기
          </button>
        )}
        {stage === 'result' && (
          <button
            type="button"
            onClick={reset}
            className="w-full max-w-xs rounded-2xl bg-emerald-500 py-3 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition active:translate-y-1 active:shadow-none"
          >
            계속 말하기
          </button>
        )}
      </div>
    </div>
  )
}
