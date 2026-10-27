import { useCallback, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { sequence, stats } from '../../lib/collatz.js'
import { computeSpiralPath } from '../../lib/layout.js'
import { drawHead } from '../../lib/canvas.js'
import { COLORS } from '../../lib/constants.js'
import CanvasView, { Caption, Legend, CAPTION_H } from './CanvasView.jsx'

export default function Spiral({ w, h }) {
  const n = useCollatzStore((s) => s.n)
  const stepIndex = useCollatzStore((s) => s.stepIndex)

  const seq = useMemo(() => sequence(n), [n])
  const { peak } = useMemo(() => stats(n), [n])
  const last = seq.length - 1
  const at = Math.min(stepIndex, last)

  const draw = useCallback((ctx, w, h) => {
    const ph = h - CAPTION_H
    const pts = computeSpiralPath(seq, peak, w, ph)

    ctx.strokeStyle = COLORS.grid
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(w / 2, 12)
    ctx.lineTo(w / 2, ph - 12)
    ctx.moveTo(12, ph / 2)
    ctx.lineTo(w - 12, ph / 2)
    ctx.stroke()

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 1.25
    ctx.strokeStyle = COLORS.ghost
    ctx.beginPath()
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
    ctx.stroke()

    // Older segments fade so the direction of travel reads at a glance.
    ctx.lineWidth = 1.75
    for (let i = 0; i < at; i++) {
      ctx.globalAlpha = 0.3 + (i / at) * 0.7
      ctx.strokeStyle = seq[i] % 2 ? COLORS.up : COLORS.down
      ctx.beginPath()
      ctx.moveTo(pts[i].x, pts[i].y)
      ctx.lineTo(pts[i + 1].x, pts[i + 1].y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    ctx.fillStyle = COLORS.faint
    ctx.beginPath()
    ctx.arc(pts[0].x, pts[0].y, 3, 0, Math.PI * 2)
    ctx.fill()
    drawHead(ctx, pts[at].x, pts[at].y)
  }, [seq, peak, at])

  return (
    <>
      <CanvasView w={w} h={h} draw={draw} label={`Spiral of ${n}'s path to 1`} />
      <Caption
        left={<>n = {n}<span className="text-faint">max {peak.toLocaleString()}</span></>}
        right={<><Legend /><span className="text-fg">{at === 0 ? 'press play' : `step ${at}/${last}`}</span></>}
      />
    </>
  )
}
