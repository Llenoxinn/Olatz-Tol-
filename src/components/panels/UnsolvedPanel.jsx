export default function UnsolvedPanel() {
  return (
    <div className="border border-gray-200 rounded p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider">
          Unsolved
        </span>
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed mb-2">
        Verified for all n up to 2<sup>68</sup>. No counterexample found. No proof exists.
      </p>
      <div className="border-t border-gray-100 pt-2">
        <p className="text-[11px] text-gray-400 italic leading-relaxed">
          "Mathematics is not yet ready for such problems."
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          Paul Erdos, 1979
        </p>
      </div>
    </div>
  )
}
