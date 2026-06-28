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

Take any positive integer *n* and apply the following rules:

- If *n* is even → divide by 2
- If *n* is odd → multiply by 3 and add 1
- Repeat until *n* = 1

The Collatz conjecture states that this process always terminates at 1, regardless of the starting value. It has been verified computationally for all integers up to 2<sup>68</sup>, yet no formal proof exists.

```
f(n) = n / 2      if n is even
f(n) = 3n + 1     if n is odd
```

**Example:** 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1

## Visualization Modes

| Mode | Description |
|------|-------------|
| **Path** | Animated line graph on a log scale. Red indicates ascent (3n+1), blue indicates descent (n/2). |
| **Heatmap** | Color-coded grid of integers where hue maps to stopping time. Range is adjustable up to 50,000. |
| **Tree** | Directed acyclic graph showing all sequences converging to 1. |
| **Multi** | Overlays two independent sequences to highlight merge points. |
| **Spiral** | Polar coordinate layout — angle represents step index, radius represents value. |

## Features

- Play, pause, and step-through animation with configurable speed
- Pitch-mapped audio feedback via Web Audio API
- Save and load sequences for later review
- Delay record tracker highlighting known long-delay integers
- Statistics panel with stopping time, peak value, and odd/even ratio
- Stopping time distribution histogram across the full range
- Export any visualization as a transparent PNG
