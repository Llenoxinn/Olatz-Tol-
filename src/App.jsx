import Layout from './components/Layout.jsx'
import ModeSelector from './components/controls/ModeSelector.jsx'
import NumberInput from './components/controls/NumberInput.jsx'
import StepControls from './components/controls/StepControls.jsx'
import CompareInput from './components/controls/CompareInput.jsx'
import RecordReplay from './components/controls/RecordReplay.jsx'
import ConjectureInfo from './components/panels/ConjectureInfo.jsx'
import StatsPanel from './components/panels/StatsPanel.jsx'
import Histogram from './components/panels/Histogram.jsx'
import DelayTracker from './components/panels/DelayTracker.jsx'
import UnsolvedPanel from './components/panels/UnsolvedPanel.jsx'
import SequencePath from './components/viz/SequencePath.jsx'
import Heatmap from './components/viz/Heatmap.jsx'
import ConvergenceTree from './components/viz/ConvergenceTree.jsx'
import MultiOverlay from './components/viz/MultiOverlay.jsx'
import Spiral from './components/viz/Spiral.jsx'
import useCollatzStore from './store/useCollatzStore.js'

const VIZ = {
  path: SequencePath,
  heatmap: Heatmap,
  tree: ConvergenceTree,
  multi: MultiOverlay,
  spiral: Spiral,
}

export default function App() {
  const mode = useCollatzStore((s) => s.mode)
  const Viz = VIZ[mode]

  return (
    <Layout
      sidebar={
        <>
          <ModeSelector />
          <NumberInput />
          <StepControls />
          {mode === 'multi' && <CompareInput />}
          <RecordReplay />
          <ConjectureInfo />
        </>
      }
      main={
        <div className="flex flex-col gap-4 w-full h-full">
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <Viz />
          </div>
          <div className="shrink-0 border-t border-gray-200 pt-3 flex gap-6 overflow-x-auto">
            <div className="min-w-[120px]"><StatsPanel /></div>
            <div className="min-w-[200px]"><Histogram /></div>
            <div className="min-w-[140px]"><DelayTracker /></div>
            <div className="min-w-[180px]"><UnsolvedPanel /></div>
          </div>
        </div>
      }
    />
  )
}
