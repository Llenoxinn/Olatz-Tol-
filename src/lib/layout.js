export function computeTreeLayout(nodes, links, width, height) {
  const byDepth = new Map()
  for (const n of nodes) {
    if (!byDepth.has(n.depth)) byDepth.set(n.depth, [])
    byDepth.get(n.depth).push(n)
  }
  const maxDepth = Math.max(...byDepth.keys())
  const margin = 40
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

export function computeSpiralPath(steps, maxVal, canvasW, canvasH) {
  const cx = canvasW / 2
  const cy = canvasH / 2
  const scale = Math.min(canvasW, canvasH) / 2 / Math.log2(maxVal + 1)
  const points = []
  for (let i = 0; i < steps.length; i++) {
    const angle = i * 0.5
    const r = Math.log2(steps[i].value + 1) * scale * 0.8
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      ...steps[i],
    })
  }
  return points
}
