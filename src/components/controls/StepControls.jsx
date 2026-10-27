import { SkipBack, Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react'
import useCollatzStore, { lastStep } from '../../store/useCollatzStore.js'

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
      <div className="mb-2 flex items-center gap-0.5">
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
        <button
          onClick={toggleSound}
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          aria-pressed={soundEnabled}
          className={`btn btn-icon ml-1 ${soundEnabled ? 'text-neon' : 'text-faint'}`}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
      </div>
      <input
        type="range"
        min={20}
        max={500}
        aria-label="Delay between steps"
        value={playbackSpeed}
        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
        className="range"
      />
      <div className="mt-1 flex justify-between text-xs text-faint tabular-nums">
        <span>Delay</span>
        <span>{playbackSpeed} ms</span>
      </div>
    </div>
  )
}
