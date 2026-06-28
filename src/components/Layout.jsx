export default function Layout({ sidebar, main }) {
  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="h-10 shrink-0 border-b border-gray-200 flex items-center px-4">
        <h1 className="text-sm font-semibold tracking-tight text-gray-900">
          olatz tol
        </h1>
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
