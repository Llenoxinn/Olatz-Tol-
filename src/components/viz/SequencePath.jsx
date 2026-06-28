import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stepsWithFlags } from '../../lib/collatz.js'
import useAnimation from '../../hooks/useAnimation.js'
import useStepSound from '../../hooks/useStepSound.js'

export default function SequencePath() {
  const canvasRef = useRef(null)
  const n = useCollatzStore((s) => s.n)
  const stepIndex = useCollatzStore((s) => s.stepIndex)

  useAnimation()
  useStepSound()

  const steps = useMemo(() => stepsWithFlags(n), [n])
  const w = 700, h = 420, pad = 50

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const disp = steps.slice(0, stepIndex + 1)

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    if (disp.length < 2) {
      ctx.fillStyle = '#9ca3af'
      ctx.font = '13px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Press play to begin', w / 2, h / 2)
      return
    }

    const values = disp.map((s) => s.value)
    const maxV = Math.max(...values)

    const plotW = w - 2 * pad
    const plotH = h - 2 * pad

    ctx.strokeStyle = '#f3f4f6'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = pad + (i / 4) * plotH
      ctx.beginPath()
      ctx.moveTo(pad, y)
      ctx.lineTo(w - pad, y)
      ctx.stroke()

      const t = 1 - i / 4
      const val = Math.round(Math.pow(2, Math.log2(maxV) * t))
      ctx.fillStyle = '#9ca3af'
      ctx.font = '10px Inter, monospace'
      ctx.textAlign = 'right'
      ctx.fillText(val || 1, pad - 8, y + 3)
    }

    const xScale = (i) => pad + (i / Math.max(disp.length - 1, 1)) * plotW
    const yScale = (v) => {
      if (maxV <= 1) return pad + plotH / 2
      return pad + plotH - (Math.log2(v) / Math.log2(maxV)) * plotH
    }

    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (let i = 0; i < disp.length - 1; i++) {
      const s = disp[i]
      const x1 = xScale(i), x2 = xScale(i + 1)
      const y1 = yScale(s.value), y2 = yScale(disp[i + 1].value)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = s.operation === 'up' ? '#dc2626' : '#2563eb'
      ctx.stroke()
    }

    const last = disp[disp.length - 1]
    const lx = xScale(disp.length - 1), ly = yScale(last.value)
    ctx.fillStyle = '#059669'
    ctx.beginPath()
    ctx.arc(lx, ly, 3.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#6b7280'
    ctx.font = '11px Inter, monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`n = ${n}`, pad, h - 8)
    ctx.textAlign = 'right'
    ctx.fillText(`step ${stepIndex}`, w - pad, h - 8)
  }, [steps, stepIndex, n])

  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      <canvas
        ref={canvasRef}
        width={w}
        height={h}
        className="block w-full h-auto"
      />
    </div>
  )
}
