import { useLayoutEffect, useRef, useState } from 'react'

// Content-box size of `ref`, measured before paint so canvases never draw at a guessed size.
export default function useContainerSize() {
  const ref = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, ...size }
}
