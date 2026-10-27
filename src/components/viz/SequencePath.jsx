import { useCallback, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { sequence, stats } from '../../lib/collatz.js'
import { logAxes, polyline, drawHead } from '../../lib/canvas.js'
import { COLORS, FONT } from '../../lib/constants.js'
import CanvasView, { Caption, Legend, CAPTION_H } from './CanvasView.jsx'

// Bottom room covers the tick labels plus the caption bar.
const PAD = { top: 28, right: 28, bottom: 40 + CAPTION_H }

export default function SequencePath({ w, h }) {
  const n = useCollatzStore((s) => s.n)
  const stepIndex = useCollatzStore((s) => s.stepIndex)

  const seq = useMemo(() => sequence(n), [n])
  const { peak, peakStep } = useMemo(() => stats(n), [n])
  const last = seq.length - 1
  const at = Math.min(stepIndex, last)

  // Axes are fixed to the whole path so the line grows into a still frame.
  const draw = useCallback((ctx, w, h) => {
    const { x, y, base } = logAxes(ctx, w, h, { peak, last, pad: PAD })
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 1.25
    ctx.strokeStyle = COLORS.ghost
    ctx.stroke(polyline(seq, x, y, 0, last))

    if (at > 0) {
      const area = polyline(seq, x, y, 0, at)
      area.lineTo(x(at), base)
      area.lineTo(x(0), base)
      area.closePath()
      const fill = ctx.createLinearGradient(0, PAD.top, 0, base)
      fill.addColorStop(0, `rgba(${COLORS.neonRgb}, 0.16)`)
      fill.addColorStop(1, `rgba(${COLORS.neonRgb}, 0)`)
      ctx.fillStyle = fill
      ctx.fill(area)

      // Odd values climb (3n + 1), even values halve.
      const up = new Path2D()
      const down = new Path2D()
      for (let i = 0; i < at; i++) {
        const p = seq[i] % 2 ? up : down
        p.moveTo(x(i), y(seq[i]))
        p.lineTo(x(i + 1), y(seq[i + 1]))
      }
      ctx.strokeStyle = COLORS.glow
      ctx.lineWidth = 6
      ctx.stroke(up)
      ctx.lineWidth = 2
      ctx.strokeStyle = COLORS.up
      ctx.stroke(up)
      ctx.strokeStyle = COLORS.down
      ctx.stroke(down)
    }

    if (peakStep > 0 && at >= peakStep) {
      const px = x(peakStep)
      const py = y(peak)
      ctx.fillStyle = COLORS.neon
      ctx.font = `11px ${FONT}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText(peak.toLocaleString(), px, py - 10)
    }

    drawHead(ctx, x(at), y(seq[at]))
  }, [seq, peak, peakStep, last, at])

  return (
    <>
      <CanvasView w={w} h={h} draw={draw} label={`Collatz path of ${n}: ${last} steps, peak ${peak}`} />
      <Caption
        left={<>n = {n}<span className="text-faint">peak {peak.toLocaleString()}</span></>}
        right={<><Legend /><span className="text-fg">{at === 0 ? 'press play' : `step ${at}/${last}`}</span></>}
      />
    </>
  )
}
