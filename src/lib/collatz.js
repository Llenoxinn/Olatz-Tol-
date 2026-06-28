const cache = new Map()

export function sequence(n) {
  if (n < 1) return []
  const original = n
  const path = [n]
  while (n > 1) {
    if (cache.has(n)) {
      const rest = cache.get(n)
      path.push(...rest.slice(1))
      break
    }
    n = n % 2 === 0 ? n / 2 : 3 * n + 1
    path.push(n)
  }
  for (let i = 0; i < path.length; i++) {
    const v = path[i]
    if (!cache.has(v)) cache.set(v, path.slice(i))
  }
  return path
}

export function stoppingTime(n) {
  return sequence(n).length - 1
}

export function maxValue(n) {
  let m = n, cur = n
  while (cur > 1) {
    cur = cur % 2 === 0 ? cur / 2 : 3 * cur + 1
    if (cur > m) m = cur
  }
  return m
}

export function peak(n) {
  return maxValue(n)
}

export function oddEvenRatio(n) {
  let odd = 0, even = 0, cur = n
  while (cur > 1) {
    if (cur % 2 === 0) even++
    else odd++
    cur = cur % 2 === 0 ? cur / 2 : 3 * cur + 1
  }
  return { odd, even, ratio: even > 0 ? (odd / even).toFixed(4) : 'inf' }
}

export function stepsWithFlags(n) {
  const seq = sequence(n)
  const result = []
  for (let i = 0; i < seq.length - 1; i++) {
    result.push({ value: seq[i], operation: seq[i + 1] > seq[i] ? 'up' : 'down' })
  }
  result.push({ value: 1, operation: null })
  return result
}

export function stoppingTimes(maxN) {
  const arr = new Array(maxN)
  for (let i = 1; i <= maxN; i++) arr[i - 1] = stoppingTime(i)
  return arr
}

export function treeData(maxN) {
  const nodes = []
  const links = []
  const seen = new Set()
  for (let n = 1; n <= maxN; n++) {
    seen.add(n)
    const next = n % 2 === 0 ? n / 2 : 3 * n + 1
    if (next <= maxN) links.push({ source: n, target: next })
  }
  for (const id of seen) nodes.push({ id, depth: stoppingTime(id) })
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

export function clearCache() {
  cache.clear()
}
