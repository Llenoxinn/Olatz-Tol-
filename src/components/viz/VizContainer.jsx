import { Download } from 'lucide-react'
import useContainerSize from '../../hooks/useContainerSize.js'

// Canvases leave the background unpainted, so the PNG is transparent as-is.
function exportPng(canvas) {
  if (!canvas) return
  const link = document.createElement('a')
  link.download = 'olatz-tol.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export default function VizContainer({ children }) {
  const { ref, w, h } = useContainerSize()

  return (
    <div ref={ref} className="relative h-full overflow-hidden rounded-[20px] border border-line bg-panel">
      {w > 0 && h > 0 && children({ w, h })}
      {w > 120 && (
        <button
          onClick={() => exportPng(ref.current.querySelector('canvas'))}
          className="btn btn-ghost absolute top-3 right-3 z-10 gap-1 border border-line bg-panel/80 px-2 py-1 text-xs backdrop-blur-sm"
          title="Export as transparent PNG"
        >
          <Download size={11} />
          PNG
        </button>
      )}
    </div>
  )
}
