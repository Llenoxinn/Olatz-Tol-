import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sequence, stoppingTime, stoppingTimes, stats, treeData, delayRecords, convergencePoint } from './collatz.js'

test('known sequences', () => {
  assert.deepEqual(sequence(6), [6, 3, 10, 5, 16, 8, 4, 2, 1])
  assert.equal(stoppingTime(1), 0)
  assert.equal(stoppingTime(27), 111)
})

test('cached stopping times match sequence lengths', () => {
  const times = stoppingTimes(5000)
  for (let n = 1; n <= 5000; n++) assert.equal(times[n - 1], sequence(n).length - 1)
})

test('stats for 27', () => {
  assert.deepEqual(stats(27), { steps: 111, peak: 9232, peakStep: 77, odd: 41, even: 70 })
  assert.deepEqual(stats(1), { steps: 0, peak: 1, peakStep: 0, odd: 0, even: 0 })
})

test('tree has no edge out of 1', () => {
  const { nodes, links } = treeData(100)
  assert.equal(nodes.length, 100)
  assert.ok(links.every((l) => l.source !== 1))
})

test('delay records match OEIS A006877', () => {
  assert.deepEqual(delayRecords(100), [1, 2, 3, 6, 7, 9, 18, 25, 27, 54, 73, 97])
})

test('convergence point', () => {
  // 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10, which is on 6's path
  assert.equal(convergencePoint(6, 7), 10)
  assert.equal(convergencePoint(8, 8), 8)
})
