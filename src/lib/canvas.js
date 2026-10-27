import { COLORS, FONT } from './constants.js'

// Backing store in device pixels so lines and text stay sharp on HiDPI / scaled displays.
export function setupCanvas(canvas, w, h) {
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

// Log₂ value axis on the left and a step axis along the bottom. Returns the scales.
export function logAxes(ctx, w, h, { peak, last, pad }) {
  const logMax = Math.max(Math.log2(peak), 1)
  ctx.font = `11px ${FONT}`
  const left = Math.ceil(ctx.measureText(peak.toLocaleString()).width) + 36
  const width = w - left - pad.right
  const height = h - pad.top - pad.bottom
  const base = pad.top + height
  const x = (i) => left + (i / Math.max(last, 1)) * width
  const y = (v) => base - (Math.log2(v) / logMax) * height

  ctx.lineWidth = 1
  ctx.strokeStyle = COLORS.grid
  ctx.fillStyle = COLORS.faint
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (let i = 0; i <= 4; i++) {
    const gy = pad.top + (i / 4) * height
    ctx.beginPath()
    ctx.moveTo(left, gy)
    ctx.lineTo(left + width, gy)
    ctx.stroke()
    ctx.fillText(Math.round(2 ** (logMax * (1 - i / 4))).toLocaleString(), left - 10, gy)
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const ticks = Math.max(1, Math.min(5, last))
  for (let i = 0; i <= ticks; i++) {
    const step = Math.round((i / ticks) * last)
    ctx.fillText(String(step), x(step), base + 8)
  }
  ctx.textAlign = 'right'
  ctx.fillText('step', left + width, base + 22)

  ctx.save()
  ctx.translate(14, pad.top + height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('value (log₂)', 0, 0)
  ctx.restore()

  return { x, y, base }
}

export function polyline(values, x, y, from, to) {
  const p = new Path2D()
  p.moveTo(x(from), y(values[from]))
  for (let i = from + 1; i <= to; i++) p.lineTo(x(i), y(values[i]))
  return p
}

// Where a playing path currently is: a white dot in a neon halo.
export function drawHead(ctx, px, py) {
  ctx.fillStyle = COLORS.glow
  ctx.beginPath()
  ctx.arc(px, py, 9, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = COLORS.fg
  ctx.beginPath()
  ctx.arc(px, py, 3.5, 0, Math.PI * 2)
  ctx.fill()
}
