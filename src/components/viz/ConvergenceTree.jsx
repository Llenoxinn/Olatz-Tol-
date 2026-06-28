import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { treeData } from '../../lib/collatz.js'
import { computeTreeLayout } from '../../lib/layout.js'

const W = 700, H = 450

export default function ConvergenceTree() {
  const canvasRef = useRef(null)
  const maxN = useCollatzStore((s) => s.maxN)

  const { nodes, links } = useMemo(() => treeData(maxN), [maxN])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    const positions = computeTreeLayout(nodes, links, W, H)
    const maxDepth = Math.max(...nodes.map((n) => n.depth))

    ctx.lineWidth = 0.5
    ctx.lineCap = 'round'
    for (const link of links) {
      const src = positions.get(link.source)
      const tgt = positions.get(link.target)
      if (!src || !tgt) continue
      ctx.beginPath()
      ctx.moveTo(src.x, src.y)
      ctx.lineTo(tgt.x, tgt.y)
      ctx.strokeStyle = '#d1d5db'
      ctx.stroke()
    }

    for (const node of nodes) {
      const pos = positions.get(node.id)
      if (!pos) continue
      const t = node.depth / maxDepth
      const r = Math.max(1.5, 4 - t * 2.5)
      const g = Math.round(150 + t * 60)
      const b = Math.round(80 + t * 80)
      ctx.fillStyle = `rgb(${g - 60},${g},${b})`
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const root = positions.get(1)
    if (root) {
      ctx.fillStyle = '#059669'
      ctx.beginPath()
      ctx.arc(root.x, root.y, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = '7px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('1', root.x, root.y)
    }

    ctx.fillStyle = '#9ca3af'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(`${nodes.length} nodes`, 10, H - 8)
    ctx.textAlign = 'right'
    ctx.fillText(`${links.length} edges`, W - 10, H - 8)
  }, [nodes, links])

  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full h-auto"
      />
    </div>
  )
}
