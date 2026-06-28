import { useRef, useEffect } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stoppingTimes } from '../../lib/collatz.js'

const SIZE = 500

function getColor(t) {
  if (t < 0.05) return [236, 253, 245]
  if (t < 0.15) return [167, 243, 208]
  if (t < 0.3) return [52, 211, 153]
  if (t < 0.5) return [16, 185, 129]
  if (t < 0.7) return [5, 150, 105]
  if (t < 0.85) return [4, 120, 87]
  if (t < 0.95) return [6, 95, 70]
  return [6, 78, 59]
}

export default function Heatmap() {
  const canvasRef = useRef(null)
  const maxN = useCollatzStore((s) => s.maxN)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const times = stoppingTimes(maxN)
    const maxT = Math.max(...times)

    const gridSize = Math.ceil(Math.sqrt(maxN))
    const cellW = SIZE / gridSize

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, SIZE, SIZE)

    for (let i = 0; i < maxN; i++) {
      const col = i % gridSize
      const row = Math.floor(i / gridSize)
      const t = times[i] / maxT
      const [r, g, b] = getColor(t)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(
        Math.floor(col * cellW),
        Math.floor(row * cellW),
        Math.ceil(cellW),
        Math.ceil(cellW)
      )
    }

    ctx.fillStyle = '#6b7280'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`Stopping time  1 \u2014 ${maxN.toLocaleString()}`, SIZE / 2, SIZE - 8)
  }, [maxN])

  return (
    <div className="border border-gray-200 rounded overflow-hidden inline-block">
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="block"
      />
    </div>
  )
}
