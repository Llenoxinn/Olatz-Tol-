import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { sequence } from '../../lib/collatz.js'

export default function StepControls() {
  const n = useCollatzStore((s) => s.n)
  const stepIndex = useCollatzStore((s) => s.stepIndex)
  const isPlaying = useCollatzStore((s) => s.isPlaying)
  const stepMode = useCollatzStore((s) => s.stepMode)
  const soundEnabled = useCollatzStore((s) => s.soundEnabled)
  const togglePlay = useCollatzStore((s) => s.togglePlay)
  const stepForward = useCollatzStore((s) => s.stepForward)
  const stepBack = useCollatzStore((s) => s.stepBack)
  const setStepMode = useCollatzStore((s) => s.setStepMode)
  const toggleSound = useCollatzStore((s) => s.toggleSound)
  const playbackSpeed = useCollatzStore((s) => s.playbackSpeed)
  const setPlaybackSpeed = useCollatzStore((s) => s.setPlaybackSpeed)

  const seq = sequence(n)
  const atStart = stepIndex === 0
  const atEnd = stepIndex >= seq.length - 1

  return (
    <div>
      <div className="section-title">Playback</div>
      <div className="flex items-center gap-0.5 mb-2">
        <button
          onClick={stepBack}
          disabled={atStart}
          className="btn btn-ghost !px-1.5 !py-1 disabled:opacity-30"
        >
          <SkipBack size={14} />
        </button>
        <button
          onClick={togglePlay}
          className="btn btn-primary !px-2.5 !py-1"
        >
          {isPlaying ? <Pause size={14} /> : atEnd ? <Play size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={stepForward}
          disabled={atEnd}
          className="btn btn-ghost !px-1.5 !py-1 disabled:opacity-30"
        >
          <SkipForward size={14} />
        </button>
        <div className="flex-1" />
        <button
          onClick={toggleSound}
          className={`btn !px-1.5 !py-1 ${
            soundEnabled ? 'text-emerald-600' : 'text-gray-400'
          }`}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="font-mono">
          {stepIndex}/{seq.length - 1}
        </span>
        <div className="flex-1" />
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={stepMode === 'step'}
            onChange={(e) => setStepMode(e.target.checked ? 'step' : 'auto')}
            className="accent-emerald-600 w-3 h-3"
          />
          Step
        </label>
      </div>

      {stepMode === 'auto' && (
        <div className="mt-1.5">
          <input
            type="range"
            min={20}
            max={500}
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="w-full accent-emerald-600 h-1"
          />
          <div className="text-[10px] text-gray-400 text-right font-mono">
            {playbackSpeed}ms
          </div>
        </div>
      )}
    </div>
  )
}
