# olatz **tol**

Collatz conjecture visualizer. Pick any number, apply the 3n+1 rule, watch the path to 1.

## Quick Start

```bash
npm install
npm run dev
```

## What is the Collatz Conjecture?

Take any positive integer *n*.

- If *n* is even, divide by 2.
- If *n* is odd, multiply by 3 and add 1.
- Repeat until you reach 1.

The conjecture: this process always terminates at 1 for every starting number. Verified up to 2^68. No proof exists.

**Formula:**

```
f(n) = n / 2      if n is even
f(n) = 3n + 1     if n is odd
```

**Example:** 6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1

## Visualization Modes

| Mode | Description |
|------|-------------|
| **Path** | Animated line graph. Red = up (3n+1), blue = down (n/2). Log scale. |
| **Heatmap** | Grid of 10,000 numbers. Color = stopping time. |
| **Tree** | All paths converging to 1 as a directed graph. |
| **Multi** | Overlay two sequences. See where they merge. |
| **Spiral** | Polar layout. Angle = step, radius = value. |

## Features

- Play/pause/step-through animation
- Adjustable speed
- Sound (pitch mapped to value)
- Save and load sequences
- Delay record tracker
- Statistics panel (stopping time, max value, odd/even ratio)
- Stopping time distribution histogram

## Tech Stack

React, Vite, Tailwind CSS, Zustand, Lucide React, Canvas 2D, Web Audio API
