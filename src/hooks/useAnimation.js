import { useEffect, useRef } from 'react'
import useCollatzStore from '../store/useCollatzStore.js'
import { sequence } from '../lib/collatz.js'

export default function useAnimation() {
  const timerRef = useRef(null)
  const isPlaying = useCollatzStore((s) => s.isPlaying)
  const playbackSpeed = useCollatzStore((s) => s.playbackSpeed)
  const n = useCollatzStore((s) => s.n)
  const stepForward = useCollatzStore((s) => s.stepForward)
  const stepIndex = useCollatzStore((s) => s.stepIndex)
  const setPlaying = (v) => useCollatzStore.setState({ isPlaying: v })

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    const seq = sequence(n)
    if (stepIndex >= seq.length - 1) {
      setPlaying(false)
      return
    }
    timerRef.current = setInterval(() => {
      const state = useCollatzStore.getState()
      const seq = sequence(state.n)
      if (state.stepIndex >= seq.length - 1) {
        setPlaying(false)
      } else {
        stepForward()
      }
    }, playbackSpeed)
    return () => clearInterval(timerRef.current)
  }, [isPlaying, playbackSpeed, n])
}
