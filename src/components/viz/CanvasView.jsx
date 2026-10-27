import { useEffect, useReducer, useRef } from 'react'
import { setupCanvas } from '../../lib/canvas.js'

// Height of the caption bar every view overlays along its bottom edge.
export const CAPTION_H = 32

// Redraws when `draw` changes identity, so callers memoize it on their inputs.
// Also redraws once web fonts land, since canvas text can't swap fonts by itself.
export default function CanvasView({ w, h, draw, label, ...rest }) {
  const ref = useRef(null)
  const [fontsLoaded, bump] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    const fonts = document.fonts
    fonts?.addEventListener('loadingdone', bump)
    return () => fonts?.removeEventListener('loadingdone', bump)
  }, [])

  useEffect(() => {
    if (w > 0 && h > 0) draw(setupCanvas(ref.current, w, h), w, h)
  }, [draw, w, h, fontsLoaded])

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      className="absolute top-0 left-0 block"
      style={{ width: w, height: h }}
      {...rest}
    />
  )
}

export function Caption({ left, right }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-line bg-panel px-4 text-xs text-dim tabular-nums"
      style={{ height: CAPTION_H }}
    >
      <span className="flex min-w-0 items-center gap-3 truncate">{left}</span>
      <span className="flex shrink-0 items-center gap-3">{right}</span>
    </div>
  )
}

export function Key({ swatch, children }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-0.5 w-3 rounded-full ${swatch}`} />
      {children}
    </span>
  )
}

export function Legend() {
  return (
    <>
      <Key swatch="bg-neon">3n+1</Key>
      <Key swatch="bg-fg">n/2</Key>
    </>
  )
}
