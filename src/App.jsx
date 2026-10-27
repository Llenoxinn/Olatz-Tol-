import { useState } from 'react'
import Layout from './components/Layout.jsx'
import Intro from './components/Intro.jsx'
import MagicBento, { BentoCard } from './components/MagicBento.jsx'
import ModeTabs from './components/controls/ModeTabs.jsx'
import NumberField from './components/controls/NumberField.jsx'
import StepControls from './components/controls/StepControls.jsx'
import CompareInput from './components/controls/CompareInput.jsx'
import RecordReplay from './components/controls/RecordReplay.jsx'
import AboutDialog from './components/panels/AboutDialog.jsx'
import StatsPanel from './components/panels/StatsPanel.jsx'
import Histogram from './components/panels/Histogram.jsx'
import DelayTracker from './components/panels/DelayTracker.jsx'
import UnsolvedPanel from './components/panels/UnsolvedPanel.jsx'
import VizContainer from './components/viz/VizContainer.jsx'
import SequencePath from './components/viz/SequencePath.jsx'
import Heatmap from './components/viz/Heatmap.jsx'
import ConvergenceTree from './components/viz/ConvergenceTree.jsx'
import MultiOverlay from './components/viz/MultiOverlay.jsx'
import Spiral from './components/viz/Spiral.jsx'
import usePlayback from './hooks/usePlayback.js'
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
  const n = useCollatzStore((s) => s.n)
  const maxN = useCollatzStore((s) => s.maxN)
  const setN = useCollatzStore((s) => s.setN)
  const setMaxN = useCollatzStore((s) => s.setMaxN)
  const [intro, setIntro] = useState(true)
  usePlayback()

  const Viz = VIZ[mode]

  return (
    <>
      <Layout
        inert={intro}
        sidebar={
          <>
            <NumberField label="Starting number" value={n} onChange={setN} min={1} max={100000} sliderMax={10000} />
            <NumberField label="Range" value={maxN} onChange={setMaxN} min={100} max={50000} step={100} />
            {mode !== 'heatmap' && mode !== 'tree' && <StepControls />}
            {mode === 'multi' && <CompareInput />}
            <RecordReplay />
            <AboutDialog />
          </>
        }
        main={
          <>
            <div className="flex h-[62svh] min-h-80 shrink-0 flex-col md:h-auto md:min-h-[360px] md:flex-1 md:shrink">
              <ModeTabs />
              <div id="viz-panel" role="tabpanel" aria-labelledby={`mode-tab-${mode}`} className="min-h-0 flex-1">
                <VizContainer>{(size) => <Viz w={size.w} h={size.h} />}</VizContainer>
              </div>
            </div>
            <div className="shrink-0">
              <MagicBento
                columns={4}
                rowHeight={200}
                gap={12}
                radius={20}
                enableBorderGlow={true}
                enableSpotlight={true}
                spotlightRadius={300}
                clickEffect={true}
              >
                <BentoCard><StatsPanel /></BentoCard>
                <BentoCard><Histogram /></BentoCard>
                <BentoCard><DelayTracker /></BentoCard>
                <BentoCard><UnsolvedPanel /></BentoCard>
              </MagicBento>
            </div>
          </>
        }
      />
      {intro && <Intro onDone={() => setIntro(false)} />}
    </>
  )
}
