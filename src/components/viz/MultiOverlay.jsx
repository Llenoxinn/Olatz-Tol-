import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { sequence, convergencePoint } from '../../lib/collatz.js'
import useAnimation from '../../hooks/useAnimation.js'
import useStepSound from '../../hooks/useStepSound.js'

const W = 700, H = 420, pad = 50

export default function MultiOverlay() {
  const canvasRef = useRef(null)
  const n = useCollatzStore((s) => s.n)
  const compareN = useCollatzStore((s) => s.compareN)
  const stepIndex = useCollatzStore((s) => s.stepIndex)

  useAnimation()
  useStepSound()

  const seqA = useMemo(() => sequence(n), [n])
  const seqB = useMemo(() => (compareN ? sequence(compareN) : null), [compareN])
  const mergeVal = useMemo(
    () => (compareN ? convergencePoint(n, compareN) : null),
    [n, compareN]
  )

  const displayLen = compareN
    ? Math.max(seqA.length, seqB.length)
    : Math.min(stepIndex + 1, seqA.length)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    const allVals = [...seqA, ...(seqB || [])]
    const maxV = Math.max(...allVals)
    const plotW = W - 2 * pad
    const plotH = H - 2 * pad

    const xScale = (i, len) => pad + (i / Math.max(len - 1, 1)) * plotW
    const yScale = (v) => {
      if (maxV <= 1) return pad + plotH / 2
      return pad + plotH - (Math.log2(v) / Math.log2(maxV)) * plotH
    }

    function drawSeq(seq, color, alpha) {
      const len = seq.length
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.globalAlpha = alpha
      for (let i = 0; i < len - 1; i++) {
        const x1 = xScale(i, len), y1 = yScale(seq[i])
        const x2 = xScale(i + 1, len), y2 = yScale(seq[i + 1])
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = color
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    drawSeq(seqA.slice(0, displayLen), '#2563eb', compareN ? 0.6 : 1)

    if (seqB && compareN) {
      drawSeq(seqB.slice(0, displayLen), '#dc2626', 0.6)

      if (mergeVal) {
        const idxA = seqA.indexOf(mergeVal)
        const idxB = seqB.indexOf(mergeVal)
        if (idxA >= 0 && idxB >= 0 && idxA < displayLen && idxB < displayLen) {
          const mx = (xScale(idxA, seqA.length) + xScale(idxB, seqB.length)) / 2
          const my = yScale(mergeVal)
          ctx.fillStyle = '#059669'
          ctx.beginPath()
          ctx.arc(mx, my, 5, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(mx, my, 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#374151'
          ctx.font = '10px Inter, monospace'
          ctx.textAlign = 'center'
          ctx.fillText(`merge: ${mergeVal}`, mx, my - 10)
        }
      }

      ctx.fillStyle = '#6b7280'
      ctx.font = '10px Inter, monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`n\u2081 = ${n}`, pad, H - 8)
      ctx.textAlign = 'right'
      ctx.fillText(`n\u2082 = ${compareN}`, W - pad, H - 8)
    }
  }, [seqA, seqB, compareN, displayLen, mergeVal, n])

  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full h-auto"
      />
    </div>
  )
}
