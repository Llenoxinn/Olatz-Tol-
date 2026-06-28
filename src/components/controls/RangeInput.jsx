import useCollatzStore from '../../store/useCollatzStore.js'

export default function RangeInput() {
  const maxN = useCollatzStore((s) => s.maxN)
  const setMaxN = useCollatzStore((s) => s.setMaxN)

  return (
    <div>
      <div className="section-title">Range</div>
      <input
        type="number"
        min={100}
        max={50000}
        step={100}
        value={maxN}
        onChange={(e) => setMaxN(Math.max(100, Math.min(50000, Number(e.target.value) || 100)))}
        className="input mb-2"
      />
      <input
        type="range"
        min={100}
        max={50000}
        step={100}
        value={maxN}
        onChange={(e) => setMaxN(Number(e.target.value))}
        className="w-full accent-emerald-600 h-1"
      />
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
        <span>100</span>
        <span>50,000</span>
      </div>
    </div>
  )
}
