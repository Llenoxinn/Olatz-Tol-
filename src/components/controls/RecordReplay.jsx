import { Bookmark, X } from 'lucide-react'
import useCollatzStore from '../../store/useCollatzStore.js'

export default function RecordReplay() {
  const n = useCollatzStore((s) => s.n)
  const savedNumbers = useCollatzStore((s) => s.savedNumbers)
  const saveCurrent = useCollatzStore((s) => s.saveCurrent)
  const removeSaved = useCollatzStore((s) => s.removeSaved)
  const setN = useCollatzStore((s) => s.setN)

  return (
    <div>
      <h2 className="section-title">Saved</h2>
      <button onClick={saveCurrent} className="btn btn-ghost mb-2 w-full border border-line">
        <Bookmark size={13} />
        Save {n.toLocaleString()}
      </button>
      {savedNumbers.length === 0 ? (
        <p className="text-xs text-faint">Nothing saved yet. Saved numbers stay after a reload.</p>
      ) : (
        <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
          {savedNumbers.map((v) => (
            <span key={v} className="chip flex items-center gap-1 pr-1">
              <button onClick={() => setN(v)} className={v === n ? 'text-neon' : 'hover:text-fg'}>
                {v.toLocaleString()}
              </button>
              <button onClick={() => removeSaved(v)} aria-label={`Remove ${v}`} className="text-faint hover:text-fg">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
