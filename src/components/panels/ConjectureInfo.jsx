import { ChevronDown, Info } from 'lucide-react'
import { sequence, stats } from '../../lib/collatz.js'

const EXAMPLE = sequence(27).slice(0, 12)
const S27 = stats(27)

export default function ConjectureInfo() {
  return (
    <details className="group rounded-xl border border-line bg-panel sm:col-span-2">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-xs font-medium text-fg [&::-webkit-details-marker]:hidden">
        <Info size={13} className="shrink-0 text-neon" />
        <span className="flex-1">What is this?</span>
        <ChevronDown size={13} className="text-faint transition-transform duration-200 ease-out group-open:rotate-180" />
      </summary>
      <div className="space-y-3 border-t border-line px-3 pt-3 pb-3 text-xs leading-relaxed text-dim">
        <p>
          Take any positive integer. If even, divide by 2. If odd, multiply by 3 and add 1.
          Repeat. The conjecture: you always reach 1.
        </p>

        <div className="rounded-lg border border-line bg-ink p-2.5 text-fg">
          <div className="section-title">Formula</div>
          <div>if n is even: <span className="text-neon">n = n / 2</span></div>
          <div>if n is odd: <span className="text-neon">n = 3n + 1</span></div>
        </div>

        <div className="rounded-lg border border-neon/25 bg-neon/5 p-2.5">
          <div className="section-title text-neon">Example: n = 27 ({S27.steps} steps)</div>
          <div className="leading-loose text-fg tabular-nums">
            {EXAMPLE.map((v, i) => (
              <span key={i}>
                <span className="font-medium">{v}</span>
                <span className={v % 2 ? 'mx-0.5 text-neon' : 'mx-0.5 text-faint'}>{v % 2 ? ' ×3+1 ' : ' /2 '}</span>
                {i < EXAMPLE.length - 1 ? '› ' : '… › '}
              </span>
            ))}
            <span className="font-medium text-neon">1</span>
          </div>
          <div className="mt-2 border-t border-neon/20 pt-2">
            Peak: {S27.peak.toLocaleString()} (step {S27.peakStep} of {S27.steps})
          </div>
        </div>

        <p className="border-t border-line pt-2">Verified up to 2<sup>68</sup>. No proof. No counterexample.</p>
      </div>
    </details>
  )
}
