import { useCallback, useMemo } from 'react'
import useCollatzStore, { lastStep } from '../../store/useCollatzStore.js'
import { sequence, convergencePoint } from '../../lib/collatz.js'
import { logAxes, polyline, drawHead } from '../../lib/canvas.js'
import { COLORS, FONT } from '../../lib/constants.js'
import CanvasView, { Caption, Key, CAPTION_H } from './CanvasView.jsx'

const PAD = { top: 28, right: 28, bottom: 40 + CAPTION_H }

export default function MultiOverlay({ w, h }) {
  const n = useCollatzStore((s) => s.n)
  const compareN = useCollatzStore((s) => s.compareN)
  const stepIndex = useCollatzStore((s) => s.stepIndex)
  const last = useCollatzStore(lastStep)

  const seqA = useMemo(() => sequence(n), [n])
  const seqB = useMemo(() => (compareN ? sequence(compareN) : null), [compareN])
  const merge = useMemo(() => (compareN ? convergencePoint(n, compareN) : null), [n, compareN])

  // Both paths share one step axis, so the merge shows up as a horizontal offset.
  const draw = useCallback((ctx, w, h) => {
    const paths = seqB ? [[seqA, COLORS.up], [seqB, COLORS.down]] : [[seqA, COLORS.up]]
    let peak = 1
    for (const [seq] of paths) for (const v of seq) if (v > peak) peak = v
    const { x, y } = logAxes(ctx, w, h, { peak, last, pad: PAD })

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const [seq, color] of paths) {
      const end = seq.length - 1
      ctx.lineWidth = 1.25
      ctx.strokeStyle = COLORS.ghost
      ctx.stroke(polyline(seq, x, y, 0, end))
      const at = Math.min(stepIndex, end)
      if (at > 0) {
        ctx.lineWidth = 2
        ctx.strokeStyle = color
        ctx.stroke(polyline(seq, x, y, 0, at))
      }
    }

    if (merge !== null) {
      const ia = seqA.indexOf(merge)
      const ib = seqB.indexOf(merge)
      const my = y(merge)
      ctx.setLineDash([3, 4])
      ctx.strokeStyle = COLORS.dim
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x(ia), my)
      ctx.lineTo(x(ib), my)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.lineWidth = 1.5
      for (const i of [ia, ib]) {
        ctx.strokeStyle = stepIndex >= i ? COLORS.neon : COLORS.faint
        ctx.beginPath()
        ctx.arc(x(i), my, 6, 0, Math.PI * 2)
        ctx.stroke()
      }
      // Backed label so it stays legible over the lines.
      const label = `merge ${merge.toLocaleString()}`
      const lx = (x(ia) + x(ib)) / 2
      ctx.font = `11px ${FONT}`
      const lw = ctx.measureText(label).width + 10
      ctx.fillStyle = COLORS.ink
      ctx.fillRect(lx - lw / 2, my - 26, lw, 15)
      ctx.fillStyle = COLORS.fg
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText(label, lx, my - 13)
    }

    for (const [seq] of paths) {
      const at = Math.min(stepIndex, seq.length - 1)
      drawHead(ctx, x(at), y(seq[at]))
    }
  }, [seqA, seqB, merge, stepIndex, last])

  return (
    <>
      <CanvasView w={w} h={h} draw={draw} label={compareN ? `Paths of ${n} and ${compareN}` : `Path of ${n}`} />
      <Caption
        left={
          <>
            <Key swatch="bg-neon">n&#8321; = {n}</Key>
            {compareN ? <Key swatch="bg-fg">n&#8322; = {compareN}</Key> : <span className="text-faint">add a second number under Compare</span>}
          </>
        }
        right={
          <>
            {merge !== null && <span className="text-faint">merge {merge.toLocaleString()}</span>}
            <span className="text-fg">{stepIndex === 0 ? 'press play' : `step ${stepIndex}/${last}`}</span>
          </>
        }
      />
    </>
  )
}
