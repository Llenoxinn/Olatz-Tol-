// Stopping times only: caching whole paths cost ~126 MB at n = 50,000.
const times = new Map([[1, 0]])

const next = (n) => (n % 2 === 0 ? n / 2 : 3 * n + 1)

export function sequence(n) {
  if (n < 1) return []
  const path = [n]
  while (n > 1) path.push((n = next(n)))
  return path
}

export function stoppingTime(n) {
  const path = []
  while (!times.has(n)) {
    path.push(n)
    n = next(n)
  }
  let t = times.get(n)
  for (let i = path.length - 1; i >= 0; i--) times.set(path[i], ++t)
  return t
}

// One walk down the path: its length, its peak, and how many steps of each kind.
export function stats(n) {
  let peak = n, peakStep = 0, odd = 0, even = 0
  for (let cur = n; cur > 1; ) {
    if (cur % 2 === 0) even++
    else odd++
    cur = next(cur)
    if (cur > peak) { peak = cur; peakStep = odd + even }
  }
  return { steps: odd + even, peak, peakStep, odd, even }
}

export function stoppingTimes(maxN) {
  const arr = new Uint16Array(maxN)
  for (let i = 1; i <= maxN; i++) arr[i - 1] = stoppingTime(i)
  return arr
}

// Every n in range, linked to its successor when that is in range too.
// 1 has no outgoing link, so the 1 → 4 → 2 → 1 loop doesn't show up as a tree edge.
export function treeData(maxN) {
  const nodes = []
  const links = []
  for (let n = 1; n <= maxN; n++) {
    nodes.push({ id: n, depth: stoppingTime(n) })
    const to = next(n)
    if (n > 1 && to <= maxN) links.push({ source: n, target: to })
  }
  return { nodes, links }
}

export function delayRecords(maxN) {
  const records = []
  let maxT = -1
  for (let n = 1; n <= maxN; n++) {
    const t = stoppingTime(n)
    if (t > maxT) { maxT = t; records.push(n) }
  }
  return records
}

export function convergencePoint(a, b) {
  const set = new Set(sequence(a))
  for (const v of sequence(b)) if (set.has(v)) return v
  return null
}
