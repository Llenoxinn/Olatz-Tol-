import { Bookmark, X } from 'lucide-react'
import useCollatzStore from '../../store/useCollatzStore.js'

export default function RecordReplay() {
  const savedNumbers = useCollatzStore((s) => s.savedNumbers)
  const saveCurrent = useCollatzStore((s) => s.saveCurrent)
  const removeSaved = useCollatzStore((s) => s.removeSaved)
  const loadSaved = useCollatzStore((s) => s.loadSaved)

  return (
    <div>
      <div className="section-title">Saved</div>
      <button onClick={saveCurrent} className="btn btn-primary w-full mb-2">
        <Bookmark size={13} />
        Save current
      </button>
      {savedNumbers.length === 0 && (
        <p className="text-xs text-gray-400">No saved sequences.</p>
      )}
      <div className="flex flex-col gap-0.5 max-h-28 overflow-y-auto">
        {savedNumbers.map((v) => (
          <div key={v} className="flex items-center gap-1 text-xs">
            <button
              onClick={() => loadSaved(v)}
              className="flex-1 text-left px-2 py-1 rounded hover:bg-gray-100 text-gray-700 font-mono transition-colors"
            >
              {v}
            </button>
            <button
              onClick={() => removeSaved(v)}
              className="px-1 py-1 rounded text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
