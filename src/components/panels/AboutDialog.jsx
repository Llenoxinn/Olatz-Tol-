import { useRef, useState } from 'react'
import { Info, X } from 'lucide-react'
import { sequence, stats } from '../../lib/collatz.js'
import { onTabKey } from '../../lib/tabKeys.js'

const S27 = stats(27)
const PATH27 = sequence(27)
const SHOWN = 6

const EXAMPLE = PATH27.slice(0, SHOWN).map((v, k) => ({
  mark: v % 2 ? '×3' : '÷2',
  odd: v % 2 === 1,
  title: v.toLocaleString(),
  tag: `step ${k}`,
  text: v % 2
    ? `Odd, so 3 × ${v} + 1 = ${PATH27[k + 1].toLocaleString()}`
    : `Even, so ${v} ÷ 2 = ${PATH27[k + 1].toLocaleString()}`,
}))

const HISTORY = [
  { year: '1937', who: 'Lothar Collatz', text: 'Poses the problem.' },
  { year: '1976', who: 'Riho Terras', text: 'Proves almost every number eventually drops below where it started.' },
  { year: '1985', who: 'Jeffrey Lagarias', text: 'His survey makes the problem famous, quoting Erdős: “Mathematics is not yet ready for such problems.”' },
  { year: '2020', who: 'Computer search', text: 'Every number up to 2⁶⁸ is confirmed to reach 1.' },
  { year: '2022', who: 'Terence Tao', text: 'Shows almost all orbits reach almost bounded values.' },
].map((h) => ({ mark: h.who[0], title: h.who, tag: h.year, text: h.text }))

const TABS = [
  { id: 'rule', label: 'Rule' },
  { id: 'example', label: 'Example', count: S27.steps },
  { id: 'history', label: 'History', count: HISTORY.length },
]
const IDS = TABS.map((t) => t.id)

export default function AboutDialog() {
  const ref = useRef(null)
  const [tab, setTab] = useState('rule')

  return (
    <>
      <button
        onClick={() => ref.current.showModal()}
        className="flex w-full items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2.5 text-left text-sm font-medium text-fg transition-colors hover:border-neon/40 sm:col-span-2"
      >
        <Info size={14} className="shrink-0 text-neon" />
        What is this?
      </button>

      {/* A click that lands on the dialog itself is a click on the backdrop. */}
      <dialog
        ref={ref}
        aria-labelledby="about-title"
        className="about"
        onClick={(e) => e.target === ref.current && ref.current.close()}
      >
        <div className="p-5 sm:p-7">
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 id="about-title" className="font-display text-xl font-extrabold tracking-tight text-balance">
                The 3n + 1 problem
              </h2>
              <p className="mt-1 text-sm text-dim">Also called the Collatz conjecture. Still unsolved.</p>
            </div>
            <button onClick={() => ref.current.close()} aria-label="Close" className="btn btn-ghost btn-icon -mt-1 -mr-2">
              <X size={18} />
            </button>
          </header>

          <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
            <div role="tablist" aria-label="About the problem" className="flex h-fit shrink-0 gap-1 rounded-2xl bg-raised p-1 sm:flex-col">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  id={`about-tab-${t.id}`}
                  data-value={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  aria-controls="about-panel"
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, IDS, tab, setTab)}
                  className="vtab group"
                >
                  {t.label}
                  {t.count && <span className="vtab-count">{t.count}</span>}
                </button>
              ))}
            </div>

            <div id="about-panel" role="tabpanel" aria-labelledby={`about-tab-${tab}`} className="min-w-0 flex-1">
              {tab === 'rule' && <Rule />}
              {tab === 'example' && (
                <>
                  <Timeline items={EXAMPLE} />
                  <p className="mt-5 border-t border-line pt-4 text-sm text-dim text-pretty">
                    …then {S27.steps - SHOWN} more steps. 27 climbs as high as{' '}
                    <span className="text-neon tabular-nums">{S27.peak.toLocaleString()}</span> on step {S27.peakStep}{' '}
                    before it falls to 1 on step {S27.steps}.
                  </p>
                </>
              )}
              {tab === 'history' && <Timeline items={HISTORY} />}
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}

function Rule() {
  return (
    <div className="text-sm leading-relaxed text-dim">
      <p className="text-pretty">
        Take any positive whole number. If it is even, halve it. If it is odd, triple it and add 1.
        Repeat. The conjecture says every starting number eventually reaches 1.
      </p>
      <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-xl border border-line bg-ink p-4 text-fg">
        <span className="text-dim">n is even</span>
        <span>n → <span className="text-fg">n / 2</span></span>
        <span className="text-dim">n is odd</span>
        <span>n → <span className="text-neon">3n + 1</span></span>
      </div>
      <p className="mt-4 text-pretty">
        It has been checked for every number up to 2<sup>68</sup>, but nobody has proved it holds for all of them,
        or found one that doesn&rsquo;t.
      </p>
    </div>
  )
}

function Timeline({ items }) {
  return (
    <ol className="relative flex flex-col gap-5">
      <span aria-hidden="true" className="absolute top-4 bottom-4 left-[15px] w-px bg-line" />
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className={`relative flex size-8 shrink-0 items-center justify-center rounded-full border-2 bg-panel text-xs font-semibold ${
              it.odd ? 'border-neon/50 text-neon' : 'border-line text-dim'
            }`}
          >
            {it.mark}
          </span>
          <div className="min-w-0 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-fg tabular-nums">{it.title}</span>
              <span className="rounded-md bg-raised px-1.5 py-0.5 text-xs text-faint tabular-nums">{it.tag}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-dim text-pretty">{it.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
