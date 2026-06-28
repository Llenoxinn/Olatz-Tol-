import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { treeData } from '../../lib/collatz.js'
import { computeTreeLayout } from '../../lib/layout.js'
import { VIZ_W, VIZ_H } from './vizSize.js'
import { setExportFn, clearExportFn } from './exportBus.js'

export default function ConvergenceTree() {
  const canvasRef = useRef(null)
  const maxN = useCollatzStore((s) => s.maxN)

  const { nodes, links } = useMemo(() => treeData(maxN), [maxN])

  useEffect(() => {
    setExportFn(() => {
      const src = canvasRef.current
      if (!src) return
      const tmp = document.createElement('canvas')
      tmp.width = src.width
      tmp.height = src.height
      const ctx = tmp.getContext('2d')
      ctx.drawImage(src, 0, 0)
      const imageData = ctx.getImageData(0, 0, tmp.width, tmp.height)
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 250 && d[i + 1] > 250 && d[i + 2] > 250) d[i + 3] = 0
      }
      ctx.putImageData(imageData, 0, 0)
      const link = document.createElement('a')
      link.download = 'olatz-tol-tree.png'
      link.href = tmp.toDataURL('image/png')
      link.click()
    })
    return () => clearExportFn()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return
    const ctx = canvas.getContext('2d')
    const W = VIZ_W, H = VIZ_H

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    const positions = computeTreeLayout(nodes, links, W, H - 24)
    const maxDepth = Math.max(...nodes.map((n) => n.depth))

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

    for (const node of nodes) {
      const pos = positions.get(node.id)
      if (!pos) continue
      const t = node.depth / maxDepth
      const r = Math.round(16 + t * 100)
      const g = Math.round(185 - t * 80)
      const b = Math.round(129 - t * 60)
      const radius = Math.max(1, 4.5 - t * 3)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    const root = positions.get(1)
    if (root) {
      ctx.strokeStyle = '#059669'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(root.x, root.y, 7, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = '#059669'
      ctx.beginPath()
      ctx.arc(root.x, root.y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 7px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('1', root.x, root.y)
    }

    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, H - 24, W, 24)
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${nodes.length} nodes  \u00b7  ${links.length} edges  \u00b7  depth 0\u2013${maxDepth}`, 12, H - 12)
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
