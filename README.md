# olatz **tol**

A Collatz conjecture visualizer. Pick any number, apply the 3n+1 rule, watch the path to 1.

<div align="center">

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=fff)
![Zustand](https://img.shields.io/badge/Zustand-000?logo=zustand&logoColor=fff)
![Lucide](https://img.shields.io/badge/Lucide-a3a3a3?logo=lucide&logoColor=000)

</div>

## Quick Start

```bash
npm install
npm run dev
```

## The Conjecture

Take any positive integer *n*.

- If *n* is even, divide by 2.
- If *n* is odd, multiply by 3 and add 1.
- Repeat until you reach 1.

The conjecture: every positive integer eventually reaches 1. Verified up to 2^68. No proof exists.

```
f(n) = n / 2      if n is even
f(n) = 3n + 1     if n is odd
```

**Example:** 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1

## Visualization Modes

| Mode | Description |
|------|-------------|
| **Path** | Animated line graph with log scale. Red = ascending, blue = descending. |
| **Heatmap** | Grid of numbers colored by stopping time. Adjustable range. |
| **Tree** | Directed graph of all paths converging to 1. |
| **Multi** | Overlay two sequences to see where they merge. |
| **Spiral** | Polar layout — angle is step count, radius is value. |

## Features

- Play, pause, and step-through animation with adjustable speed
- Pitch-mapped audio feedback
- Save and load sequences
- Delay record tracker
- Statistics panel (stopping time, peak value, odd/even ratio)
- Stopping time distribution histogram
- Export visualization as transparent PNG
