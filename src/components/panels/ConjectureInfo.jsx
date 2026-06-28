import { Info } from 'lucide-react'
import { useState } from 'react'

const EXAMPLE_STEPS = [
  { n: 27, op: 'odd', result: 82 },
  { n: 82, op: 'even', result: 41 },
  { n: 41, op: 'odd', result: 124 },
  { n: 124, op: 'even', result: 62 },
  { n: 62, op: 'even', result: 31 },
  { n: 31, op: 'odd', result: 94 },
  { n: 94, op: 'even', result: 47 },
  { n: 47, op: 'odd', result: 142 },
  { n: 142, op: 'even', result: 71 },
  { n: 71, op: 'odd', result: 214 },
  { n: 214, op: 'even', result: 107 },
  { n: 107, op: 'odd', result: 322 },
]

export default function ConjectureInfo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
      >
        <Info size={13} className="text-emerald-600 shrink-0" />
        <span className="text-xs font-medium text-gray-700 flex-1">What is the Collatz Conjecture?</span>
        <span className="text-[10px] text-gray-400">{open ? 'hide' : 'show'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-gray-100 pt-3 space-y-3">
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Take any positive integer. If even, divide by 2. If odd, multiply by 3 and add 1.
            Repeat until you reach 1. The conjecture: this always happens.
          </p>

          {/* Formula box */}
          <div className="bg-gray-50 rounded border border-gray-200 p-3">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Formula
            </div>
            <div className="font-mono text-sm text-gray-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-semibold">f(n)</span>
                <span className="text-gray-400">=</span>
                <span>n / 2</span>
                <span className="text-[10px] text-gray-400 ml-auto">if n is even</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-semibold">f(n)</span>
                <span className="text-gray-400">=</span>
                <span>3n + 1</span>
                <span className="text-[10px] text-gray-400 ml-auto">if n is odd</span>
              </div>
            </div>
          </div>

          {/* Worked example */}
          <div>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Example: n = 27 (111 steps)
            </div>
            <div className="font-mono text-[11px] text-gray-700 leading-relaxed">
              {EXAMPLE_STEPS.map((s, i) => (
                <span key={i}>
                  <span className="font-semibold">{s.n}</span>
                  <span className={`mx-0.5 ${s.op === 'odd' ? 'text-red-500' : 'text-blue-500'}`}>
                    {s.op === 'odd' ? '\u00d73+1' : '\u00f72'}
                  </span>
                  <span className="text-gray-400">\u2192 </span>
                </span>
              ))}
              <span className="text-gray-400">... </span>
              <span className="text-gray-400">\u2192 </span>
              <span className="font-semibold">1</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              Peak: 9,232 &middot; Max value before collapse
            </div>
          </div>

          {/* Status */}
          <div className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-100 pt-2">
            Verified up to 2<sup>68</sup>. No proof. No counterexample.
          </div>
        </div>
      )}
    </div>
  )
}
