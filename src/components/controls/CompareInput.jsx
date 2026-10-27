import { useId } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'

export default function CompareInput() {
  const id = useId()
  const compareN = useCollatzStore((s) => s.compareN)
  const setCompareN = useCollatzStore((s) => s.setCompareN)

  return (
    <div>
      <label htmlFor={id} className="section-title block">Compare with</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={100000}
        placeholder="Second number"
        value={compareN ?? ''}
        onChange={(e) => setCompareN(e.target.value ? Number(e.target.value) : null)}
        className="input"
      />
    </div>
  )
}
