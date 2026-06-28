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
    const cellSize = Math.floor(Math.min(W, H - 40) / gridSize)
    const mapW = cellSize * gridSize
    const mapH = cellSize * gridSize
    const offsetX = (W - mapW) / 2
    const offsetY = 10

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

    // Border around the heatmap
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.strokeRect(offsetX, offsetY, mapW, mapH)

    // Legend bar
    const legendW = 200
    const legendH = 8
    const legendX = (W - legendW) / 2
    const legendY = offsetY + mapH + 16
    for (let i = 0; i < legendW; i++) {
      const t = i / legendW
      const [r, g, b] = getColor(t)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(legendX + i, legendY, 1, legendH)
    }
    ctx.strokeStyle = '#e5e7eb'
    ctx.strokeRect(legendX, legendY, legendW, legendH)

    // Legend labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('1', legendX, legendY + legendH + 4)
    ctx.textAlign = 'center'
    ctx.fillText('Stopping time', legendX + legendW / 2, legendY + legendH + 4)
    ctx.textAlign = 'right'
    ctx.fillText(`${maxT}`, legendX + legendW, legendY + legendH + 4)

    // Title
    ctx.fillStyle = '#374151'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(`n = 1 \u2014 ${maxN.toLocaleString()}   \u00b7   ${gridSize}\u00d7${gridSize} grid`, W / 2, H - 4)
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
