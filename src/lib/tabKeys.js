const STEP = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

// Arrow keys, Home and End move between tabs and select them (WAI-ARIA tabs pattern).
// Tabs are found by their `data-value` among the focused tab's siblings.
export function onTabKey(e, ids, current, select) {
  const i = ids.indexOf(current)
  const next =
    e.key === 'Home' ? 0
    : e.key === 'End' ? ids.length - 1
    : e.key in STEP ? (i + STEP[e.key] + ids.length) % ids.length
    : -1
  if (next < 0) return
  e.preventDefault()
  select(ids[next])
  e.currentTarget.parentElement.querySelector(`[data-value="${ids[next]}"]`)?.focus()
}
