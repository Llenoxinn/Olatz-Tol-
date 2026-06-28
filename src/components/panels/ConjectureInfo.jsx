import { Info } from 'lucide-react'
import { useState } from 'react'

export default function ConjectureInfo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
      >
        <Info size={13} className="text-emerald-600 shrink-0" />
        <span className="text-xs font-medium text-gray-700">What is the Collatz Conjecture?</span>
        <span className="ml-auto text-gray-400 text-[10px]">{open ? 'hide' : 'show'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-gray-100 pt-2.5 space-y-2.5">
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Take any positive integer <em>n</em>. If <em>n</em> is even, divide it by 2.
            If <em>n</em> is odd, multiply by 3 and add 1.
            Repeat. The conjecture says you will always reach 1.
          </p>
          <div className="bg-gray-50 rounded px-3 py-2 font-mono text-xs text-gray-700 space-y-0.5">
            <div>
              if <span className="text-emerald-600">n</span> is even: <span className="text-emerald-600">n</span> = <span className="text-emerald-600">n</span> / 2
            </div>
            <div>
              if <span className="text-emerald-600">n</span> is odd: <span className="text-emerald-600">n</span> = 3<span className="text-emerald-600">n</span> + 1
            </div>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Example: 6 &rarr; 3 &rarr; 10 &rarr; 5 &rarr; 16 &rarr; 8 &rarr; 4 &rarr; 2 &rarr; 1
          </p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Verified up to 2<sup>68</sup>. No proof exists. No counterexample found.
          </p>
        </div>
      )}
    </div>
  )
}
