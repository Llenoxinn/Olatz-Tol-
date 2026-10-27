export default function Layout({ sidebar, main, inert }) {
  return (
    <div inert={inert} className="flex min-h-dvh flex-col md:h-dvh">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4 md:px-5">
        <h1 className="wordmark text-[17px]">
          <span className="font-light text-fg">olatz</span>
          <span className="wordmark-badge bg-neon text-ink">tol</span>
        </h1>
        <span className="text-xs text-faint">Llenoxinn</span>
      </header>
      <div className="flex flex-1 flex-col md:min-h-0 md:flex-row">
        <aside className="grid content-start gap-5 border-b border-line p-4 sm:grid-cols-2 md:flex md:w-64 md:shrink-0 md:flex-col md:overflow-y-auto md:border-r md:border-b-0">
          {sidebar}
        </aside>
        <main className="flex min-w-0 flex-1 flex-col gap-3 p-3 md:overflow-y-auto md:p-4">
          {main}
        </main>
      </div>
    </div>
  )
}
