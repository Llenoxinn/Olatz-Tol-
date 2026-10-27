import { useCallback, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { sequence, treeData } from '../../lib/collatz.js'
import { computeTreeLayout } from '../../lib/layout.js'
import { COLORS } from '../../lib/constants.js'
import CanvasView, { Caption, Key, CAPTION_H } from './CanvasView.jsx'

// Depth bands batch thousands of edges and dots into a handful of draw calls.
const BANDS = 8

export default function ConvergenceTree({ w, h }) {
  const maxN = useCollatzStore((s) => s.maxN)
  const n = useCollatzStore((s) => s.n)

  const { nodes, links } = useMemo(() => treeData(maxN), [maxN])
  const maxDepth = useMemo(() => nodes.reduce((m, nd) => Math.max(m, nd.depth), 1), [nodes])
  const seq = useMemo(() => sequence(n), [n])

  const draw = useCallback((ctx, w, h) => {
    const pos = computeTreeLayout(nodes, w, h - CAPTION_H)
    const band = (d) => Math.min(BANDS - 1, Math.floor((d / maxDepth) * BANDS))
    const edges = Array.from({ length: BANDS }, () => new Path2D())
    const dots = Array.from({ length: BANDS }, () => new Path2D())

    // nodes[i] is i + 1, so depth lookups are by index.
    for (const { source, target } of links) {
      const a = pos.get(source)
      const b = pos.get(target)
      const p = edges[band(nodes[source - 1].depth)]
      p.moveTo(a.x, a.y)
      p.lineTo(b.x, b.y)
    }
    for (const node of nodes) {
      const { x, y } = pos.get(node.id)
      const b = band(node.depth)
      const r = Math.max(1, 3.2 - b * 0.3)
      dots[b].moveTo(x + r, y)
      dots[b].arc(x, y, r, 0, Math.PI * 2)
    }

    ctx.lineWidth = 0.5
    for (let b = 0; b < BANDS; b++) {
      const t = b / (BANDS - 1)
      ctx.strokeStyle = `rgba(${COLORS.neonRgb}, ${0.22 - t * 0.16})`
      ctx.stroke(edges[b])
      ctx.fillStyle = `rgba(${COLORS.neonRgb}, ${0.95 - t * 0.65})`
      ctx.fill(dots[b])
    }

    // The current number's own route, where it stays inside the range.
    if (n <= maxN) {
      const trail = new Path2D()
      let pen = false
      for (const v of seq) {
        const p = pos.get(v)
        if (!p) { pen = false; continue }
        if (pen) trail.lineTo(p.x, p.y)
        else trail.moveTo(p.x, p.y)
        pen = true
      }
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = COLORS.glow
      ctx.lineWidth = 6
      ctx.stroke(trail)
      ctx.strokeStyle = COLORS.fg
      ctx.lineWidth = 1.5
      ctx.stroke(trail)
      const start = pos.get(n)
      ctx.beginPath()
      ctx.arc(start.x, start.y, 5, 0, Math.PI * 2)
      ctx.stroke()
    }

    const root = pos.get(1)
    ctx.strokeStyle = COLORS.fg
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(root.x, root.y, 7, 0, Math.PI * 2)
    ctx.stroke()
  }, [nodes, links, maxDepth, seq, n, maxN])

  return (
    <>
      <CanvasView w={w} h={h} draw={draw} label={`Convergence tree of 1 to ${maxN}`} />
      <Caption
        left={<>{nodes.length.toLocaleString()} nodes<span className="text-faint">depth 0&ndash;{maxDepth}</span></>}
        right={n <= maxN ? <Key swatch="bg-fg">route of {n}</Key> : <span className="text-faint">{n} is outside the range</span>}
      />
    </>
  )
}
