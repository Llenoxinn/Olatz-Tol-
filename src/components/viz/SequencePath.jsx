import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stepsWithFlags, stoppingTime, maxValue, peak } from '../../lib/collatz.js'
import useAnimation from '../../hooks/useAnimation.js'
import useStepSound from '../../hooks/useStepSound.js'
import { VIZ_W, VIZ_H } from './VizContainer.jsx'

const PAD = 55

export default function SequencePath() {
  const canvasRef = useRef(null)
  const n = useCollatzStore((s) => s.n)
  const stepIndex = useCollatzStore((s) => s.stepIndex)

  useAnimation()
  useStepSound()

  const steps = useMemo(() => stepsWithFlags(n), [n])
  const meta = useMemo(() => ({
    st: stoppingTime(n),
    mv: maxValue(n),
    pk: peak(n),
  }), [n])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = VIZ_W, H = VIZ_H
    const disp = steps.slice(0, stepIndex + 1)

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    if (disp.length < 2) {
      ctx.fillStyle = '#9ca3af'
      ctx.font = '13px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Press play to begin', W / 2, H / 2)
      return
    }

    const values = disp.map((s) => s.value)
    const maxV = Math.max(...values)
    const minV = 1
    const plotW = W - PAD * 2
    const plotH = H - PAD * 2

    // Grid
    ctx.strokeStyle = '#f3f4f6'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = PAD + (i / 5) * plotH
      ctx.beginPath()
      ctx.moveTo(PAD, y)
      ctx.lineTo(W - PAD, y)
      ctx.stroke()
    }

    // Y-axis labels (log scale)
    const logMax = Math.log2(maxV || 1)
    ctx.fillStyle = '#9ca3af'
    ctx.font = '10px Inter, monospace'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (let i = 0; i <= 5; i++) {
      const t = 1 - i / 5
      const val = Math.round(Math.pow(2, logMax * t))
      const y = PAD + (i / 5) * plotH
      ctx.fillText(val > 0 ? val.toLocaleString() : '1', PAD - 8, y)
    }

    // X-axis labels
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    const stepCount = disp.length - 1
    const xTicks = Math.min(5, stepCount)
    for (let i = 0; i <= xTicks; i++) {
      const step = Math.round((i / xTicks) * stepCount)
      const x = PAD + (step / Math.max(stepCount, 1)) * plotW
      ctx.fillText(step, x, H - PAD + 8)
    }

    // Axis labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('step', W / 2, H - 12)

    ctx.save()
    ctx.translate(12, H / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textBaseline = 'middle'
    ctx.fillText('value (log\u2082)', 0, 0)
    ctx.restore()

    // Scale functions
    const xScale = (i) => PAD + (i / Math.max(stepCount, 1)) * plotW
    const yScale = (v) => {
      const logV = Math.log2(Math.max(v, 1))
      return PAD + plotH - (logMax > 0 ? (logV / logMax) * plotH : plotH / 2)
    }

    // Area fill under the line
    ctx.beginPath()
    ctx.moveTo(xScale(0), yScale(disp[0].value))
    for (let i = 1; i < disp.length; i++) {
      ctx.lineTo(xScale(i), yScale(disp[i].value))
    }
    ctx.lineTo(xScale(disp.length - 1), PAD + plotH)
    ctx.lineTo(xScale(0), PAD + plotH)
    ctx.closePath()
    const grad = ctx.createLinearGradient(0, PAD, 0, PAD + plotH)
    grad.addColorStop(0, 'rgba(16,185,129,0.08)')
    grad.addColorStop(1, 'rgba(16,185,129,0.01)')
    ctx.fillStyle = grad
    ctx.fill()

    // Line segments with per-segment coloring
    ctx.lineWidth = 2
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

    // Data points (every nth to reduce clutter, plus first and last)
    const step = Math.max(1, Math.floor(disp.length / 20))
    ctx.lineWidth = 1
    for (let i = 0; i < disp.length; i += step) {
      const x = xScale(i), y = yScale(disp[i].value)
      ctx.fillStyle = disp[i].operation === 'up' ? '#dc2626' : '#2563eb'
      ctx.beginPath()
      ctx.arc(x, y, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
    // Last point
    const lx = xScale(disp.length - 1), ly = yScale(disp[disp.length - 1].value)
    ctx.fillStyle = '#059669'
    ctx.beginPath()
    ctx.arc(lx, ly, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(lx, ly, 1.5, 0, Math.PI * 2)
    ctx.fill()

    // Bottom info bar
    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, H - 28, W, 28)
    ctx.fillStyle = '#6b7280'
    ctx.font = '11px Inter, monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(`n = ${n}`, 12, H - 14)
    ctx.fillText(`\u2191 ${meta.mv.toLocaleString()}`, 100, H - 14)
    ctx.textAlign = 'right'
    ctx.fillText(`step ${stepIndex}/${steps.length - 1}`, W - 12, H - 14)
  }, [steps, stepIndex, n, meta])

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
