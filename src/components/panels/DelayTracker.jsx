import { useMemo } from 'react'
import { AlertCircle } from 'lucide-react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { delayRecords } from '../../lib/collatz.js'

export default function DelayTracker() {
  const n = useCollatzStore((s) => s.n)
  const maxN = useCollatzStore((s) => s.maxN)

  const records = useMemo(() => delayRecords(maxN), [maxN])
  const isRecord = records.includes(n)
  const rank = records.indexOf(n)

  return (
    <div>
      <div className="section-title">Delay Records</div>
      {isRecord && (
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-1.5 rounded mb-1.5">
          <AlertCircle size={13} />
          Record #{rank + 1}
        </div>
      )}
      <p className="text-xs text-gray-500">
        {records.length} delay records up to {maxN.toLocaleString()}
      </p>
      {records.length > 0 && (
        <p className="text-xs text-gray-400 font-mono mt-0.5">
          Largest: {records[records.length - 1]}
        </p>
      )}
    </div>
  )
}
