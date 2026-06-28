import { useRef, useEffect } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stoppingTimes } from '../../lib/collatz.js'
import { VIZ_W, VIZ_H } from './VizContainer.jsx'

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
    const W = VIZ_W, H = VIZ_H

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    const times = stoppingTimes(maxN)
    const maxT = Math.max(...times)
    const gridSize = Math.ceil(Math.sqrt(maxN))

    // Layout: title (20) + grid + gap (12) + legend (30) + gap (8) + description (16)
    const titleH = 22
    const legendH = 30
    const descH = 16
    const gap = 10
    const mapArea = H - titleH - legendH - descH - gap * 3
    const cellSize = Math.floor(Math.min(W, mapArea) / gridSize)
    const mapW = cellSize * gridSize
    const mapH = cellSize * gridSize
    const offsetX = (W - mapW) / 2
    const offsetY = titleH + gap

    // Title
    ctx.fillStyle = '#374151'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(
      `Stopping time  \u00b7  n = 1\u2013${maxN.toLocaleString()}  \u00b7  ${gridSize}\u00d7${gridSize}`,
      W / 2,
      6
    )

    // Draw grid
    for (let i = 0; i < maxN; i++) {
      const col = i % gridSize
      const row = Math.floor(i / gridSize)
      const t = times[i] / maxT
      const [r, g, b] = getColor(t)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(
        offsetX + col * cellSize,
        offsetY + row * cellSize,
        cellSize,
        cellSize
      )
    }

    // Grid border
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.strokeRect(offsetX, offsetY, mapW, mapH)

    // Legend
    const legendY = offsetY + mapH + gap
    const legendBarW = 160
    const legendBarH = 8
    const legendBarX = (W - legendBarW) / 2

    for (let i = 0; i < legendBarW; i++) {
      const t = i / legendBarW
      const [r, g, b] = getColor(t)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(legendBarX + i, legendY, 1, legendBarH)
    }
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 0.5
    ctx.strokeRect(legendBarX, legendY, legendBarW, legendBarH)

    // Legend labels
    ctx.fillStyle = '#9ca3af'
    ctx.font = '9px Inter, monospace'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.fillText('1', legendBarX, legendY + legendBarH + 3)
    ctx.textAlign = 'right'
    ctx.fillText(String(maxT), legendBarX + legendBarW, legendY + legendBarH + 3)

    // Description
    const descY = legendY + legendBarH + 20
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(
      'Each cell = a starting number. Color = steps to reach 1.',
      W / 2,
      descY
    )
  }, [maxN])

  return (
    <canvas
      ref={canvasRef}
      width={VIZ_W}
      height={VIZ_H}
      className="block"
      style={{ width: VIZ_W, height: VIZ_H }}
    />
  )
}
