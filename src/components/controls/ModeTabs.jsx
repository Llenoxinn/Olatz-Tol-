import { useLayoutEffect, useRef } from 'react'
import { TrendingUp, Grid3X3, GitBranch, Layers, Compass } from 'lucide-react'
import { MODES } from '../../lib/constants.js'
import { onTabKey } from '../../lib/tabKeys.js'
import useCollatzStore from '../../store/useCollatzStore.js'

const ICONS = {
  path: TrendingUp,
  heatmap: Grid3X3,
  tree: GitBranch,
  multi: Layers,
  spiral: Compass,
}
const IDS = MODES.map((m) => m.id)

// A neon copy of the row sits on top, clipped down to the active tab, so the highlight
// slides between tabs and recolors the label in one motion instead of two crossfades.
export default function ModeTabs() {
  const mode = useCollatzStore((s) => s.mode)
  const setMode = useCollatzStore((s) => s.setMode)
  const listRef = useRef(null)
  const glowRef = useRef(null)

  useLayoutEffect(() => {
    const list = listRef.current
    const glow = glowRef.current
    const clip = () => {
      const tab = list.querySelector(`[data-value="${mode}"]`)
      const right = list.offsetWidth - tab.offsetLeft - tab.offsetWidth
      glow.style.clipPath = `inset(0 ${right}px 0 ${tab.offsetLeft}px round 10px 10px 0 0)`
    }
    clip()
    // Tab widths only change when the web font swaps in.
    const ro = new ResizeObserver(clip)
    ro.observe(list)
    // Turn the slide on after the first placement, so the page doesn't load mid-slide.
    const frame = requestAnimationFrame(() => { glow.dataset.ready = '' })
    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [mode])

  return (
    <div className="relative z-10 -mb-px overflow-x-auto px-5 [scrollbar-width:none]">
      <div ref={listRef} role="tablist" aria-label="Visualization" className="relative flex w-max">
        {MODES.map(({ id, label }) => {
          const Icon = ICONS[id]
          const active = id === mode
          return (
            <button
              key={id}
              id={`mode-tab-${id}`}
              data-value={id}
              role="tab"
              aria-selected={active}
              aria-controls="viz-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => setMode(id)}
              onKeyDown={(e) => onTabKey(e, IDS, mode, setMode)}
              className="tab"
            >
              <Icon size={14} />
              {label}
            </button>
          )
        })}
        <div ref={glowRef} aria-hidden="true" className="tab-glow">
          {MODES.map(({ id, label }) => {
            const Icon = ICONS[id]
            return (
              <span key={id} className="tab">
                <Icon size={14} strokeWidth={2.25} />
                {label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
