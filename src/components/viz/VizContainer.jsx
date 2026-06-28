import { VIZ_W, VIZ_H } from './vizSize.js'

export { VIZ_W, VIZ_H }

export default function VizContainer({ children }) {
  return (
    <div className="relative border border-gray-200 rounded overflow-hidden shrink-0" style={{ width: VIZ_W, height: VIZ_H }}>
      {children}
    </div>
  )
}
