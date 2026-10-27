export const MODES = [
  { id: 'path', label: 'Path' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'tree', label: 'Tree' },
  { id: 'multi', label: 'Multi' },
  { id: 'spiral', label: 'Spiral' },
]

// Mirrors the @theme tokens in index.css; canvases can't read Tailwind classes.
export const COLORS = {
  ink: '#050605',
  fg: '#eef5ec',
  dim: '#9aa797',
  faint: '#76836f',
  neon: '#39ff14',
  neonRgb: '57, 255, 20',
  grid: 'rgba(238, 245, 236, 0.06)',
  ghost: 'rgba(238, 245, 236, 0.1)',
  glow: 'rgba(57, 255, 20, 0.22)',
  up: '#39ff14', // odd n: 3n + 1
  down: '#eef5ec', // even n: n / 2
}

export const FONT = '"Geist", ui-sans-serif, system-ui, sans-serif'
