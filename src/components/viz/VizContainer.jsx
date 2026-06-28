import useContainerSize from '../../hooks/useContainerSize.js'
import { setExportFn, clearExportFn } from './exportBus.js'
import { useEffect, useRef } from 'react'

export default function VizContainer({ children }) {
  const { ref, w, h } = useContainerSize()
  const innerRef = useRef(null)

  useEffect(() => {
    setExportFn(() => {
      const canvas = innerRef.current?.querySelector('canvas')
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
    })
    return () => clearExportFn()
  }, [])

  return (
    <div ref={ref} className="w-full h-full">
      <div ref={innerRef} className="border border-gray-200 rounded overflow-hidden inline-block" style={{ width: w, height: h }}>
        {typeof children === 'function' ? children({ w, h }) : children}
      </div>
    </div>
  )
}
