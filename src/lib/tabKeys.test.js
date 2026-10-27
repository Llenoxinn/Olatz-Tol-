import { test } from 'node:test'
import assert from 'node:assert/strict'
import { onTabKey } from './tabKeys.js'

const press = (key, current) => {
  let picked = null
  const e = {
    key,
    preventDefault() {},
    currentTarget: { parentElement: { querySelector: () => ({ focus() {} }) } },
  }
  onTabKey(e, ['a', 'b', 'c'], current, (v) => { picked = v })
  return picked
}

test('arrows wrap, Home and End jump, other keys do nothing', () => {
  assert.equal(press('ArrowRight', 'c'), 'a')
  assert.equal(press('ArrowLeft', 'a'), 'c')
  assert.equal(press('ArrowDown', 'a'), 'b')
  assert.equal(press('End', 'a'), 'c')
  assert.equal(press('Home', 'c'), 'a')
  assert.equal(press('Enter', 'b'), null)
})
