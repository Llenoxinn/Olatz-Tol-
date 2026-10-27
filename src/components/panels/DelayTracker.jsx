import { useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { delayRecords } from '../../lib/collatz.js'

export default function DelayTracker() {
  const n = useCollatzStore((s) => s.n)
  const maxN = useCollatzStore((s) => s.maxN)
  const setN = useCollatzStore((s) => s.setN)

  const records = useMemo(() => delayRecords(maxN), [maxN])
  const rank = records.indexOf(n)

  return (
    <div className="flex h-full flex-col">
      <h2 className="section-title">Delay records</h2>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl leading-none font-extrabold text-fg tabular-nums">{records.length}</span>
        <span className="text-xs text-dim">up to {maxN.toLocaleString()}</span>
      </div>
      <p className="mt-2 text-xs leading-snug text-dim">
        {rank >= 0
          ? <span className="text-neon">{n.toLocaleString()} is record #{rank + 1}</span>
          : 'Numbers that take longer than every smaller one.'}
      </p>
      <div className="mt-auto flex max-h-[52px] flex-wrap gap-1.5 overflow-hidden">
        {records.slice(-8).reverse().map((r) => (
          <button
            key={r}
            onClick={() => setN(r)}
            aria-pressed={r === n}
            className={`chip ${r === n ? 'border-neon/60 text-neon' : ''}`}
          >
            {r.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  )
}
