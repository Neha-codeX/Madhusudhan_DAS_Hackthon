import React, { useState } from 'react'
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard'
import { Badge } from '../components/ui/Badge'
import { Split, Satellite, Layers, Camera } from 'lucide-react'

interface BeforeAfterItem {
  id: string
  title: string
  location: string
  yearBefore: string
  yearAfter: string
  beforeImg: string
  afterImg: string
  description: string
  satelliteSource: string
  spectralBands: string
  impact: string
}

export const Gallery: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50)
  const [activeCase, setActiveCase] = useState<number>(0)

  const cases: BeforeAfterItem[] = [
    {
      id: 'muir',
      title: 'Muir Glacier Calving Retreat',
      location: 'Glacier Bay National Park, Alaska, USA (58.95°N, 136.14°W)',
      yearBefore: '1941 (Historical Survey)',
      yearAfter: '2024 (USGS / Sentinel-2 Repeat Imagery)',
      beforeImg: 'linear-gradient(135deg, #1e3a5f 0%, #a5f3fc 100%)',
      afterImg: 'linear-gradient(135deg, #071828 0%, #155e75 50%, #164e63 100%)',
      description:
        'In 1941, the massive glacier filled the entire fjord with over 200 vertical meters of solid ice. By 2024, the glacier had retreated over 12 kilometers out of view, replaced by ocean seawater and dense alder shrubland.',
      satelliteSource: 'USGS Repeat Photography Archive & Copernicus Sentinel-2 MSI',
      spectralBands: 'Bands 8 (NIR) & 4 (Red) - False color snow/vegetation contrast',
      impact: '12 km total glacial retreat & complete fjord marine replacement',
    },
    {
      id: 'aral',
      title: 'Aral Sea Desiccation Catastrophe',
      location: 'Kazakhstan / Uzbekistan Border (45.00°N, 60.00°E)',
      yearBefore: '2000 (NASA Terra MODIS)',
      yearAfter: '2024 (NASA Aqua MODIS & Landsat 9)',
      beforeImg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      afterImg: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
      description:
        'Once the fourth largest lake on Earth (68,000 km²), river diversions for Soviet cotton irrigation caused 90% of the surface area to evaporate into toxic salt and dust flats now designated the Aralkum Desert.',
      satelliteSource: 'NASA Earth Observatory (Terra/Aqua MODIS)',
      spectralBands: 'Shortwave Infrared (SWIR Band 7) & Near-Infrared (NIR Band 2)',
      impact: '60,000+ km² water surface converted to toxic saline desert sand',
    },
    {
      id: 'amazon-rondonia',
      title: 'Rondônia Fishbone Deforestation Frontier',
      location: 'Southern Brazilian Amazon, Brazil (10.94°S, 62.82°W)',
      yearBefore: '1984 (Landsat 5 Thematic Mapper)',
      yearAfter: '2024 (Landsat 9 OLI-2 & Sentinel-2)',
      beforeImg: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
      afterImg: 'linear-gradient(135deg, #713f12 0%, #15803d 40%, #ca8a04 100%)',
      description:
        'Penetration of federal highway BR-364 established herringbone clearing corridors cutting into virgin primary rainforest. Over 40 years, systematic slash-and-burn clearing converted canopy into cattle ranches.',
      satelliteSource: 'USGS / NASA Landsat 5 & 9 Collection 2 Level-2 Surface Reflectance',
      spectralBands: 'NDVI (NIR - Red) / (NIR + Red) Canopy Absorption Index',
      impact: 'Over 68% of local primary canopy permanently fragmented',
    },
    {
      id: 'lake-mead',
      title: 'Lake Mead "Bathtub Ring" Depletion',
      location: 'Nevada / Arizona, USA (Colorado River, 36.02°N, 114.74°W)',
      yearBefore: '2000 (Full Pool Reservoir Capacity)',
      yearAfter: '2024 (Historic Low Elevation Levels)',
      beforeImg: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
      afterImg: 'linear-gradient(135deg, #451a03 0%, #0369a1 60%)',
      description:
        'A multi-decadal megadrought across the American Southwest paired with overallocation caused Lake Mead to plunge to just 27% of capacity, exposing white mineralized calcium carbonate rings over 40 meters high.',
      satelliteSource: 'NASA Landsat 7 & 9 / USGS Bureau of Reclamation Gauge Data',
      spectralBands: 'Normalized Difference Water Index (NDWI) Green & NIR',
      impact: 'Storage capacity dropped by 73%; hydroelectric head reduced',
    },
    {
      id: 'thwaites',
      title: 'Thwaites Glacier Marine Ice Shelf Fracture',
      location: 'Amundsen Sea Embayment, West Antarctica (75.5°S, 106.75°W)',
      yearBefore: '2001 (Radarsat-1 Synthetic Aperture Radar)',
      yearAfter: '2024 (Sentinel-1 SAR & CryoSat-2)',
      beforeImg: 'linear-gradient(135deg, #0c4a6e 0%, #e0f2fe 100%)',
      afterImg: 'linear-gradient(135deg, #032035 0%, #38bdf8 40%, #0f172a 100%)',
      description:
        'Warm Circumpolar Deep Water (CDW) at +1.5°C is intruding underneath the grounding line, melting the ice shelf from beneath. Massive longitudinal fracture rifts spanning over 40 kilometers are destabilizing the pinned ice tongue.',
      satelliteSource: 'ESA Copernicus Sentinel-1 C-band SAR & NASA ICESat-2 ATLAS Lidar',
      spectralBands: 'SAR Backscatter Coherence & InSAR Surface Velocity Strain Rates',
      impact: 'Grounding line retreat of 14km; holds 65cm of global sea rise alone',
    },
    {
      id: 'petermann',
      title: 'Petermann Glacier Fjord Ice Island Calving',
      location: 'Northwest Greenland Fjord (81.00°N, 61.00°W)',
      yearBefore: '2010 (Pre-Calving Ice Tongue)',
      yearAfter: '2024 (Multi-Mega Calving Events)',
      beforeImg: 'linear-gradient(135deg, #0369a1 0%, #cffafe 100%)',
      afterImg: 'linear-gradient(135deg, #04111f 0%, #0284c7 50%, #e0f2fe 100%)',
      description:
        'In August 2010 and July 2012, massive ice islands four times the size of Manhattan (260 km² and 130 km²) detached from Petermann\'s floating tongue as basal melt channels thinned the structural margins.',
      satelliteSource: 'NASA Terra MODIS & ESA Sentinel-2 MSI',
      spectralBands: 'Visible True Color (Bands 4, 3, 2) & Thermal Infrared TIRS',
      impact: 'Lost 40% of its floating ice shelf length within 24 months',
    },
  ]

  const current = cases[activeCase]

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <Badge variant="accent" size="sm" className="mb-2">
          ORBITAL MULTI-SPECTRAL OBSERVATORY
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)]">
          Planetary Evidence & Satellite Observation Gallery
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
          Rigorous visual and radiometric documentation of Earth's rapid geographic, glaciological, and ecological phase changes captured by continuous Landsat, Sentinel, and MODIS space missions.
        </p>
      </div>

      {/* Case Studies Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {cases.map((c, idx) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setActiveCase(idx)
              setSliderPos(50)
            }}
            className={`px-4 py-2 rounded-xl font-mono text-xs transition-all ${
              activeCase === idx
                ? 'bg-[var(--accent)] text-black font-bold shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Interactive Before / After Split Slider Card */}
      <LiquidGlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
              {current.title}
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mt-1">
              <span>{current.location}</span>
              <span>•</span>
              <span className="text-[var(--accent)]">{current.impact}</span>
            </div>
          </div>
          <Badge variant="warning">
            DRAG SLIDER TO REVEAL DECADAL PHASE SHIFT
          </Badge>
        </div>

        {/* Visual Split Screen Viewport */}
        <div className="relative aspect-[16/9] max-h-[520px] w-full rounded-2xl overflow-hidden select-none border border-white/15 shadow-2xl">
          {/* AFTER (Background Layer) */}
          <div
            className="absolute inset-0 w-full h-full flex flex-col justify-end p-6 text-white"
            style={{ background: current.afterImg }}
          >
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-rose-500/40 text-xs font-mono text-rose-300 font-bold">
              CURRENT ERA: {current.yearAfter}
            </div>
          </div>

          {/* BEFORE (Clipped Foreground Layer) */}
          <div
            className="absolute inset-0 h-full overflow-hidden flex flex-col justify-end p-6 text-white transition-none"
            style={{
              width: `${sliderPos}%`,
              background: current.beforeImg,
              borderRight: '2px solid #ffffff',
            }}
          >
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-xs font-mono text-cyan-300 font-bold">
              HISTORICAL BASELINE: {current.yearBefore}
            </div>
          </div>

          {/* Slider Handle Divider */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-black border-2 border-white flex items-center justify-center shadow-lg text-white">
              <Split className="w-4 h-4" />
            </div>
          </div>

          {/* Interactive Range Input Overlay for Dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(parseInt(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
          />
        </div>

        {/* Scientific Details Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
          <div className="md:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold mb-2">
              Observational Summary & Ecological Assessment
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {current.description}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
              Satellite Sensor & Spectral Processing
            </span>
            <span className="font-mono text-xs text-[var(--accent)] font-semibold block">
              {current.satelliteSource}
            </span>
            <span className="font-mono text-[10px] text-white/50 block">
              {current.spectralBands}
            </span>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Satellite Remote Sensing Principles Section */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold block">
            Orbital Earth Observation Physics
          </span>
          <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
            Spectral Radiometry & Radar Interferometry Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LiquidGlassCard className="p-6 border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display font-bold text-base text-white">
                Normalized Difference Vegetation Index (NDVI)
              </h3>
            </div>
            <div className="p-2.5 rounded bg-black/60 border border-white/10 font-mono text-xs text-emerald-300 font-bold mb-3">
              NDVI = (NIR - Red) / (NIR + Red)
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Healthy chlorophyll cells in live green vegetation absorb visible red light (0.66 µm) for photosynthesis while strongly scattering near-infrared light (0.86 µm). As canopy desiccates or is burned, NIR reflectance collapses while red reflectance spikes.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard className="p-6 border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Satellite className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-bold text-base text-white">
                Interferometric Synthetic Aperture Radar (InSAR)
              </h3>
            </div>
            <div className="p-2.5 rounded bg-black/60 border border-white/10 font-mono text-xs text-cyan-300 font-bold mb-3">
              Δφ = (4π / λ) · ΔR + φ_topography
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Active radar satellites (Sentinel-1, NISAR) emit microwave pulses that penetrate clouds, polar darkness, and dry snow. Comparing phase shifts (Δφ) between repeat orbital passes detects millimeter-scale ground displacement, ice shelf creep, and fault slip.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard className="p-6 border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-bold text-base text-white">
                Thermal Infrared Split-Window Radiometry (TIRS)
              </h3>
            </div>
            <div className="p-2.5 rounded bg-black/60 border border-white/10 font-mono text-xs text-amber-300 font-bold mb-3">
              L_λ = ε · B_λ(T)  (Planck's Law)
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Landsat TIRS and MODIS measure longwave thermal radiation emitted by Earth's surface across 10.5–12.5 µm channels. Atmospheric moisture absorption is eliminated via dual-channel split-window algorithms to monitor surface heatwaves and forest fire fronts.
            </p>
          </LiquidGlassCard>
        </div>
      </section>
    </div>
  )
}
