import { useCallback, useMemo, useState } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stoppingTimes } from '../../lib/collatz.js'
import { COLORS } from '../../lib/constants.js'
import CanvasView, { Caption, CAPTION_H } from './CanvasView.jsx'

// Few steps stay near black, the slowest numbers burn neon to white.
const STOPS = [
  [0, [11, 19, 11]],
  [0.4, [20, 92, 8]],
  [0.75, [57, 255, 20]],
  [1, [242, 255, 233]],
]
const GRADIENT = `linear-gradient(90deg, ${STOPS.map(([t, c]) => `rgb(${c}) ${t * 100}%`).join(', ')})`

const RAMP = new Uint8Array(256 * 3)
for (let i = 0; i < 256; i++) {
  const t = i / 255
  const k = STOPS.findIndex(([s]) => s >= t)
  const [t0, c0] = STOPS[Math.max(k - 1, 0)]
  const [t1, c1] = STOPS[k]
  const f = t1 === t0 ? 0 : (t - t0) / (t1 - t0)
  for (let j = 0; j < 3; j++) RAMP[i * 3 + j] = Math.round(c0[j] + (c1[j] - c0[j]) * f)
}

// Whole-pixel cells when the grid fits, so neighbours never blur together.
function gridBox(w, h, side) {
  const avail = Math.max(Math.min(w, h - CAPTION_H) - 32, 1)
  const fit = avail / side
  const cell = fit >= 1 ? Math.floor(fit) : fit
  const size = cell * side
  return { x: (w - size) / 2, y: (h - CAPTION_H - size) / 2, cell, size }
}

export default function Heatmap({ w, h }) {
  const maxN = useCollatzStore((s) => s.maxN)
  const n = useCollatzStore((s) => s.n)
  const setN = useCollatzStore((s) => s.setN)
  const [hover, setHover] = useState(null)

  const times = useMemo(() => stoppingTimes(maxN), [maxN])
  const maxT = useMemo(() => times.reduce((m, t) => (t > m ? t : m), 1), [times])
  const side = Math.ceil(Math.sqrt(maxN))

  // One pixel per number, scaled up with smoothing off at draw time.
  const image = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = side
    const ctx = c.getContext('2d')
    const img = ctx.createImageData(side, side)
    for (let i = 0; i < maxN; i++) {
      const r = Math.round((times[i] / maxT) * 255) * 3
      img.data[i * 4] = RAMP[r]
      img.data[i * 4 + 1] = RAMP[r + 1]
      img.data[i * 4 + 2] = RAMP[r + 2]
      img.data[i * 4 + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
    return c
  }, [times, maxT, maxN, side])

  const draw = useCallback((ctx, w, h) => {
    const box = gridBox(w, h, side)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(image, box.x, box.y, box.size, box.size)
    if (n <= maxN) {
      const s = Math.max(box.cell, 5)
      const cx = box.x + ((n - 1) % side) * box.cell + box.cell / 2
      const cy = box.y + Math.floor((n - 1) / side) * box.cell + box.cell / 2
      ctx.strokeStyle = COLORS.fg
      ctx.lineWidth = 1.5
      ctx.strokeRect(cx - s / 2 - 1, cy - s / 2 - 1, s + 2, s + 2)
    }
  }, [image, side, n, maxN])

  const pick = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const box = gridBox(w, h, side)
    const col = Math.floor((e.clientX - r.left - box.x) / box.cell)
    const row = Math.floor((e.clientY - r.top - box.y) / box.cell)
    if (col < 0 || row < 0 || col >= side || row >= side) return null
    const v = row * side + col + 1
    return v <= maxN ? v : null
  }

  return (
    <>
      <CanvasView
        w={w}
        h={h}
        draw={draw}
        label={`Stopping times for 1 to ${maxN}`}
        onPointerMove={(e) => setHover(pick(e))}
        onPointerLeave={() => setHover(null)}
        onClick={(e) => {
          const v = pick(e)
          if (v) setN(v)
        }}
        style={{ width: w, height: h, cursor: hover ? 'pointer' : 'default' }}
      />
      <Caption
        left={
          hover
            ? <span className="text-fg">n = {hover.toLocaleString()} &middot; {times[hover - 1]} steps</span>
            : <>1&ndash;{maxN.toLocaleString()}<span className="text-faint">{side} &times; {side} &middot; click a cell to inspect it</span></>
        }
        right={
          <>
            0
            <span className="h-1.5 w-24 rounded-full" style={{ background: GRADIENT }} />
            {maxT} steps
          </>
        }
      />
    </>
  )
}
