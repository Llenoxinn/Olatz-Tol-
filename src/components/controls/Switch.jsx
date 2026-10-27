// On/off switch; the whole labelled row is the hit target.
export default function Switch({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-dim">
      {children}
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="switch" />
    </label>
  )
}
