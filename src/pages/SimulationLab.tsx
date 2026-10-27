import React, { useState } from 'react'
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard'
import { Badge } from '../components/ui/Badge'
import { Waves, TreePine, Flame, RotateCcw } from 'lucide-react'

export const SimulationLab: React.FC = () => {
  const [activeSim, setActiveSim] = useState<'sea-level' | 'forest' | 'net-zero'>('sea-level')

  // 1. Sea Level Rise Simulator State
  const [tempAnomaly, setTempAnomaly] = useState<number>(2.0)

  // Calculations based on IPCC AR6 Working Group 1 SLR projections
  // Thermal expansion (~40%) + Greenland melt (~30%) + Antarctica melt (~20%) + Mountain glaciers (~10%)
  const seaRiseMm = Math.round(tempAnomaly * 280) // 2.0°C -> ~560mm
  const displacedPopulationMillions = Math.round(tempAnomaly * 82) // ~164M people
  const economicLossTrillions = (tempAnomaly * 4.2).toFixed(1) // $8.4T

  const coastalCitiesAtRisk = [
    {
      name: 'Miami & South Florida, USA',
      risk: tempAnomaly > 2.0 ? 'Catastrophic' : 'Severe',
      floodPcnt: Math.min(100, Math.round(tempAnomaly * 28)),
      geology: 'Porous oolitic Biscayne limestone aquifer. Seawater flows underneath standard seawalls during "Sunny Day" king tides.',
      populationAtRisk: '2.8 Million residents',
    },
    {
      name: 'Venice & Venetian Lagoon, Italy',
      risk: tempAnomaly > 1.8 ? 'Catastrophic' : 'Severe',
      floodPcnt: Math.min(100, Math.round(tempAnomaly * 34)),
      geology: 'Compacted alluvial marsh mud coupled with historical groundwater extraction subsidence. MOSE barrier gates operational.',
      populationAtRisk: '260,000 residents',
    },
    {
      name: 'Mumbai, Maharashtra, India',
      risk: tempAnomaly > 2.5 ? 'Severe' : 'Moderate',
      floodPcnt: Math.min(100, Math.round(tempAnomaly * 22)),
      geology: 'Built across seven reclaimed islands. Coincident monsoon deluge (400mm/day) + Arabian Sea storm surges overwhelm Mithi River.',
      populationAtRisk: '12.4 Million residents',
    },
    {
      name: 'Shanghai, Yangtze River Delta, China',
      risk: tempAnomaly > 2.0 ? 'Severe' : 'Moderate',
      floodPcnt: Math.min(100, Math.round(tempAnomaly * 24)),
      geology: 'Deltaic silt plain averaging 3 to 4 meters above sea level. Protected by massive coastal dykes but facing river backwater flooding.',
      populationAtRisk: '17.5 Million residents',
    },
    {
      name: 'Alexandria & Nile Delta, Egypt',
      risk: tempAnomaly > 2.2 ? 'Catastrophic' : 'Severe',
      floodPcnt: Math.min(100, Math.round(tempAnomaly * 30)),
      geology: 'Nile Delta sinking by 3–5 mm/year due to Aswan High Dam sediment starvation. Saltwater intrusion sterilizes agricultural fertile soils.',
      populationAtRisk: '5.2 Million residents',
    },
    {
      name: 'Rotterdam & Rhine Delta, Netherlands',
      risk: tempAnomaly > 3.0 ? 'Severe' : 'Protected (Engineered)',
      floodPcnt: Math.min(100, Math.round(tempAnomaly * 15)),
      geology: 'Polder topography sitting up to 6.7 meters below sea level. Defended by world-class Maeslantkering storm surge barriers.',
      populationAtRisk: '1.4 Million residents',
    },
  ]

  // 2. Forest Moratorium Simulator State
  const [loggingRate, setLoggingRate] = useState<number>(50) // % of current logging
  const [reforestationEffort, setReforestationEffort] = useState<number>(30) // Million ha/yr

  // Forest projection by 2050
  const forestCover2050 = Math.min(
    100,
    Math.max(20, Math.round(68 - (loggingRate / 100) * 28 + (reforestationEffort / 50) * 22))
  )
  const isNetSink = reforestationEffort * 1.5 > loggingRate * 0.8
  const carbonSequestrationGt = (isNetSink ? ((reforestationEffort * 1.5 - loggingRate * 0.8) * 0.08) : -((loggingRate * 0.8 - reforestationEffort * 1.5) * 0.08)).toFixed(2)

  // 3. Net Zero Accelerator State
  const [gridCleanPct, setGridCleanPct] = useState<number>(60)
  const [transportEvPct, setTransportEvPct] = useState<number>(45)
  const [industryDecarbPct, setIndustryDecarbPct] = useState<number>(35)

  const compositeDecarb = Math.round(gridCleanPct * 0.4 + transportEvPct * 0.3 + industryDecarbPct * 0.3)
  const estimatedNetZeroYear = Math.max(2035, Math.min(2090, Math.round(2085 - compositeDecarb * 0.55)))
  const peakWarmingEst = (1.5 + Math.max(0, (estimatedNetZeroYear - 2040) * 0.025)).toFixed(2)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <Badge variant="accent" size="sm" className="mb-2">
          IPCC AR6 INTEGRATED ASSESSMENT MODELING (IAM)
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)]">
          Planetary Simulation & Tipping Point Lab
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
          Parameterize multi-decadal climate trajectories using peer-reviewed equations governing thermosteric sea-level expansion, biotic carbon sink equilibrium, and multi-sectoral Net Zero energy transition schedules.
        </p>
      </div>

      {/* Simulator Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveSim('sea-level')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
            activeSim === 'sea-level'
              ? 'bg-[#6EE7F9] text-black shadow-[0_0_20px_rgba(110,231,249,0.4)]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Waves className="w-4 h-4" />
          <span>Module 1: Sea-Level Inundation & Coastal Megacities</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSim('forest')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
            activeSim === 'forest'
              ? 'bg-[#22C55E] text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          <TreePine className="w-4 h-4" />
          <span>Module 2: Tropical Forest Moratorium & Biosphere Sink</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSim('net-zero')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
            activeSim === 'net-zero'
              ? 'bg-[#FFB020] text-black shadow-[0_0_20px_rgba(255,176,32,0.4)]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Module 3: Multi-Sector Net Zero Acceleration</span>
        </button>
      </div>

      {/* =========================================================
          MODULE 1: SEA LEVEL RISE SIMULATOR
          ========================================================= */}
      {activeSim === 'sea-level' && (
        <div className="space-y-6">
          <LiquidGlassCard className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                  Thermosteric & Cryospheric Sea-Level Inundation Modeler
                </h3>
                <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
                  Parameterized against IPCC AR6 Chapter 9 sea level projections integrating steric expansion and dynamical ice sheet discharge.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTempAnomaly(1.5)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white/70 border border-white/10 transition-colors w-fit"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Paris 1.5°C Benchmark</span>
              </button>
            </div>

            {/* Governing Physics Equation Box */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-white/80 my-4 space-y-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider block">Governing Geophysical Law</span>
              <div className="text-sm font-bold text-cyan-300">
                ΔSLR = ΔV_thermosteric (∫ β·ΔT·dz) + ΔM_Greenland + ΔM_Antarctica + ΔM_Glaciers
              </div>
              <p className="text-[11px] text-white/60">
                Water expands as it warms (thermal coefficient β ≈ 2.1 × 10⁻⁴ K⁻¹ at 15°C). Polar ice sheet mass loss currently contributes 58% of observed sea rise acceleration.
              </p>
            </div>

            {/* Slider */}
            <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs text-[var(--text-secondary)]">
                  Global Mean Surface Temperature Anomaly:
                </span>
                <span className="text-xl font-bold text-[#6EE7F9]">
                  +{tempAnomaly.toFixed(1)}°C Above Pre-Industrial Baseline
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.1"
                value={tempAnomaly}
                onChange={(e) => setTempAnomaly(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#6EE7F9]"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/50">
                <span>+1.0°C (Pre-2015)</span>
                <span className="text-emerald-400 font-bold">+1.5°C (Paris Guardrail)</span>
                <span className="text-amber-400 font-bold">+2.0°C (Severe Tipping)</span>
                <span className="text-rose-400 font-bold">+4.0°C (Runaway SSP5-8.5)</span>
              </div>
            </div>

            {/* Calculated Impact Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                  Global Mean Sea Level Rise
                </span>
                <span className="text-3xl font-bold font-display text-[#6EE7F9]">
                  +{seaRiseMm} mm
                </span>
                <span className="text-[11px] font-mono text-white/50 block mt-1">
                  ({(seaRiseMm / 10).toFixed(1)} cm / {(seaRiseMm / 25.4).toFixed(1)} inches)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                  Displaced Coastal Population
                </span>
                <span className="text-3xl font-bold font-display text-rose-400">
                  {displacedPopulationMillions} Million
                </span>
                <span className="text-[11px] font-mono text-white/50 block mt-1">
                  Direct annual high-tide coastal flooding
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                  Cumulative Infrastructure Asset Loss
                </span>
                <span className="text-3xl font-bold font-display text-amber-300">
                  ${economicLossTrillions} Trillion
                </span>
                <span className="text-[11px] font-mono text-white/50 block mt-1">
                  Port infrastructure & real estate damage
                </span>
              </div>
            </div>
          </LiquidGlassCard>

          {/* Megacity Vulnerability Matrix */}
          <LiquidGlassCard className="p-6">
            <h4 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">
              Coastal Megacity Inundation & Geological Vulnerability Dossier
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mb-4 font-mono">
              Specific geological and deltaic vulnerability factors exacerbating relative sea level rise in major coastal population centers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coastalCitiesAtRisk.map((c) => (
                <div
                  key={c.name}
                  className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-semibold text-white text-sm">
                        {c.name}
                      </span>
                      <Badge variant={c.risk === 'Catastrophic' ? 'critical' : c.risk === 'Severe' ? 'warning' : 'neutral'}>
                        {c.risk}
                      </Badge>
                    </div>
                    <div className="text-[11px] font-mono text-amber-300/80 mb-2">
                      Population at Risk: {c.populationAtRisk}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-3">
                      {c.geology}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-1">
                      <span>Low-lying flood probability:</span>
                      <span className="text-white font-bold">{c.floodPcnt}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full ${
                          c.floodPcnt > 60
                            ? 'bg-rose-500'
                            : c.floodPcnt > 35
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${c.floodPcnt}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </LiquidGlassCard>
        </div>
      )}

      {/* =========================================================
          MODULE 2: FOREST CANOPY SIMULATOR
          ========================================================= */}
      {activeSim === 'forest' && (
        <div className="space-y-6">
          <LiquidGlassCard className="p-6">
            <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-1">
              Tropical Forest "Cut vs. Protect" Biosphere Equilibrium Simulator
            </h3>
            <p className="text-xs font-mono text-[var(--text-muted)] mb-4">
              Simulate international conservation treaties, logging moratoria, and large-scale afforestation campaigns to project forest canopy coverage by 2050.
            </p>

            <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-white/80 my-4 space-y-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider block">Biotic Carbon Balance Equation</span>
              <div className="text-sm font-bold text-emerald-300">
                NEP = GPP - (R_autotrophic + R_heterotrophic) | Tipping Threshold: 20% - 25% Deforested
              </div>
              <p className="text-[11px] text-white/60">
                Net Ecosystem Productivity (NEP) drops below zero when drought and clearing cause tree mortality respiration (R_heterotrophic) to surpass gross photosynthetic carbon uptake (GPP).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Slider 1 */}
              <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs text-[var(--text-secondary)]">
                    Industrial Logging & Agricultural Clearing:
                  </span>
                  <span className="text-sm font-bold text-amber-400">
                    {loggingRate}% of current rate
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={loggingRate}
                  onChange={(e) => setLoggingRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/50">
                  <span className="text-emerald-400 font-bold">0% (Global Moratorium)</span>
                  <span>50% (Halved Clearing)</span>
                  <span className="text-rose-400 font-bold">100% (Business as Usual)</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs text-[var(--text-secondary)]">
                    Active Reforestation & Ecosystem Restoration:
                  </span>
                  <span className="text-sm font-bold text-[#22C55E]">
                    {reforestationEffort} Million Hectares / Year
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="2"
                  value={reforestationEffort}
                  onChange={(e) => setReforestationEffort(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#22C55E]"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/50">
                  <span>0 Mha/yr</span>
                  <span>25 Mha/yr (Bonn Challenge)</span>
                  <span className="text-[#22C55E] font-bold">50 Mha/yr (Aggressive)</span>
                </div>
              </div>
            </div>

            {/* Projected Outcome Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                  Canopy Remaining in 2050
                </span>
                <span className="text-3xl font-bold font-display text-[#22C55E]">
                  {forestCover2050}%
                </span>
                <span className="text-[11px] font-mono text-white/50 block mt-1">
                  vs 68% today (Savannization point: 22%)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                  Net Biosphere Carbon Flux
                </span>
                <span className={`text-2xl font-bold font-display ${isNetSink ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isNetSink ? `-${carbonSequestrationGt} Gt CO₂/yr` : `+${Math.abs(parseFloat(carbonSequestrationGt))} Gt CO₂/yr`}
                </span>
                <span className="text-[11px] font-mono text-white/50 block mt-1">
                  {isNetSink ? 'Active global carbon sink' : 'Net source emitting to atmosphere'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                  IUCN Biodiversity Stability
                </span>
                <span className={`text-2xl font-bold font-display ${forestCover2050 > 65 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {forestCover2050 > 65 ? 'STABILIZED' : 'MASS EXTINCTION'}
                </span>
                <span className="text-[11px] font-mono text-white/50 block mt-1">
                  Endemic mammal & avian survival index
                </span>
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      )}

      {/* =========================================================
          MODULE 3: NET ZERO ACCELERATOR
          ========================================================= */}
      {activeSim === 'net-zero' && (
        <div className="space-y-6">
          <LiquidGlassCard className="p-6">
            <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-1">
              Integrated Net Zero Carbon Budget & Decarbonization Accelerator
            </h3>
            <p className="text-xs font-mono text-[var(--text-muted)] mb-4">
              Simulate decarbonization rates across primary economic sectors to calculate remaining planetary carbon budget and predicted peak warming.
            </p>

            <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-white/80 my-4 space-y-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider block">Arrhenius Radiative Forcing Equation</span>
              <div className="text-sm font-bold text-amber-300">
                ΔF = 5.35 · ln(C / 280)  |  Remaining 1.5°C Budget: ~250 Gt CO₂ (~6 years of current emissions)
              </div>
              <p className="text-[11px] text-white/60">
                Peak warming is directly proportional to cumulative net fossil CO₂ emissions released since the industrial revolution (TCRE ≈ 0.45°C per 1,000 Gt CO₂).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-white/70">Grid Clean Power:</span>
                  <span className="font-bold text-[#FFB020]">{gridCleanPct}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={gridCleanPct}
                  onChange={(e) => setGridCleanPct(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded accent-[#FFB020] cursor-pointer"
                />
                <span className="text-[10px] font-mono text-white/40 block">Solar, wind, nuclear, hydro</span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-white/70">Transport Fleet Electrification:</span>
                  <span className="font-bold text-[#6EE7F9]">{transportEvPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={transportEvPct}
                  onChange={(e) => setTransportEvPct(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded accent-[#6EE7F9] cursor-pointer"
                />
                <span className="text-[10px] font-mono text-white/40 block">EVs, electric rail, hydrogen flight</span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-white/70">Heavy Industry Decarbonization:</span>
                  <span className="font-bold text-[#FF2E88]">{industryDecarbPct}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={industryDecarbPct}
                  onChange={(e) => setIndustryDecarbPct(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded accent-[#FF2E88] cursor-pointer"
                />
                <span className="text-[10px] font-mono text-white/40 block">Green steel H₂-DRI, cement CCUS</span>
              </div>
            </div>

            {/* Net Zero Result Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                  Projected Global Net Zero Year
                </span>
                <span className="text-3xl font-bold font-display text-[#FFB020]">
                  Year {estimatedNetZeroYear}
                </span>
                <span className="text-[11px] font-mono text-white/50 block mt-1">
                  {estimatedNetZeroYear <= 2050 ? 'Paris 1.5°C Compliant Trajectory' : 'High overshoot warming risk'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                  Peak Warming Anomaly
                </span>
                <span className={`text-3xl font-bold font-display ${parseFloat(peakWarmingEst) <= 1.7 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  +{peakWarmingEst}°C
                </span>
                <span className="text-[11px] font-mono text-white/50 block mt-1">
                  IPCC AR6 median equilibrium temperature
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                  Planetary Carbon Budget Status
                </span>
                <span className={`text-xl font-bold font-display ${estimatedNetZeroYear <= 2050 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {estimatedNetZeroYear <= 2050 ? 'BUDGET PRESERVED' : 'BUDGET EXHAUSTED'}
                </span>
                <span className="text-[11px] font-mono text-white/50 block mt-1">
                  {estimatedNetZeroYear <= 2050 ? 'Kept within 250 Gt CO₂ limit' : 'Requires carbon removal (CDR)'}
                </span>
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      )}
    </div>
  )
}
