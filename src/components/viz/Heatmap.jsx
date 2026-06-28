import { useRef, useEffect } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stoppingTimes } from '../../lib/collatz.js'

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

export default function Heatmap({ w = 700, h = 450 }) {
  const canvasRef = useRef(null)
  const maxN = useCollatzStore((s) => s.maxN)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    const times = stoppingTimes(maxN)
    const maxT = Math.max(...times)
    const gridSize = Math.ceil(Math.sqrt(maxN))

    const gridMaxW = w - 200
    const gridMaxH = h - 40
    const cellSize = Math.floor(Math.min(gridMaxW, gridMaxH) / gridSize)
    const mapW = cellSize * gridSize
    const mapH = cellSize * gridSize
    const gridX = 12
    const gridY = 20

    for (let i = 0; i < maxN; i++) {
      const col = i % gridSize
      const row = Math.floor(i / gridSize)
      const t = times[i] / maxT
      const [r, g, b] = getColor(t)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(gridX + col * cellSize, gridY + row * cellSize, cellSize, cellSize)
    }

    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.strokeRect(gridX, gridY, mapW, mapH)

    const rpX = gridX + mapW + 20
    const rpY = gridY

    ctx.fillStyle = '#111827'
    ctx.font = 'bold 12px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('Stopping Time', rpX, rpY)

    ctx.fillStyle = '#6b7280'
    ctx.font = '11px Inter, sans-serif'
    ctx.fillText(`n = 1 \u2013 ${maxN.toLocaleString()}`, rpX, rpY + 20)
    ctx.fillText(`${gridSize} \u00d7 ${gridSize} grid`, rpX, rpY + 36)

    const legX = rpX
    const legY = rpY + 70
    const legW = 18
    const legH = Math.min(200, h - 180)

    for (let i = 0; i < legH; i++) {
      const t = 1 - i / legH
      const [r, g, b] = getColor(t)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(legX, legY + i, legW, 1)
    }
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 0.5
    ctx.strokeRect(legX, legY, legW, legH)

    ctx.fillStyle = '#374151'
    ctx.font = '10px Inter, monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(maxT), legX + legW + 8, legY)
    ctx.fillText('1', legX + legW + 8, legY + legH)
    ctx.fillStyle = '#9ca3af'
    ctx.font = '9px Inter, sans-serif'
    ctx.fillText('max steps', legX + legW + 8, legY - 14)
    ctx.fillText('min steps', legX + legW + 8, legY + legH + 14)

    const descY = legY + legH + 36
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('Each cell = a starting number.', rpX, descY)
    ctx.fillText('Color = steps to reach 1.', rpX, descY + 16)
  }, [maxN, w, h])

  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      className="block"
      style={{ width: w, height: h }}
    />
  )
}
