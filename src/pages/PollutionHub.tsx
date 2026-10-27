import React, { useState } from 'react'
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard'
import { Badge } from '../components/ui/Badge'
import {
  plasticPollutionData,
  radiationData,
  thermalPlantsData,
} from '../data/climateData'
import { Radiation, Factory, Droplets, Volume2, VolumeX } from 'lucide-react'

export const PollutionHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plastic' | 'radiation' | 'thermal'>('plastic')

  // Geiger counter state
  const [geigerActive, setGeigerActive] = useState(false)
  const [selectedExclusionZone, setSelectedExclusionZone] = useState(radiationData.exclusionZones[0])
  const [geigerClicks, setGeigerClicks] = useState(0)

  const handleToggleGeiger = () => {
    setGeigerActive(!geigerActive)
    if (!geigerActive) {
      setGeigerClicks((prev) => prev + Math.floor(Math.random() * 8 + 4))
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <Badge variant="critical" size="sm" pulse className="mb-2">
          HAZARD TELEMETRY HUB • GLOBAL ENVIRONMENTAL CHEMICAL OBSERVATORY
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)]">
          Planetary Pollution & Industrial Risk Observatory
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
          Granular real-time telemetry monitoring non-biodegradable synthetic polymers across oceanic gyres, ionizing environmental radionuclide decay chains, and flue gas chemistry from the global thermal coal fleet.
        </p>
      </div>

      {/* Sub-module Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('plastic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
            activeTab === 'plastic'
              ? 'bg-[#6EE7F9] text-black shadow-[0_0_20px_rgba(110,231,249,0.4)]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>Module A: Marine Plastic Gyres & Polymer Degradation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('radiation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
            activeTab === 'radiation'
              ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Radiation className="w-4 h-4" />
          <span>Module B: Radionuclide Decay & Exclusion Zones</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('thermal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
            activeTab === 'thermal'
              ? 'bg-[#FF2E88] text-white shadow-[0_0_20px_rgba(255,46,136,0.4)]'
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>Module C: Thermal Coal Fleet & Acid Gas Chemistry</span>
        </button>
      </div>

      {/* =========================================================
          TAB 1: OCEAN PLASTIC
          ========================================================= */}
      {activeTab === 'plastic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LiquidGlassCard className="p-5">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                Annual Ocean Influx Rate
              </span>
              <span className="text-3xl font-bold font-display text-[#6EE7F9]">
                {plasticPollutionData.oceanTonsPerYear}M Tons / yr
              </span>
              <span className="text-[11px] font-mono text-white/50 block mt-2">
                Equivalent to dumping 1 municipal garbage truck into the sea every minute
              </span>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-5">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                Floating Ocean Microplastic Particles
              </span>
              <span className="text-3xl font-bold font-display text-amber-300">
                {plasticPollutionData.totalFloatingPieces}
              </span>
              <span className="text-[11px] font-mono text-white/50 block mt-2">
                Insoluble synthetic fragments &lt; 5mm accumulating in pelagic gyres
              </span>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-5">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                Great Pacific Garbage Patch (GPGP)
              </span>
              <span className="text-3xl font-bold font-display text-rose-400">
                1.6M km² Area
              </span>
              <span className="text-[11px] font-mono text-white/50 block mt-2">
                Accumulation vortex 3x larger than the land surface area of France
              </span>
            </LiquidGlassCard>
          </div>

          {/* Child & Curious Mind Analogy */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-400/30 flex items-start gap-3 text-xs leading-relaxed">
            <span className="text-xl">🐢</span>
            <div>
              <strong className="text-cyan-200 block mb-0.5 font-bold">🧒 Why Plastic Never Truly Disappears:</strong>
              <p className="text-white/80">
                Unlike apple cores or paper that dissolve into garden dirt, plastic lasts hundreds of years! Ocean waves and sunshine break water bottles down into tiny colorful bits called <strong className="text-cyan-300">microplastics</strong>. Baby fish and sea turtles mistake them for floating jellyfish and eat them. That is why recycling and cleaning rivers is so important!
              </p>
            </div>
          </div>

          {/* Breakdown & Top Rivers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LiquidGlassCard className="p-6">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-4">
                Global Plastic Waste Disposal & Fate Breakdown
              </h3>
              <div className="space-y-3">
                {plasticPollutionData.recyclingBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-white/80">{item.category}</span>
                      <span className="font-bold text-white">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-[var(--text-secondary)] leading-relaxed">
                <strong className="text-white">Plastisphere Microbial Ecology:</strong> Bacteria and fungi colonize floating plastic substrates within hours, forming a biofilm ("the plastisphere") that absorbs persistent organic pollutants (POPs) including PCBs, DDT, and PAHs, magnifying chemical toxicity up the marine trophic web.
              </div>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-6">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-4">
                Top River Waste Conduits (Metric Tons / Year)
              </h3>
              <div className="space-y-3">
                {plasticPollutionData.topRivers.map((r) => (
                  <div
                    key={r.river}
                    className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                  >
                    <span className="text-xs font-mono text-white/80">{r.river}</span>
                    <span className="text-xs font-mono font-bold text-[#6EE7F9]">
                      {r.metricTons.toLocaleString()} t/yr
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-[var(--text-secondary)]">
                <strong className="text-white">Ekman Transport & Coriolis Gyres:</strong> Wind-driven Ekman currents in the Pacific cause surface waters to converge inward, trapping plastics in high-density surface slicks where solar UV radiation triggers brittle photo-oxidative fragmentation.
              </div>
            </LiquidGlassCard>
          </div>

          {/* Polymer Environmental Lifespan Table */}
          <LiquidGlassCard className="p-6">
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-4">
              Synthetic Polymer Environmental Persistence & Degradation Kinetics
            </h3>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-black/60 border-b border-white/10 text-[var(--text-muted)] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Polymer Class & Common Form</th>
                    <th className="p-3">Marine Half-Life</th>
                    <th className="p-3">Primary Environmental Degradation Mechanism</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[var(--text-secondary)]">
                  {plasticPollutionData.polymerLifespans.map((p) => (
                    <tr key={p.polymer} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-white">{p.polymer}</td>
                      <td className="p-3 text-rose-400 font-bold">{p.lifespanYears} Years</td>
                      <td className="p-3 text-white/70">{p.degradationMechanism}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LiquidGlassCard>
        </div>
      )}

      {/* =========================================================
          TAB 2: RADIOACTIVE MONITORING
          ========================================================= */}
      {activeTab === 'radiation' && (
        <div className="space-y-6">
          <LiquidGlassCard className="p-6 border-amber-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <Badge variant="warning" size="sm" className="mb-2">
                  SAFECAST TELEMETRY SENSOR GRID • 4,210 LIVE ACTIVE SENSORS
                </Badge>
                <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                  Environmental Radionuclide Monitor & Exclusion Zones
                </h3>
              </div>

              {/* Geiger Counter simulator button */}
              <button
                type="button"
                onClick={handleToggleGeiger}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                  geigerActive
                    ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse'
                    : 'bg-white/10 text-white/80 hover:bg-white/15 border border-white/20'
                }`}
              >
                {geigerActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{geigerActive ? 'GEIGER AUDIO ON (PULSING)' : 'TEST B-GEIGIE DETECTOR'}</span>
              </button>
            </div>

            {/* Child & Curious Mind Analogy */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-400/30 flex items-start gap-3 text-xs leading-relaxed my-3">
              <span className="text-xl">⚡</span>
              <div>
                <strong className="text-amber-200 block mb-0.5 font-bold">🧒 What are Geiger Clicks & Radiation?</strong>
                <p className="text-white/80">
                  Imagine tiny, invisible energy arrows flying through the air. A Geiger counter is like a mini musical drum that goes <strong className="text-amber-300">"CLICK!"</strong> every time an energy arrow hits it. Natural rocks make slow, safe clicks once every few seconds. But near old accident zones, the counter clicks rapidly like heavy rain, telling technicians to wear special protective suits!
                </p>
              </div>
            </div>

            {/* Radiation Physics Fundamentals Box */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-white/80 my-4 space-y-2">
              <span className="text-[10px] text-white/40 uppercase tracking-wider block">Ionizing Radiation Physics Constants</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-amber-400 font-bold block">Alpha Decay (α): ⁴₂He</span>
                  <span className="text-[10px] text-white/60">High linear energy transfer (LET). Stopped by skin, extreme hazard if inhaled (e.g. Pu-239).</span>
                </div>
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-cyan-400 font-bold block">Beta Decay (β⁻): ⁰₋₁e</span>
                  <span className="text-[10px] text-white/60">High-speed electron emitted from neutron conversion. Stopped by thin aluminum (e.g. Sr-90).</span>
                </div>
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-pink-400 font-bold block">Gamma Emission (γ): hν</span>
                  <span className="text-[10px] text-white/60">Massless high-frequency electromagnetic photon. Highly penetrating, requires dense lead (Cs-137: 662 keV).</span>
                </div>
              </div>
            </div>

            {/* Exclusion Zones Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {radiationData.exclusionZones.map((zone) => {
                const isSelected = selectedExclusionZone.name === zone.name
                const ratio = (zone.dose_uSv_h / zone.normalBaseline_uSv_h).toFixed(0)

                return (
                  <div
                    key={zone.name}
                    onClick={() => setSelectedExclusionZone(zone)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                        : 'bg-black/40 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-white/50">{zone.country}</span>
                        <Badge variant="critical">{ratio}x Baseline</Badge>
                      </div>

                      <h4 className="font-display font-bold text-base text-white mb-2">
                        {zone.name}
                      </h4>

                      <div className="space-y-1.5 font-mono text-xs mb-3">
                        <div className="flex justify-between">
                          <span className="text-white/60">Current Dose Rate:</span>
                          <span className="font-bold text-amber-400">{zone.dose_uSv_h} μSv/h</span>
                        </div>
                        <div className="flex justify-between text-white/40 text-[11px]">
                          <span>Normal Background:</span>
                          <span>{zone.normalBaseline_uSv_h} μSv/h</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-3">
                        {zone.physicsNotes}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-rose-300 truncate">
                      ☢️ {zone.keyIsotope}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Selected Zone Live Dossier */}
            <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  Active Detector Dossier: {selectedExclusionZone.name}
                </span>
                <p className="text-xs text-[var(--text-secondary)] font-mono">
                  {selectedExclusionZone.status}. Radiochemical signature: {selectedExclusionZone.keyIsotope}.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-xs text-white/70">
                  {geigerActive ? `Simulated Clicks: ${geigerClicks}` : 'B-Geigie Standby'}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      )}

      {/* =========================================================
          TAB 3: THERMAL POWER PLANTS
          ========================================================= */}
      {activeTab === 'thermal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <LiquidGlassCard className="p-5">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                Global Coal Fleet Operating
              </span>
              <span className="text-3xl font-bold font-display text-white">
                {thermalPlantsData.globalCoalPlantsOperating} Units
              </span>
              <span className="text-[11px] font-mono text-white/50 block mt-1">
                Individual coal-fired utility generating boilers
              </span>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-5">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                Total Installed Capacity
              </span>
              <span className="text-3xl font-bold font-display text-[#FFB020]">
                {thermalPlantsData.totalCapacityGW} GW
              </span>
              <span className="text-[11px] font-mono text-white/50 block mt-1">
                Megawatts electrical generating capacity
              </span>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-5">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                Annual SO₂ Acid Emissions
              </span>
              <span className="text-3xl font-bold font-display text-[#FF2E88]">
                {thermalPlantsData.annualSo2EmissionsMt} Mt
              </span>
              <span className="text-[11px] font-mono text-white/50 block mt-1">
                Sulfur dioxide precursor driving acid rain
              </span>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-5">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                Annual NOx Smog Precursors
              </span>
              <span className="text-3xl font-bold font-display text-rose-400">
                {thermalPlantsData.annualNoxEmissionsMt} Mt
              </span>
              <span className="text-[11px] font-mono text-white/50 block mt-1">
                Nitrogen oxides catalyzing ground-level ozone
              </span>
            </LiquidGlassCard>
          </div>

          {/* Child & Curious Mind Analogy */}
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-400/30 flex items-start gap-3 text-xs leading-relaxed">
            <span className="text-xl">🏭</span>
            <div>
              <strong className="text-rose-200 block mb-0.5 font-bold">🧒 How Smokestack Scrubbers Wash the Sky:</strong>
              <p className="text-white/80">
                Burning black coal for power is like having millions of dusty bonfires blowing yellow acid smoke into the sky. Modern clean plants install <strong className="text-rose-300">giant showers</strong> inside the smokestacks! Water mixed with crushed chalk/limestone washes the smoke, turning the dirty acid gas into drywall gypsum that builders use to build houses!
              </p>
            </div>
          </div>

          {/* Combustion Chemistry & Flue Gas Desulfurization */}
          <LiquidGlassCard className="p-6">
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-3">
              Combustion Chemistry & Flue Gas Treatment Thermodynamics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                <span className="text-amber-400 font-bold block">Wet Limestone Flue Gas Desulfurization (FGD)</span>
                <div className="p-2 rounded bg-white/5 text-[11px] text-white/90">
                  CaCO₃ (limestone) + SO₂ + ½ O₂ + 2 H₂O → CaSO₄·2H₂O (gypsum) + CO₂
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Wet slurry scrubbers spray powdered calcium carbonate into hot exhaust gas, removing 95–99% of sulfur dioxide by precipitating synthetic wallboard-grade gypsum.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                <span className="text-cyan-400 font-bold block">Selective Catalytic Reduction (SCR) for NOx</span>
                <div className="p-2 rounded bg-white/5 text-[11px] text-white/90">
                  4 NO + 4 NH₃ (ammonia) + O₂ → 4 N₂ + 6 H₂O
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Injecting aqueous ammonia over titanium/vanadium oxide catalyst beds at 300–400°C reduces nitric oxides into harmless molecular nitrogen gas and water vapor.
                </p>
              </div>
            </div>
          </LiquidGlassCard>

          {/* Regional Clusters Table */}
          <LiquidGlassCard className="p-6">
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-4">
              Major Thermal Fleet Super-Clusters & Retirement Trajectories
            </h3>
            <div className="space-y-3">
              {thermalPlantsData.topClusters.map((cluster) => (
                <div
                  key={cluster.country}
                  className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {cluster.country}
                    </h4>
                    <span className="text-xs font-mono text-amber-300">
                      {cluster.status}
                    </span>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="font-bold text-lg text-white">
                      {cluster.capacityGW} GW
                    </span>
                    <span className="text-white/40 block text-[10px]">Total Installed Generating Capacity</span>
                  </div>
                </div>
              ))}
            </div>
          </LiquidGlassCard>
        </div>
      )}
    </div>
  )
}
