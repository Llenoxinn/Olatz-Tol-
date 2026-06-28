import { Download } from 'lucide-react'

export default function ExportButton({ canvasRef }) {
  const handleExport = () => {
    const src = canvasRef.current
    if (!src) return

    const w = src.width
    const h = src.height
    const tmp = document.createElement('canvas')
    tmp.width = w
    tmp.height = h
    const ctx = tmp.getContext('2d')

    ctx.drawImage(src, 0, 0)

    const imageData = ctx.getImageData(0, 0, w, h)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      if (r > 250 && g > 250 && b > 250) {
        data[i + 3] = 0
      }
    }

    ctx.putImageData(imageData, 0, 0)

    const link = document.createElement('a')
    link.download = 'olatz-tol-export.png'
    link.href = tmp.toDataURL('image/png')
    link.click()
  }

  return (
    <button
      onClick={handleExport}
      className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-gray-500 bg-white/80 backdrop-blur border border-gray-200 rounded hover:bg-gray-50 hover:text-gray-700 transition-colors"
      title="Export as transparent PNG"
    >
      <Download size={11} />
      PNG
    </button>
  )
}
