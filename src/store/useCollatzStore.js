import { create } from 'zustand'
import { sequence } from '../lib/collatz.js'

const useCollatzStore = create((set, get) => ({
  n: 100,
  compareN: null,
  mode: 'path',
  stepIndex: 0,
  stepMode: 'auto',
  isPlaying: false,
  playbackSpeed: 100,
  soundEnabled: true,
  maxN: 10000,
  savedNumbers: [],

  setN: (n) => set({ n: Math.max(1, Math.min(100000, n)), stepIndex: 0, isPlaying: false }),
  setCompareN: (n) => set({ compareN: Math.max(1, Math.min(100000, n)) }),
  setMode: (mode) => set({ mode, stepIndex: 0, isPlaying: false }),
  setMaxN: (maxN) => set({ maxN }),
  setStepMode: (stepMode) => set({ stepMode, isPlaying: false, stepIndex: 0 }),

  stepForward: () => {
    const { n, stepIndex } = get()
    const seq = sequence(n)
    if (stepIndex < seq.length - 1) {
      set({ stepIndex: stepIndex + 1 })
    } else {
      set({ isPlaying: false })
    }
  },

  stepBack: () => {
    const { stepIndex } = get()
    if (stepIndex > 0) set({ stepIndex: stepIndex - 1 })
  },

  togglePlay: () => {
    const { isPlaying, stepIndex, n } = get()
    if (!isPlaying && stepIndex >= sequence(n).length - 1) {
      set({ stepIndex: 0, isPlaying: true })
    } else {
      set({ isPlaying: !isPlaying })
    }
  },

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  saveCurrent: () => {
    const { n, savedNumbers } = get()
    if (!savedNumbers.includes(n)) set({ savedNumbers: [...savedNumbers, n] })
  },

  removeSaved: (val) =>
    set((s) => ({ savedNumbers: s.savedNumbers.filter((v) => v !== val) })),

  loadSaved: (val) => set({ n: val, stepIndex: 0, isPlaying: false }),
}))

export default useCollatzStore
