import Layout from './components/Layout.jsx'
import ModeSelector from './components/controls/ModeSelector.jsx'
import NumberInput from './components/controls/NumberInput.jsx'
import RangeInput from './components/controls/RangeInput.jsx'
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
          <RangeInput />
          <StepControls />
          {mode === 'multi' && <CompareInput />}
          <RecordReplay />
          <ConjectureInfo />
        </>
      }
      main={
        <div className="flex flex-col w-full h-full overflow-hidden">
          <div className="flex-1 min-h-0 flex items-center justify-center p-4">
            <Viz />
          </div>
          <div className="shrink-0 border-t border-gray-200 pt-3 pb-3 px-4 grid grid-cols-[auto_1fr_auto_auto] gap-x-6 gap-y-2 items-start">
            <StatsPanel />
            <Histogram />
            <DelayTracker />
            <UnsolvedPanel />
          </div>
        </div>
      }
    />
  )
}
