import { AlertTriangle } from 'lucide-react'

export default function UnsolvedPanel() {
  return (
    <div className="relative border-2 border-emerald-500 rounded-lg p-4 bg-emerald-50 overflow-hidden">
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-500/10 rounded-full"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-500/10 rounded-full"></div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
            <AlertTriangle size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-800 uppercase tracking-wide">
              Unsolved
            </div>
            <div className="text-[10px] text-emerald-600">Open since 1937</div>
          </div>
        </div>
        <p className="text-[11px] text-gray-700 leading-relaxed mb-2">
          Verified for all n up to 2<sup>68</sup>. No counterexample found. No proof exists.
        </p>
        <div className="bg-white/60 rounded-md p-2 border border-emerald-200">
          <p className="text-[11px] text-emerald-700 italic">
            "Mathematics is not yet ready for such problems."
          </p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">
            {'\u2014'} Paul Erdos, 1979
          </p>
        </div>
      </div>
    </div>
  )
}
