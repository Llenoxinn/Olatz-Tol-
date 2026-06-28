import { Info } from 'lucide-react'
import { useState } from 'react'

const EXAMPLE = [
  { n: 27, odd: true },
  { n: 82, odd: false },
  { n: 41, odd: true },
  { n: 124, odd: false },
  { n: 62, odd: false },
  { n: 31, odd: true },
  { n: 94, odd: false },
  { n: 47, odd: true },
  { n: 142, odd: false },
  { n: 71, odd: true },
  { n: 214, odd: false },
  { n: 107, odd: true },
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
        <span className="text-xs font-medium text-gray-700 flex-1">What is this?</span>
        <span className="text-[10px] text-gray-400">{open ? 'hide' : 'show'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-gray-100 pt-3 space-y-3">
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Take any positive integer. If even, divide by 2. If odd, multiply by 3 and add 1.
            Repeat. The conjecture: you always reach 1.
          </p>

          {/* Formula */}
          <div className="bg-gray-50 rounded border border-gray-200 p-2.5">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Formula
            </div>
            <div className="font-mono text-[11px] text-gray-800 leading-relaxed">
              <div>if n is even: <span className="text-emerald-600 font-semibold">n = n / 2</span></div>
              <div>if n is odd: <span className="text-emerald-600 font-semibold">n = 3n + 1</span></div>
            </div>
          </div>

          {/* Example */}
          <div className="border border-emerald-200 bg-emerald-50/50 rounded p-2.5">
            <div className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider mb-2">
              Example: n = 27 (111 steps)
            </div>
            <div className="font-mono text-[10px] text-gray-700 leading-loose">
              {EXAMPLE.map((s, i) => (
                <span key={i}>
                  <span className="font-bold text-gray-900">{s.n}</span>
                  <span className={`mx-0.5 ${s.odd ? 'text-red-500 font-medium' : 'text-blue-500 font-medium'}`}>
                    {s.odd ? ' x3+1 ' : ' /2 '}
                  </span>
                  {i < EXAMPLE.length - 1 ? '> ' : '... > '}
                </span>
              ))}
              <span className="font-bold text-emerald-600">1</span>
            </div>
            <div className="text-[10px] text-gray-500 mt-2 pt-2 border-t border-emerald-200">
              Peak: 9,232 (step 77 of 111)
            </div>
          </div>

          <div className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-100 pt-2">
            Verified up to 2^68. No proof. No counterexample.
          </div>
        </div>
      )}
    </div>
  )
}
