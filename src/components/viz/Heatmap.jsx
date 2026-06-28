import { useRef, useEffect } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stoppingTimes } from '../../lib/collatz.js'
import { VIZ_W, VIZ_H } from './vizSize.js'
import { setExportFn, clearExportFn } from './exportBus.js'

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
    setExportFn(() => {
      const src = canvasRef.current
      if (!src) return
      const tmp = document.createElement('canvas')
      tmp.width = src.width
      tmp.height = src.height
      const ctx = tmp.getContext('2d')
      ctx.drawImage(src, 0, 0)
      const imageData = ctx.getImageData(0, 0, tmp.width, tmp.height)
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 250 && d[i + 1] > 250 && d[i + 2] > 250) d[i + 3] = 0
      }
      ctx.putImageData(imageData, 0, 0)
      const link = document.createElement('a')
      link.download = 'olatz-tol-heatmap.png'
      link.href = tmp.toDataURL('image/png')
      link.click()
    })
    return () => clearExportFn()
  }, [])

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

    const gridMaxW = W - 200
    const gridMaxH = H - 40
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

    // Right panel
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

    // Vertical legend
    const legX = rpX
    const legY = rpY + 70
    const legW = 18
    const legH = 200

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

    // Description
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    const descY = legY + legH + 36
    ctx.fillText('Each cell represents', rpX, descY)
    ctx.fillText('a starting number.', rpX, descY + 16)
    ctx.fillText('Color intensity =', rpX, descY + 36)
    ctx.fillText('steps to reach 1.', rpX, descY + 52)

    ctx.fillStyle = '#9ca3af'
    ctx.font = '9px Inter, sans-serif'
    ctx.fillText('Powers of 2 (dark) reach', rpX, descY + 80)
    ctx.fillText('1 fastest. Clusters form', rpX, descY + 94)
    ctx.fillText('around them.', rpX, descY + 108)
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
