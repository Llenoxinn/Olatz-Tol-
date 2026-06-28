import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { treeData } from '../../lib/collatz.js'
import { computeTreeLayout } from '../../lib/layout.js'
import { VIZ_W, VIZ_H } from './VizContainer.jsx'

const PAD = 40

export default function ConvergenceTree() {
  const canvasRef = useRef(null)
  const maxN = useCollatzStore((s) => s.maxN)

  const { nodes, links } = useMemo(() => treeData(maxN), [maxN])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return
    const ctx = canvas.getContext('2d')
    const W = VIZ_W, H = VIZ_H

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    const positions = computeTreeLayout(nodes, links, W, H - 24)
    const maxDepth = Math.max(...nodes.map((n) => n.depth))

    // Draw edges first
    ctx.lineWidth = 0.4
    ctx.lineCap = 'round'
    for (const link of links) {
      const src = positions.get(link.source)
      const tgt = positions.get(link.target)
      if (!src || !tgt) continue
      const depth = nodes.find((n) => n.id === link.source)?.depth || 0
      const t = depth / maxDepth
      ctx.beginPath()
      ctx.moveTo(src.x, src.y)
      ctx.lineTo(tgt.x, tgt.y)
      ctx.strokeStyle = `rgba(5,150,105,${0.08 + t * 0.15})`
      ctx.stroke()
    }

    // Draw nodes
    for (const node of nodes) {
      const pos = positions.get(node.id)
      if (!pos) continue
      const t = node.depth / maxDepth

      // Color: deep nodes are lighter green, shallow are darker
      const r = Math.round(16 + t * 100)
      const g = Math.round(185 - t * 80)
      const b = Math.round(129 - t * 60)

      const radius = Math.max(1, 4.5 - t * 3)

      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Highlight root (1)
    const root = positions.get(1)
    if (root) {
      // Outer ring
      ctx.strokeStyle = '#059669'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(root.x, root.y, 7, 0, Math.PI * 2)
      ctx.stroke()
      // Inner dot
      ctx.fillStyle = '#059669'
      ctx.beginPath()
      ctx.arc(root.x, root.y, 4, 0, Math.PI * 2)
      ctx.fill()
      // Label
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 7px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('1', root.x, root.y)
    }

    // Bottom bar
    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, H - 24, W, 24)
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${nodes.length} nodes  \u00b7  ${links.length} edges  \u00b7  depth 0\u2013${maxDepth}`, 12, H - 12)

    // Depth legend (right side of bottom bar)
    ctx.textAlign = 'right'
    ctx.fillText('shallow', W - 120, H - 12)
    // Gradient bar
    for (let i = 0; i < 60; i++) {
      const t = i / 60
      const r = Math.round(16 + t * 100)
      const g = Math.round(185 - t * 80)
      const b = Math.round(129 - t * 60)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(W - 100 + i, H - 16, 1, 8)
    }
    ctx.fillStyle = '#6b7280'
    ctx.fillText('deep', W - 12, H - 12)
  }, [nodes, links])

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
