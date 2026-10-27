import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sequence } from '../lib/collatz.js'

// Decimals (e.g. 1.5) never reach 1 and would hang the sequence loops.
const toInt = (v, min, max) => Math.max(min, Math.min(max, Math.round(v) || min))

// Last step playback can reach; Multi mode keeps going until the longer path ends.
export const lastStep = ({ n, compareN, mode }) =>
  Math.max(sequence(n).length, mode === 'multi' && compareN ? sequence(compareN).length : 0) - 1

const useCollatzStore = create(
  persist(
    (set) => ({
      n: 100,
      compareN: null,
      mode: 'path',
      stepIndex: 0,
      isPlaying: false,
      playbackSpeed: 100,
      soundEnabled: true,
      maxN: 10000,
      savedNumbers: [],

      setN: (n) => set({ n: toInt(n, 1, 100000), stepIndex: 0, isPlaying: false }),
      setCompareN: (v) =>
        set((s) => {
          const compareN = v === null ? null : toInt(v, 1, 100000)
          return { compareN, stepIndex: Math.min(s.stepIndex, lastStep({ ...s, compareN })) }
        }),
      setMode: (mode) => set({ mode, stepIndex: 0, isPlaying: false }),
      setMaxN: (maxN) => set({ maxN: toInt(maxN, 100, 50000) }),
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      stepForward: () =>
        set((s) => (s.stepIndex < lastStep(s) ? { stepIndex: s.stepIndex + 1 } : { isPlaying: false })),
      stepBack: () => set((s) => ({ stepIndex: Math.max(0, s.stepIndex - 1) })),
      // Play from the end restarts from the top.
      togglePlay: () =>
        set((s) =>
          s.isPlaying
            ? { isPlaying: false }
            : { isPlaying: true, stepIndex: s.stepIndex >= lastStep(s) ? 0 : s.stepIndex },
        ),

      saveCurrent: () =>
        set((s) => (s.savedNumbers.includes(s.n) ? {} : { savedNumbers: [...s.savedNumbers, s.n] })),
      removeSaved: (v) => set((s) => ({ savedNumbers: s.savedNumbers.filter((x) => x !== v) })),
    }),
    // Only the user's own picks survive a reload.
    {
      name: 'olatz-tol',
      partialize: ({ savedNumbers, soundEnabled }) => ({ savedNumbers, soundEnabled }),
    },
  ),
)

export default useCollatzStore
