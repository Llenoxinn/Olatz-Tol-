import { useCallback, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { stoppingTime, stoppingTimes } from '../../lib/collatz.js'
import { COLORS, FONT } from '../../lib/constants.js'
import useContainerSize from '../../hooks/useContainerSize.js'
import CanvasView from '../viz/CanvasView.jsx'

const AXIS_H = 16

export default function Histogram() {
  const { ref, w, h } = useContainerSize()
  const maxN = useCollatzStore((s) => s.maxN)
  const n = useCollatzStore((s) => s.n)
  const mine = stoppingTime(n)

  const { bins, maxCount, maxT } = useMemo(() => {
    const times = stoppingTimes(maxN)
    const maxT = times.reduce((m, t) => (t > m ? t : m), 1)
    const bins = new Array(Math.min(60, maxT)).fill(0)
    for (const t of times) bins[Math.floor((t / maxT) * (bins.length - 1))]++
    return { bins, maxCount: Math.max(...bins), maxT }
  }, [maxN])

  // The bar holding the current number is drawn white.
  const draw = useCallback((ctx, w, h) => {
    const plotH = h - AXIS_H
    const barW = w / bins.length
    const own = mine <= maxT ? Math.floor((mine / maxT) * (bins.length - 1)) : -1
    for (let i = 0; i < bins.length; i++) {
      const barH = Math.max((bins[i] / maxCount) * plotH, bins[i] ? 1 : 0)
      ctx.fillStyle = i === own ? COLORS.fg : `rgba(${COLORS.neonRgb}, ${0.35 + (bins[i] / maxCount) * 0.65})`
      ctx.fillRect(i * barW, plotH - barH, Math.max(barW - 1, 0.5), barH)
    }
    ctx.fillStyle = COLORS.faint
    ctx.font = `11px ${FONT}`
    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'left'
    ctx.fillText('0', 0, h)
    ctx.textAlign = 'center'
    ctx.fillText('stopping time', w / 2, h)
    ctx.textAlign = 'right'
    ctx.fillText(String(maxT), w, h)
  }, [bins, maxCount, maxT, mine])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="section-title">Distribution</h2>
        <span className="truncate text-xs text-dim tabular-nums">
          <span className="mr-1 inline-block size-1.5 rounded-full bg-fg" />
          {n.toLocaleString()} &rarr; {mine}
        </span>
      </div>
      <div ref={ref} className="relative min-h-0 flex-1">
        {w > 0 && h > 0 && (
          <CanvasView w={w} h={h} draw={draw} label={`Stopping times from 1 to ${maxN}, up to ${maxT} steps`} />
        )}
      </div>
    </div>
  )
}
