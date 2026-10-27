// Rows by stopping time (1 at the bottom), numbers spread left to right within a row.
export function computeTreeLayout(nodes, width, height) {
  const byDepth = new Map()
  for (const n of nodes) {
    if (!byDepth.has(n.depth)) byDepth.set(n.depth, [])
    byDepth.get(n.depth).push(n)
  }
  const maxDepth = Math.max(...byDepth.keys(), 1)
  const margin = 28
  const positions = new Map()

  for (const [depth, group] of byDepth) {
    const y = margin + (1 - depth / maxDepth) * (height - 2 * margin)
    const count = group.length
    group.sort((a, b) => a.id - b.id)
    for (let i = 0; i < count; i++) {
      const x = count === 1
        ? width / 2
        : margin + (i / (count - 1)) * (width - 2 * margin)
      positions.set(group[i].id, { x, y })
    }
  }

  return positions
}

// Angle advances half a radian per step; radius is log₂ of the value.
export function computeSpiralPath(values, maxVal, canvasW, canvasH) {
  const cx = canvasW / 2
  const cy = canvasH / 2
  const scale = Math.min(canvasW, canvasH) / 2 / Math.log2(maxVal + 1)
  return values.map((v, i) => {
    const r = Math.log2(v + 1) * scale * 0.8
    return { x: cx + r * Math.cos(i * 0.5), y: cy + r * Math.sin(i * 0.5) }
  })
}
