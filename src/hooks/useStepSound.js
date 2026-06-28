import { useEffect, useRef } from 'react'
import useCollatzStore from '../store/useCollatzStore.js'
import useSound from './useSound.js'
import { sequence } from '../lib/collatz.js'

export default function useStepSound() {
  const prevRef = useRef(-1)
  const stepIndex = useCollatzStore((s) => s.stepIndex)
  const n = useCollatzStore((s) => s.n)
  const soundEnabled = useCollatzStore((s) => s.soundEnabled)
  const { playNote } = useSound()

  useEffect(() => {
    const prev = prevRef.current
    prevRef.current = stepIndex
    if (!soundEnabled) return
    if (stepIndex > prev && stepIndex > 0) {
      const seq = sequence(n)
      if (stepIndex < seq.length) {
        playNote(seq[stepIndex])
      }
    }
  }, [stepIndex, n, soundEnabled, playNote])
}
