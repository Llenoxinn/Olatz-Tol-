import { useRef } from 'react'
import { Download } from 'lucide-react'

export const VIZ_W = 700
export const VIZ_H = 450

export default function VizContainer({ children }) {
  const wrapRef = useRef(null)

  const handleExport = () => {
    const canvas = wrapRef.current?.querySelector('canvas')
    if (!canvas) return

    const w = canvas.width
    const h = canvas.height
    const tmp = document.createElement('canvas')
    tmp.width = w
    tmp.height = h
    const ctx = tmp.getContext('2d')
    ctx.drawImage(canvas, 0, 0)

    const imageData = ctx.getImageData(0, 0, w, h)
    const d = imageData.data
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] > 250 && d[i + 1] > 250 && d[i + 2] > 250) {
        d[i + 3] = 0
      }
    }
    ctx.putImageData(imageData, 0, 0)

    const link = document.createElement('a')
    link.download = 'olatz-tol-export.png'
    link.href = tmp.toDataURL('image/png')
    link.click()
  }

  return (
    <div ref={wrapRef} className="relative border border-gray-200 rounded overflow-hidden shrink-0" style={{ width: VIZ_W, height: VIZ_H }}>
      {children}
      <button
        onClick={handleExport}
        className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-gray-500 bg-white/80 backdrop-blur-sm border border-gray-200 rounded hover:bg-gray-50 hover:text-gray-700 transition-colors"
        title="Export as transparent PNG"
      >
        <Download size={11} />
        PNG
      </button>
    </div>
  )
}
