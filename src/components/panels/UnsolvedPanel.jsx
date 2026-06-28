import { AlertTriangle } from 'lucide-react'

export default function UnsolvedPanel() {
  return (
    <div className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white rounded p-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100 rounded-bl-full opacity-60"></div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center">
            <AlertTriangle size={14} className="text-white" />
          </div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Unsolved
          </span>
        </div>
        <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
          Verified for all n up to 2<sup>68</sup>. No counterexample found.
          No proof exists. Open problem since 1937.
        </p>
        <div className="border-t border-emerald-200 pt-2">
          <p className="text-[11px] text-emerald-700 italic leading-relaxed">
            "Mathematics is not yet ready for such problems."
          </p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">
            \u2014 Paul Erdos, 1979
          </p>
        </div>
      </div>
    </div>
  )
}
