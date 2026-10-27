import { useId, useState } from 'react'

// Number box plus slider for one store value. `draft` lets the box sit empty mid-edit
// instead of snapping to the minimum.
export default function NumberField({ label, value, onChange, min, max, step = 1, sliderMax = max }) {
  const id = useId()
  const [draft, setDraft] = useState(null)

  return (
    <div>
      <label htmlFor={id} className="section-title block">{label}</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        value={draft ?? value}
        onChange={(e) => {
          setDraft(e.target.value)
          if (e.target.value) onChange(Number(e.target.value))
        }}
        onBlur={() => setDraft(null)}
        className="input mb-2.5"
      />
      <input
        type="range"
        min={min}
        max={sliderMax}
        step={step}
        aria-label={`${label} slider`}
        value={Math.min(value, sliderMax)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range"
      />
      <div className="mt-1 flex justify-between text-xs text-faint tabular-nums">
        <span>{min.toLocaleString()}</span>
        <span>{sliderMax.toLocaleString()}</span>
      </div>
    </div>
  )
}
