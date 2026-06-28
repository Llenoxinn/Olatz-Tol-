import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stepsWithFlags } from '../../lib/collatz.js'
import { computeSpiralPath } from '../../lib/layout.js'
import useAnimation from '../../hooks/useAnimation.js'
import useStepSound from '../../hooks/useStepSound.js'
import { VIZ_W, VIZ_H } from './VizContainer.jsx'

export default function Spiral() {
  const canvasRef = useRef(null)
  const n = useCollatzStore((s) => s.n)
  const stepIndex = useCollatzStore((s) => s.stepIndex)

  useAnimation()
  useStepSound()

  const steps = useMemo(() => stepsWithFlags(n), [n])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = VIZ_W, H = VIZ_H

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    const maxV = Math.max(...steps.map((s) => s.value))
    const points = computeSpiralPath(steps.slice(0, stepIndex + 1), maxV, W, H - 24)

    if (points.length < 2) {
      ctx.fillStyle = '#9ca3af'
      ctx.font = '13px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Press play to begin', W / 2, H / 2)
      return
    }

    // Center crosshair
    ctx.strokeStyle = '#f3f4f6'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(W / 2, 10)
    ctx.lineTo(W / 2, H - 34)
    ctx.moveTo(10, (H - 24) / 2)
    ctx.lineTo(W - 10, (H - 24) / 2)
    ctx.stroke()

    // Spiral line
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (let i = 0; i < points.length - 1; i++) {
      const p = points[i]
      const q = points[i + 1]
      const alpha = 0.3 + (i / points.length) * 0.7
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(q.x, q.y)
      ctx.strokeStyle = p.operation === 'up' ? '#dc2626' : '#2563eb'
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // Start marker
    ctx.fillStyle = '#e5e7eb'
    ctx.beginPath()
    ctx.arc(points[0].x, points[0].y, 3, 0, Math.PI * 2)
    ctx.fill()

    // End marker
    const last = points[points.length - 1]
    ctx.fillStyle = '#059669'
    ctx.beginPath()
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2)
    ctx.fill()

    // Step labels at key points
    const labelEvery = Math.max(1, Math.floor(points.length / 8))
    ctx.fillStyle = '#9ca3af'
    ctx.font = '9px Inter, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let i = labelEvery; i < points.length - 1; i += labelEvery) {
      const p = points[i]
      ctx.fillText(i, p.x + 8, p.y - 8)
    }

    // Bottom bar
    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, H - 24, W, 24)
    ctx.fillStyle = '#6b7280'
    ctx.font = '11px Inter, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`n = ${n}  \u00b7  ${stepIndex} steps  \u00b7  max ${maxV.toLocaleString()}`, W / 2, H - 12)
  }, [steps, stepIndex, n])

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
