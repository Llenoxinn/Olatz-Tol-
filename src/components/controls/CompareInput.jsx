import { ArrowLeftRight } from 'lucide-react'
import { useState } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'

export default function CompareInput() {
  const compareN = useCollatzStore((s) => s.compareN)
  const setCompareN = useCollatzStore((s) => s.setCompareN)
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="section-title w-full text-left flex items-center gap-1.5 cursor-pointer hover:text-gray-600 transition-colors"
      >
        <ArrowLeftRight size={12} />
        <span>Compare</span>
      </button>
      {open && (
        <input
          type="number"
          min={1}
          max={100000}
          placeholder="Second number"
          value={compareN || ''}
          onChange={(e) => setCompareN(e.target.value ? Number(e.target.value) : null)}
          className="input"
        />
      )}
    </div>
  )
}
