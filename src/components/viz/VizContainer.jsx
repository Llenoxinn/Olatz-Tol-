export const VIZ_W = 700
export const VIZ_H = 450

export default function VizContainer({ children, extra }) {
  return (
    <div className="flex gap-4 items-start">
      <div
        className="border border-gray-200 rounded overflow-hidden shrink-0"
        style={{ width: VIZ_W, height: VIZ_H }}
      >
        {children}
      </div>
      {extra && <div className="min-w-0">{extra}</div>}
    </div>
  )
}
