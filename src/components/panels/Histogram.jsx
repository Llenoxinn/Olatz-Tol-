import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stoppingTimes } from '../../lib/collatz.js'

const PAD = { top: 10, right: 12, bottom: 30, left: 36 }
const W = 320
const H = 160

export default function Histogram() {
  const canvasRef = useRef(null)
  const maxN = useCollatzStore((s) => s.maxN)

  const { bins, maxCount, maxTime } = useMemo(() => {
    const times = stoppingTimes(maxN)
    const maxT = Math.max(...times)
    const numBins = Math.min(60, maxT)
    const b = new Array(numBins).fill(0)
    for (const t of times) {
      const idx = Math.floor((t / maxT) * (numBins - 1))
      b[idx]++
    }
    return { bins: b, maxCount: Math.max(...b), maxTime: maxT }
  }, [maxN])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const plotW = W - PAD.left - PAD.right
    const plotH = H - PAD.top - PAD.bottom

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    // Y-axis grid + labels
    ctx.strokeStyle = '#f3f4f6'
    ctx.lineWidth = 1
    ctx.fillStyle = '#9ca3af'
    ctx.font = '9px Inter, monospace'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (let i = 0; i <= 3; i++) {
      const y = PAD.top + plotH - (i / 3) * plotH
      ctx.beginPath()
      ctx.moveTo(PAD.left, y)
      ctx.lineTo(W - PAD.right, y)
      ctx.stroke()
      const val = Math.round((i / 3) * maxCount)
      ctx.fillText(val, PAD.left - 4, y)
    }

    // Bars
    const barW = plotW / bins.length
    for (let i = 0; i < bins.length; i++) {
      const barH = (bins[i] / maxCount) * plotH
      const x = PAD.left + i * barW
      const y = PAD.top + plotH - barH
      const t = i / bins.length
      const g = Math.round(150 + t * 60)
      ctx.fillStyle = `rgb(${g - 60},${g},${g})`
      ctx.fillRect(x, y, Math.max(barW - 0.5, 0.5), barH)
    }

    // X-axis labels
    ctx.fillStyle = '#9ca3af'
    ctx.font = '9px Inter, monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('0', PAD.left, PAD.top + plotH + 6)
    ctx.textAlign = 'right'
    ctx.fillText(String(maxTime), W - PAD.right, PAD.top + plotH + 6)

    // X-axis title
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('Stopping time', PAD.left + plotW / 2, PAD.top + plotH + 18)
  }, [bins, maxCount, maxTime])

  return (
    <div>
      <div className="section-title">Distribution</div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block border border-gray-200 rounded"
      />
    </div>
  )
}
