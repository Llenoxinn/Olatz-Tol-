import { Info } from 'lucide-react'

export default function UnsolvedPanel() {
  return (
    <div className="border border-amber-200 bg-amber-50 rounded p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 mb-1.5">
        <Info size={12} />
        Unsolved
      </div>
      <p className="text-[11px] text-amber-800/70 leading-relaxed">
        Verified up to 2<sup>68</sup>. No counterexample found. No proof exists.
      </p>
      <p className="text-[11px] text-amber-600 italic mt-2 border-t border-amber-200 pt-2">
        "Mathematics is not yet ready for such problems."
      </p>
      <p className="text-[10px] text-amber-500 mt-0.5">
        Paul Erdos
      </p>
    </div>
  )
}
