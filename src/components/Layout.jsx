export default function Layout({ sidebar, main }) {
  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="h-11 shrink-0 border-b border-gray-200 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-normal text-gray-900">olatz</span>
          <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5">
            tol
          </span>
        </div>
        <span className="text-xs text-gray-400 tracking-wide">Llenoxinn</span>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-56 shrink-0 border-r border-gray-200 p-3 overflow-y-auto flex flex-col gap-3">
          {sidebar}
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            {main}
          </div>
        </main>
      </div>
    </div>
  )
}
