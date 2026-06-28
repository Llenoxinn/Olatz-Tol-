import { useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stoppingTime, maxValue, oddEvenRatio } from '../../lib/collatz.js'

export default function StatsPanel() {
  const n = useCollatzStore((s) => s.n)

  const stats = useMemo(() => ({
    stoppingTime: stoppingTime(n),
    maxValue: maxValue(n),
    ratio: oddEvenRatio(n),
  }), [n])

  return (
    <div>
      <div className="section-title">Statistics</div>
      <dl className="text-xs">
        <Row label="Stopping time" value={stats.stoppingTime} />
        <Row label="Max value" value={stats.maxValue.toLocaleString()} />
        <Row label="Odd steps" value={stats.ratio.odd} />
        <Row label="Even steps" value={stats.ratio.even} />
        <Row label="Odd/Even" value={stats.ratio.ratio} />
      </dl>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-baseline py-1 border-b border-gray-100 last:border-0">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-mono font-medium text-gray-900 ml-4">{value}</dd>
    </div>
  )
}
