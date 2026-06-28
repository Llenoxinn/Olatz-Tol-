import { useState, useRef, useEffect } from 'react'

export default function useContainerSize() {
  const ref = useRef(null)
  const [size, setSize] = useState({ w: 700, h: 450 })

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const update = () => {
      const rect = el.getBoundingClientRect()
      setSize({ w: Math.floor(rect.width), h: Math.floor(rect.height) })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, ...size }
}
