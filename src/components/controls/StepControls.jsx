import { SkipBack, Play, Pause, SkipForward } from 'lucide-react'
import useCollatzStore, { lastStep } from '../../store/useCollatzStore.js'
import Switch from './Switch.jsx'

// ms between steps
const SPEEDS = [
  ['Slow', 300],
  ['Normal', 100],
  ['Fast', 40],
]

export default function StepControls() {
  const stepIndex = useCollatzStore((s) => s.stepIndex)
  const isPlaying = useCollatzStore((s) => s.isPlaying)
  const soundEnabled = useCollatzStore((s) => s.soundEnabled)
  const playbackSpeed = useCollatzStore((s) => s.playbackSpeed)
  const last = useCollatzStore(lastStep)
  const togglePlay = useCollatzStore((s) => s.togglePlay)
  const stepForward = useCollatzStore((s) => s.stepForward)
  const stepBack = useCollatzStore((s) => s.stepBack)
  const toggleSound = useCollatzStore((s) => s.toggleSound)
  const setPlaybackSpeed = useCollatzStore((s) => s.setPlaybackSpeed)

  return (
    <div>
      <h2 className="section-title">Playback</h2>
      <div className="mb-4 flex items-center gap-0.5">
        <button onClick={stepBack} disabled={stepIndex === 0} aria-label="Step back" className="btn btn-ghost btn-icon">
          <SkipBack size={14} />
        </button>
        <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="btn btn-primary px-3 py-1">
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button onClick={stepForward} disabled={stepIndex >= last} aria-label="Step forward" className="btn btn-ghost btn-icon">
          <SkipForward size={14} />
        </button>
        <span className="flex-1 text-right text-xs text-dim tabular-nums">
          {stepIndex} / {last}
        </span>
      </div>

      <fieldset className="mb-4">
        <legend className="section-title">Speed</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {SPEEDS.map(([label, ms]) => (
            <label key={ms} className="flex cursor-pointer items-center gap-2 text-sm text-dim transition-colors has-checked:text-fg">
              <input
                type="radio"
                name="speed"
                checked={playbackSpeed === ms}
                onChange={() => setPlaybackSpeed(ms)}
                className="radio"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <Switch checked={soundEnabled} onChange={toggleSound}>Sound</Switch>
    </div>
  )
}
