import { TrendingUp, Grid3X3, GitBranch, Layers, Compass } from 'lucide-react'
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
    <div className="sm:col-span-2">
      <h2 className="section-title">Mode</h2>
      <div className="flex flex-wrap gap-1 md:flex-col md:gap-0.5">
        {MODES.map((m) => {
          const Icon = ICONS[m.id]
          const active = mode === m.id
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors duration-150 ${
                active ? 'bg-neon/10 font-medium text-neon' : 'text-dim hover:bg-raised hover:text-fg'
              }`}
            >
              <Icon size={14} strokeWidth={active ? 2 : 1.5} />
              {m.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
