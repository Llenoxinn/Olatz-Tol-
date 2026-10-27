import { useEffect } from 'react'
import useCollatzStore from '../store/useCollatzStore.js'
import { sequence } from '../lib/collatz.js'

// One context for the whole app; browsers cap how many can be open at once.
let audio = null

function playNote(value) {
  try {
    audio ??= new AudioContext()
    const t = audio.currentTime
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.frequency.setValueAtTime(Math.min(55 * 2 ** (Math.log2(value) / 4), 3000), t)
    gain.gain.setValueAtTime(0.12, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    osc.connect(gain).connect(audio.destination)
    osc.start(t)
    osc.stop(t + 0.2)
  } catch {
    // No Web Audio: play silently.
  }
}

// Steps the store while playing and sounds each value reached. Mount once.
export default function usePlayback() {
  const isPlaying = useCollatzStore((s) => s.isPlaying)
  const playbackSpeed = useCollatzStore((s) => s.playbackSpeed)

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => useCollatzStore.getState().stepForward(), playbackSpeed)
    return () => clearInterval(id)
  }, [isPlaying, playbackSpeed])

  // Subscribing directly keeps every step from re-rendering the caller.
  useEffect(
    () =>
      useCollatzStore.subscribe((s, prev) => {
        if (!s.soundEnabled || s.n !== prev.n || s.stepIndex <= prev.stepIndex) return
        const value = sequence(s.n)[s.stepIndex]
        if (value) playNote(value)
      }),
    [],
  )
}
