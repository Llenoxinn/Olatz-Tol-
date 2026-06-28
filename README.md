# olatz **tol**

A Collatz conjecture visualizer. Pick any number, apply the 3n+1 rule, watch the path to 1.

## Run

```bash
npm install
npm run dev
```

## Features

- **Sequence Path** -- animated graph with up/down color coding and log-scale y-axis
- **Stopping Time Heatmap** -- 10,000 numbers rendered as a color-coded grid
- **Convergence Tree** -- all paths from 1 to N visualized as a directed graph
- **Multi Overlay** -- compare two sequences, see where they merge
- **Spiral** -- polar layout mapping step index to angle, value to radius
- **Sound** -- sequence values mapped to pitch via Web Audio API
- **Playback controls** -- play, pause, step-by-step, adjustable speed
- **Delay record tracker** -- highlights numbers with longer stopping times than all smaller numbers

## Tech

React, Vite, Tailwind CSS, Zustand, Lucide icons, Canvas 2D, Web Audio API
