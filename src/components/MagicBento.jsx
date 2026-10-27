import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './MagicBento.css'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

// A dependency-free take on React Bits' MagicBento: borders light up as the pointer nears,
// a soft spotlight follows it over the grid, and a click ripples out from where it landed.
export default function MagicBento({
  children,
  columns = 4,
  rowHeight = 200,
  gap = 12,
  radius = 20,
  enableBorderGlow = true,
  enableSpotlight = true,
  spotlightRadius = 300,
  clickEffect = true,
  glowColor = '57, 255, 20',
}) {
  const gridRef = useRef(null)
  const spotRef = useRef(null)

  useEffect(() => {
    if (!(enableBorderGlow || enableSpotlight) || !matchMedia(FINE_POINTER).matches) return
    const grid = gridRef.current
    const near = spotlightRadius * 0.5
    const far = spotlightRadius * 0.75
    const falloff = (d) => (d <= near ? 1 : d < far ? (far - d) / (far - near) : 0)
    let px = -1e4
    let py = -1e4
    let frame = 0

    const paint = () => {
      frame = 0
      const cards = [...grid.children]
      // Read every rect before writing any style, so the loop never forces a relayout.
      const rects = cards.map((c) => c.getBoundingClientRect())
      let closest = Infinity
      rects.forEach((r, i) => {
        const d = Math.hypot(Math.max(r.left - px, 0, px - r.right), Math.max(r.top - py, 0, py - r.bottom))
        closest = Math.min(closest, d)
        if (!enableBorderGlow) return
        const glow = falloff(d)
        cards[i].style.setProperty('--glow-intensity', glow.toFixed(3))
        if (glow > 0) {
          cards[i].style.setProperty('--glow-x', `${px - r.left}px`)
          cards[i].style.setProperty('--glow-y', `${py - r.top}px`)
        }
      })
      const spot = spotRef.current
      if (spot) {
        spot.style.transform = `translate(${px}px, ${py}px)`
        spot.style.opacity = String(0.8 * falloff(closest))
      }
    }
    const schedule = () => { frame ||= requestAnimationFrame(paint) }
    const onMove = (e) => {
      px = e.clientX
      py = e.clientY
      schedule()
    }
    const onLeave = () => {
      px = py = -1e4
      schedule()
    }

    const root = document.documentElement
    window.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave)
    // The grid can scroll under a pointer that isn't moving.
    window.addEventListener('scroll', schedule, { capture: true, passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', schedule, { capture: true })
      cancelAnimationFrame(frame)
    }
  }, [enableBorderGlow, enableSpotlight, spotlightRadius])

  const ripple = (e) => {
    if (!clickEffect || matchMedia(REDUCED_MOTION).matches) return
    const card = e.target.closest('.bento-card')
    if (!card) return
    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const size = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y))
    const wave = document.createElement('span')
    wave.className = 'bento-ripple'
    wave.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px`
    card.querySelector('.bento-fx').append(wave)
    wave.animate(
      [{ transform: 'scale(0.1)', opacity: 1 }, { transform: 'scale(1)', opacity: 0 }],
      { duration: 650, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    ).onfinish = () => wave.remove()
  }

  return (
    <div
      className="bento"
      style={{
        '--bento-cols': columns,
        '--bento-row': `${rowHeight}px`,
        '--bento-gap': `${gap}px`,
        '--bento-radius': `${radius}px`,
        '--bento-glow': glowColor,
        '--bento-glow-radius': `${spotlightRadius}px`,
      }}
    >
      <div ref={gridRef} className="bento-grid" onPointerDown={ripple}>
        {children}
      </div>
      {enableSpotlight &&
        createPortal(
          <div
            ref={spotRef}
            className="bento-spotlight"
            aria-hidden="true"
            style={{ '--bento-glow': glowColor, '--bento-spot': `${spotlightRadius}px` }}
          />,
          document.body,
        )}
    </div>
  )
}

export function BentoCard({ children }) {
  return (
    <div className="bento-card">
      {/* Ripples go in here so React never has to reconcile them. */}
      <span className="bento-fx" aria-hidden="true" />
      {children}
    </div>
  )
}
