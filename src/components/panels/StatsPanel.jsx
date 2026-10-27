import { useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stats } from '../../lib/collatz.js'

export default function StatsPanel() {
  const n = useCollatzStore((s) => s.n)
  const s = useMemo(() => stats(n), [n])

  return (
    <div className="flex h-full flex-col">
      <h2 className="section-title">Statistics &middot; n = {n.toLocaleString()}</h2>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl leading-none font-extrabold text-neon tabular-nums">{s.steps}</span>
        <span className="text-xs text-dim">steps to reach 1</span>
      </div>
      <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2.5">
        <Stat label="Peak" value={s.peak.toLocaleString()} />
        <Stat label="Peak at step" value={s.peakStep} />
        <Stat label="3n+1 steps" value={s.odd} />
        <Stat label="n/2 steps" value={s.even} />
      </dl>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-faint">{label}</dt>
      <dd className="truncate text-sm font-medium text-fg tabular-nums">{value}</dd>
    </div>
  )
}
