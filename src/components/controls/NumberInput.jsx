import useCollatzStore from '../../store/useCollatzStore.js'

export default function NumberInput() {
  const n = useCollatzStore((s) => s.n)
  const setN = useCollatzStore((s) => s.setN)

  return (
    <div>
      <div className="section-title">Starting Number</div>
      <input
        type="number"
        min={1}
        max={100000}
        value={n}
        onChange={(e) => setN(Number(e.target.value) || 1)}
        className="input mb-2"
      />
      <input
        type="range"
        min={1}
        max={10000}
        value={n}
        onChange={(e) => setN(Number(e.target.value))}
        className="w-full accent-emerald-600 h-1"
      />
    </div>
  )
}
