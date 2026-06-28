import { useRef, useCallback } from 'react'
import useCollatzStore from '../store/useCollatzStore.js'

export default function useSound() {
  const ctxRef = useRef(null)
  const enabled = useCollatzStore((s) => s.soundEnabled)

  const playNote = useCallback((value) => {
    if (!enabled || value <= 0) return
    try {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = ctxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      const freq = Math.min(55 * Math.pow(2, Math.log2(value) / 4), 3000)
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
    } catch {
    }
  }, [enabled])

  return { playNote }
}
