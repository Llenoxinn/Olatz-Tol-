import useContainerSize from '../../hooks/useContainerSize.js'
import { Download } from 'lucide-react'

function doExport(canvas) {
  if (!canvas) return
  const tmp = document.createElement('canvas')
  tmp.width = canvas.width
  tmp.height = canvas.height
  const ctx = tmp.getContext('2d')
  ctx.drawImage(canvas, 0, 0)
  const imageData = ctx.getImageData(0, 0, tmp.width, tmp.height)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] > 250 && d[i + 1] > 250 && d[i + 2] > 250) d[i + 3] = 0
  }
  ctx.putImageData(imageData, 0, 0)
  const link = document.createElement('a')
  link.download = 'olatz-tol.png'
  link.href = tmp.toDataURL('image/png')
  link.click()
}

export default function VizContainer({ children }) {
  const { ref, w, h } = useContainerSize()

  const handleExport = () => {
    const canvas = ref.current?.querySelector('canvas')
    doExport(canvas)
  }

  // Expose for header button
  if (ref.current) {
    ref.current._exportFn = handleExport
  }

  return (
    <div ref={ref} className="w-full h-full relative">
      <div className="border border-gray-200 rounded overflow-hidden inline-block" style={{ width: w, height: h }}>
        {typeof children === 'function' ? children({ w, h }) : children}
      </div>
      {w > 100 && (
        <button
          onClick={handleExport}
          className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-gray-500 bg-white/80 backdrop-blur-sm border border-gray-200 rounded hover:bg-gray-50 hover:text-gray-700 transition-colors"
          title="Export as transparent PNG"
        >
          <Download size={11} />
          PNG
        </button>
      )}
    </div>
  )
}
