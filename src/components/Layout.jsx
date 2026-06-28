export default function Layout({ sidebar, main }) {
  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="h-11 shrink-0 border-b border-gray-200 flex items-center px-4 justify-between">
        <div className="flex items-baseline gap-[3px]">
          <span className="text-[15px] font-light text-gray-500 tracking-tight">olatz</span>
          <span className="text-[15px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded px-[5px] py-[1px] leading-none">
            tol
          </span>
        </div>
        <span className="text-[11px] font-light text-gray-400 tracking-widest uppercase">Llenoxinn</span>
      </header>
      <div className="flex-1 flex overflow-hidden min-h-0">
        <aside className="w-56 shrink-0 border-r border-gray-200 p-3 overflow-y-auto flex flex-col gap-3">
          {sidebar}
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {main}
        </main>
      </div>
    </div>
  )
}
