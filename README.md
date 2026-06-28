# olatz **tol**

Collatz conjecture visualizer. Pick any number, apply the 3n+1 rule, watch the path to 1.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=fff)
![Zustand](https://img.shields.io/badge/Zustand-000?logo=zustand&logoColor=fff)
![Lucide](https://img.shields.io/badge/Lucide-a3a3a3?logo=lucide&logoColor=000)
![Canvas](https://img.shields.io/badge/Canvas2D-000)
![WebAudio](https://img.shields.io/badge/WebAudio-4285F4?logo=googlechrome&logoColor=fff)

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

The conjecture: this process always terminates at 1 for every starting number. Verified up to 2^68. No proof exists.

```
f(n) = n / 2      if n is even
f(n) = 3n + 1     if n is odd
```

**Example:** 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1

## Modes

| Mode | Description |
|------|-------------|
| **Path** | Animated line graph. Red = up (3n+1), blue = down (n/2). Log scale. |
| **Heatmap** | Grid of numbers. Color = stopping time. Adjustable range. |
| **Tree** | All paths converging to 1 as a directed graph. |
| **Multi** | Overlay two sequences. See where they merge. |
| **Spiral** | Polar layout. Angle = step, radius = value. |

## Features

- Play / pause / step-through animation
- Adjustable speed + sound (pitch mapped to value)
- Save and load sequences
- Delay record tracker
- Stats panel (stopping time, max value, odd/even ratio)
- Stopping time distribution histogram
- Export canvas as transparent PNG
