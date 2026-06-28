import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stepsWithFlags } from '../../lib/collatz.js'
import { computeSpiralPath } from '../../lib/layout.js'
import useAnimation from '../../hooks/useAnimation.js'
import useStepSound from '../../hooks/useStepSound.js'

const W = 500, H = 500

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
    const maxV = Math.max(...steps.map((s) => s.value))

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    const points = computeSpiralPath(steps.slice(0, stepIndex + 1), maxV, W, H)
    if (points.length < 2) {
      ctx.fillStyle = '#9ca3af'
      ctx.font = '13px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Press play to begin', W / 2, H / 2)
      return
    }

    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    for (let i = 0; i < points.length - 1; i++) {
      const p = points[i]
      const q = points[i + 1]
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(q.x, q.y)
      ctx.strokeStyle = p.operation === 'up' ? 'rgba(220,38,38,0.7)' : 'rgba(37,99,235,0.7)'
      ctx.stroke()
    }

    const last = points[points.length - 1]
    ctx.fillStyle = '#059669'
    ctx.beginPath()
    ctx.arc(last.x, last.y, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#9ca3af'
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`n = ${n}`, W / 2, H - 10)
  }, [steps, stepIndex, n])

  return (
    <div className="border border-gray-200 rounded overflow-hidden inline-block">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block"
      />
    </div>
  )
}
