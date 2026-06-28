import {
  TrendingUp,
  Grid3X3,
  GitBranch,
  Layers,
  Compass,
} from 'lucide-react'
import { MODES } from '../../lib/constants.js'
import useCollatzStore from '../../store/useCollatzStore.js'

const ICONS = {
  path: TrendingUp,
  heatmap: Grid3X3,
  tree: GitBranch,
  multi: Layers,
  spiral: Compass,
}

export default function ModeSelector() {
  const mode = useCollatzStore((s) => s.mode)
  const setMode = useCollatzStore((s) => s.setMode)

  return (
    <div>
      <div className="section-title">Mode</div>
      <div className="flex flex-col gap-0.5">
        {MODES.map((m) => {
          const Icon = ICONS[m.id]
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 text-sm rounded transition-colors ${
                mode === m.id
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={14} strokeWidth={mode === m.id ? 2 : 1.5} />
              {m.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
