import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import { sequence } from '../lib/collatz.js'
import { COLORS } from '../lib/constants.js'
import './Intro.css'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)'

// Each letter rides its own hailstone sequence and lands when it reaches 1.
const OLATZ = [['o', 3], ['l', 6], ['a', 12], ['t', 11], ['z', 7]].map(([ch, seed]) => ({ ch, path: sequence(seed) }))
const TOP = Math.log2(Math.max(...OLATZ.flatMap((l) => l.path)))
const HOP = 1.6 // em that the tallest value lifts a letter
const TOL = ['t', 'o', 'l']

// Timeline, in ms from the start.
const START = 60
const landAt = (i) => 560 + i * 95
const TOL_AT = 1000
const TOL_STAGGER = 70
const TOL_DUR = 640
const BOX_AT = 1560
const BOX_DUR = 380
const FILL_AT = 1900
const EXIT_AT = 2500
const EXIT_DUR = 420

const withEasing = (frames, easing) => frames.map((f) => ({ easing, ...f }))

export default function Intro({ onDone }) {
  const rootRef = useRef(null)
  const badgeRef = useRef(null)
  const exitRef = useRef(null)
  const [box, setBox] = useState(null)
  const [fontsReady, setFontsReady] = useState(false)
  const ready = fontsReady && box !== null

  const finish = useEffectEvent(() => onDone())
  // Jump straight to the fade-out.
  const skip = useEffectEvent(() => {
    const exit = exitRef.current
    if (!exit) return finish()
    const start = exit.effect.getTiming().delay
    if (exit.currentTime < start) exit.currentTime = start
  })

  // The outline is drawn in px, so it tracks the badge's real size as fonts swap in.
  useLayoutEffect(() => {
    const el = badgeRef.current
    const ro = new ResizeObserver(() =>
      setBox({ w: el.offsetWidth, h: el.offsetHeight, r: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0 }),
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let live = true
    const fonts = document.fonts
    const load = fonts
      ? Promise.all(['300 1em Unbounded', '800 1em Unbounded', '500 1em Geist'].map((f) => fonts.load(f)))
      : Promise.resolve()
    // A slow font network never holds the page hostage.
    const timeout = new Promise((r) => setTimeout(r, 1200))
    Promise.race([load, timeout])
      .catch(() => {})
      .then(() => live && setFontsReady(true))
    return () => { live = false }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const onSkip = () => skip()
    window.addEventListener('keydown', onSkip)
    root.addEventListener('pointerdown', onSkip)
    return () => {
      window.removeEventListener('keydown', onSkip)
      root.removeEventListener('pointerdown', onSkip)
    }
  }, [])

  useLayoutEffect(() => {
    if (!ready) return
    const root = rootRef.current
    const anims = []
    const run = (el, frames, timing) => {
      const a = el.animate(frames, { fill: 'both', ...timing })
      anims.push(a)
      return a
    }

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // No hops or bounces: the finished logo, then a fade.
      root.dataset.static = ''
      exitRef.current = run(root, [{ opacity: 1 }, { opacity: 0 }], { delay: 700, duration: 250, easing: 'ease' })
    } else {
      root.querySelectorAll('.intro-letter').forEach((letter, i) => {
        const { path } = OLATZ[i]
        const steps = path.length - 1
        const land = landAt(i)
        const flight = { delay: START, duration: land - START }
        run(letter, [{ opacity: 0 }, { opacity: 1 }], { delay: START + i * 40, duration: 180, easing: EASE_OUT })
        run(
          letter.querySelector('.intro-hop'),
          path.map((v, k) => ({ offset: k / steps, transform: `translateY(${(-Math.log2(v) / TOP) * HOP}em)`, easing: EASE_IN_OUT })),
          flight,
        )
        // The counter clicks over to the next value on every hop.
        run(
          letter.querySelector('.intro-ticks'),
          path.map((_, k) => ({ offset: k / steps, transform: `translateY(${(-k / path.length) * 100}%)`, easing: 'step-end' })),
          flight,
        )
        run(letter.querySelector('.intro-tick'), [{ opacity: 1 }, { opacity: 0 }], { delay: land + 120, duration: 200, easing: EASE_OUT })
        run(
          letter.querySelector('.intro-glyph'),
          withEasing([
            { transform: 'none', color: COLORS.faint },
            { offset: 0.3, transform: 'scale(1.16, 0.8)', color: COLORS.neon },
            { offset: 0.65, transform: 'scale(0.96, 1.05)', color: COLORS.neon },
            { transform: 'none', color: COLORS.fg },
          ], EASE_OUT),
          { delay: land, duration: 320 },
        )
      })

      root.querySelectorAll('.intro-tol-glyph').forEach((glyph, j) => {
        run(
          glyph,
          withEasing([
            { opacity: 0, transform: 'translateY(80%) rotate(-28deg) scale(0.7, 1.3)' },
            { offset: 0.34, opacity: 1, transform: 'translateY(-26%) rotate(10deg) scale(0.92, 1.12)' },
            { offset: 0.56, opacity: 1, transform: 'translateY(0%) rotate(-5deg) scale(1.22, 0.8)' },
            { offset: 0.74, opacity: 1, transform: 'translateY(-7%) rotate(2deg) scale(0.95, 1.06)' },
            { offset: 0.88, opacity: 1, transform: 'translateY(0%) rotate(-1deg) scale(1.03, 0.98)' },
            { opacity: 1, transform: 'none' },
          ], EASE_IN_OUT),
          { delay: TOL_AT + j * TOL_STAGGER, duration: TOL_DUR },
        )
        run(glyph, [{ color: COLORS.fg }, { color: COLORS.ink }], { delay: FILL_AT + 60, duration: 220, easing: EASE_OUT })
      })

      run(root.querySelector('.intro-box rect'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay: BOX_AT, duration: BOX_DUR, easing: EASE_IN_OUT })
      run(root.querySelector('.intro-fill'), [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { delay: FILL_AT, duration: 280, easing: EASE_IN_OUT })
      run(root.querySelector('.intro-glow'), [{ opacity: 0 }, { offset: 0.35, opacity: 0.55 }, { opacity: 0.2 }], { delay: FILL_AT + 120, duration: 700, easing: EASE_OUT })
      run(root.querySelector('.intro-progress'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: EXIT_AT, easing: 'linear' })
      run(root.querySelector('.intro-hint'), [{ opacity: 0 }, { opacity: 1 }], { delay: 500, duration: 300, easing: 'ease' })
      run(root.querySelector('.intro-logo'), [{ transform: 'none' }, { transform: 'translateY(-10px) scale(0.98)' }], { delay: EXIT_AT, duration: EXIT_DUR, easing: EASE_OUT })
      exitRef.current = run(root, [{ opacity: 1 }, { opacity: 0 }], { delay: EXIT_AT, duration: EXIT_DUR, easing: EASE_OUT })
    }

    exitRef.current.finished.then(() => finish(), () => {})
    return () => {
      anims.forEach((a) => a.cancel())
      exitRef.current = null
    }
  }, [ready])

  return (
    <div ref={rootRef} className="intro" role="status">
      <span className="sr-only">Loading olatz tol</span>
      <div className="intro-logo wordmark" aria-hidden="true">
        {OLATZ.map(({ ch, path }) => (
          <span key={ch} className="intro-letter">
            <span className="intro-hop">
              <span className="intro-tick">
                <span className="intro-ticks">
                  {path.map((v, k) => <span key={k}>{v}</span>)}
                </span>
              </span>
              <span className="intro-glyph">{ch}</span>
            </span>
          </span>
        ))}
        <span ref={badgeRef} className="intro-badge wordmark-badge">
          <span className="intro-glow" />
          <span className="intro-fill" />
          {box && (
            <svg className="intro-box" viewBox={`0 0 ${box.w} ${box.h}`}>
              <rect x="1" y="1" width={Math.max(box.w - 2, 0)} height={Math.max(box.h - 2, 0)} rx={box.r} pathLength="1" />
            </svg>
          )}
          {TOL.map((ch, j) => (
            <span key={j} className="intro-tol-glyph">{ch}</span>
          ))}
        </span>
        <span className="intro-progress" />
      </div>
      <p className="intro-hint" aria-hidden="true">Tap or press any key to skip</p>
    </div>
  )
}
