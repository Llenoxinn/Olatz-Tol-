import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stoppingTimes } from '../../lib/collatz.js'

const W = 260, H = 100

export default function Histogram() {
  const canvasRef = useRef(null)
  const maxN = useCollatzStore((s) => s.maxN)

  const { bins, maxCount } = useMemo(() => {
    const times = stoppingTimes(maxN)
    const maxT = Math.max(...times)
    const numBins = Math.min(60, maxT)
    const b = new Array(numBins).fill(0)
    for (const t of times) {
      const idx = Math.floor((t / maxT) * (numBins - 1))
      b[idx]++
    }
    return { bins: b, maxCount: Math.max(...b) }
  }, [maxN])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    const barW = W / bins.length
    for (let i = 0; i < bins.length; i++) {
      const barH = (bins[i] / maxCount) * (H - 4)
      const x = i * barW
      const y = H - barH
      const t = i / bins.length
      const g = Math.round(150 + t * 60)
      ctx.fillStyle = `rgb(${g - 60},${g},${g})`
      ctx.fillRect(x, y, barW - 0.5, barH)
    }
  }, [bins, maxCount])

  return (
    <div>
      <div className="section-title">Distribution</div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full border border-gray-200 rounded"
        style={{ aspectRatio: `${W}/${H}` }}
      />
    </div>
  )
}
