import { useRef, useEffect, useMemo } from 'react'
import useCollatzStore from '../../store/useCollatzStore.js'
import { sequence, convergencePoint } from '../../lib/collatz.js'
import useAnimation from '../../hooks/useAnimation.js'
import useStepSound from '../../hooks/useStepSound.js'
import { VIZ_W, VIZ_H } from './vizSize.js'
import { setExportFn, clearExportFn } from './exportBus.js'

const PAD = 55

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
    setExportFn(() => {
      const src = canvasRef.current
      if (!src) return
      const tmp = document.createElement('canvas')
      tmp.width = src.width
      tmp.height = src.height
      const ctx = tmp.getContext('2d')
      ctx.drawImage(src, 0, 0)
      const imageData = ctx.getImageData(0, 0, tmp.width, tmp.height)
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 250 && d[i + 1] > 250 && d[i + 2] > 250) d[i + 3] = 0
      }
      ctx.putImageData(imageData, 0, 0)
      const link = document.createElement('a')
      link.download = 'olatz-tol-multi.png'
      link.href = tmp.toDataURL('image/png')
      link.click()
    })
    return () => clearExportFn()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = VIZ_W, H = VIZ_H

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)

    const allVals = [...seqA, ...(seqB || [])]
    const maxV = Math.max(...allVals)
    const logMax = Math.log2(maxV || 1)
    const plotW = W - PAD * 2
    const plotH = H - PAD * 2

    ctx.strokeStyle = '#f3f4f6'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = PAD + (i / 5) * plotH
      ctx.beginPath()
      ctx.moveTo(PAD, y)
      ctx.lineTo(W - PAD, y)
      ctx.stroke()
    }

    const xScale = (i, len) => PAD + (i / Math.max(len - 1, 1)) * plotW
    const yScale = (v) => {
      const logV = Math.log2(Math.max(v, 1))
      return PAD + plotH - (logMax > 0 ? (logV / logMax) * plotH : plotH / 2)
    }

    function drawSeq(seq, color, alpha) {
      const len = seq.length
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.moveTo(xScale(0, len), yScale(seq[0]))
      for (let i = 1; i < len; i++) ctx.lineTo(xScale(i, len), yScale(seq[i]))
      ctx.strokeStyle = color
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    drawSeq(seqA.slice(0, displayLen), '#2563eb', compareN ? 0.5 : 1)

    if (seqB && compareN) {
      drawSeq(seqB.slice(0, displayLen), '#dc2626', 0.5)
      if (mergeVal) {
        const idxA = seqA.indexOf(mergeVal)
        const idxB = seqB.indexOf(mergeVal)
        if (idxA >= 0 && idxB >= 0 && idxA < displayLen && idxB < displayLen) {
          const mx = (xScale(idxA, seqA.length) + xScale(idxB, seqB.length)) / 2
          const my = yScale(mergeVal)
          ctx.strokeStyle = '#059669'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(mx, my, 7, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = '#059669'
          ctx.beginPath()
          ctx.arc(mx, my, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#374151'
          ctx.font = '10px Inter, monospace'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'
          ctx.fillText(`merge: ${mergeVal.toLocaleString()}`, mx, my - 10)
        }
      }
      ctx.fillStyle = '#2563eb'
      ctx.fillRect(12, 12, 12, 3)
      ctx.fillStyle = '#6b7280'
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(`n\u2081 = ${n}`, 28, 14)
      ctx.fillStyle = '#dc2626'
      ctx.fillRect(12, 24, 12, 3)
      ctx.fillStyle = '#6b7280'
      ctx.fillText(`n\u2082 = ${compareN}`, 28, 26)
    }

    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, H - 24, W, 24)
    ctx.fillStyle = '#6b7280'
    ctx.font = '10px Inter, monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(`step ${stepIndex}`, 12, H - 12)
    if (compareN) {
      ctx.textAlign = 'right'
      ctx.fillText(`${mergeVal ? 'converges at ' + mergeVal.toLocaleString() : 'no merge yet'}`, W - 12, H - 12)
    }
  }, [seqA, seqB, compareN, displayLen, mergeVal, n, stepIndex])

  return (
    <canvas
      ref={canvasRef}
      width={VIZ_W}
      height={VIZ_H}
      className="block"
      style={{ width: VIZ_W, height: VIZ_H }}
    />
  )
}
