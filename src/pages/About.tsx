import React from 'react'
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard'
import { Badge } from '../components/ui/Badge'
import { ExternalLink, Database, Code, Globe, BookOpen } from 'lucide-react'

export const About: React.FC = () => {
  const sources = [
    {
      name: 'NOAA Global Monitoring Laboratory (GML)',
      metric: 'Atmospheric CO₂ & CH₄ Flask Records',
      frequency: 'Daily In-Situ Sampling',
      station: 'Mauna Loa Observatory, Hawaii (3,400m altitude)',
      license: 'Public Domain (US Govt)',
      url: 'https://gml.noaa.gov/ccgg/trends/',
      notes: 'Direct non-dispersive infrared (NDIR) spectroscopic gas analysis with calibrated WMO mole fraction scales.',
    },
    {
      name: 'NASA Goddard Institute for Space Studies (GISTEMP)',
      metric: 'Global Surface Temperature Anomaly',
      frequency: 'Monthly Gridded Analysis (250km grid resolution)',
      station: 'Global GHCNv4 weather stations + ERSSTv5 oceanic buoys',
      license: 'Public Domain (NASA Open Data)',
      url: 'https://data.giss.nasa.gov/gistemp/',
      notes: 'Anomalies normalized relative to 1850-1900 pre-industrial baseline with urban heat island corrections.',
    },
    {
      name: 'National Snow & Ice Data Center (NSIDC)',
      metric: 'Arctic & Antarctic Sea Ice Extent',
      frequency: 'Daily Passive Microwave Satellites',
      station: 'DMSP SSMIS & AMSR2 radiometers',
      license: 'Open Access CC-BY 4.0',
      url: 'https://nsidc.org/data/seaice_index',
      notes: 'Calculated using NASA Team and Bootstrap algorithm consensus measuring sea area with >15% ice concentration.',
    },
    {
      name: 'Global Forest Watch (WRI & Univ. of Maryland)',
      metric: 'Global Tree Cover Loss & Primary Canopy',
      frequency: 'Annual Landsat & Sentinel-2 composite',
      station: 'Global tropical & boreal biomes (30m resolution)',
      license: 'Creative Commons Attribution 4.0',
      url: 'https://www.globalforestwatch.org/',
      notes: 'Hansen et al. Landsat time-series analysis detecting canopy removal (>30% canopy density threshold).',
    },
    {
      name: 'Our World In Data & Global Carbon Project',
      metric: 'National Fossil Emissions & Sector Mix',
      frequency: 'Annual Synthesis Release',
      station: 'CDIAC, UNFCCC & BP statistical reviews',
      license: 'Creative Commons CC-BY',
      url: 'https://ourworldindata.org/co2-and-greenhouse-gas-emissions',
      notes: 'Territorial and consumption-based carbon accounting protocols across fossil fuel, cement, and gas flaring.',
    },
    {
      name: 'Safecast Open Environmental Network',
      metric: 'Ambient Ionizing Radiation Dose Rate',
      frequency: 'Real-time API Sensor Feed',
      station: '4,210+ bGeigie mobile & fixed sensors worldwide',
      license: 'CC0 1.0 Public Domain',
      url: 'https://safecast.org/',
      notes: 'Independent citizen-science ionizing radiation monitoring using LND 7317 pancake Geiger-Müller tubes.',
    },
    {
      name: 'International Atomic Energy Agency (IAEA PRIS)',
      metric: 'Nuclear Power Reactor Operational Metrics & SMRs',
      frequency: 'Continuous Utility Registry',
      station: '438 civilian reactors worldwide in 32 nations',
      license: 'IAEA Open Statistical Database',
      url: 'https://pris.iaea.org/',
      notes: 'Net electrical capacity (MWe), load factors, cumulative electricity supplied, and unplanned capability loss factors.',
    },
  ]

  const physicalFormulas = [
    {
      title: 'Arrhenius Greenhouse Radiative Forcing',
      formula: 'ΔF = α · ln(C / C₀) = 5.35 · ln(C / 280)',
      explanation: 'Calculates instantaneous perturbation to Earth\'s radiative balance (W/m²) as a logarithmic function of atmospheric carbon dioxide concentration relative to the pre-industrial 280 ppm baseline.',
    },
    {
      title: 'Stefan-Boltzmann Blackbody Radiation Law',
      formula: 'j* = ε · σ · T⁴  |  σ = 5.670374 × 10⁻⁸ W/(m²·K⁴)',
      explanation: 'Determines the total electromagnetic energy radiated per unit surface area of a blackbody per unit time directly proportional to the fourth power of thermodynamic absolute temperature.',
    },
    {
      title: 'Thermosteric Ocean Thermal Expansion',
      formula: 'ΔV / V₀ = ∫ β(T, S, P) · ΔT · dz',
      explanation: 'Integrates the thermal expansion coefficient β of seawater across oceanic depth profiles (z) as a function of temperature (T), practical salinity (S), and hydrostatic pressure (P).',
    },
    {
      title: 'Lawson Criterion for Fusion Self-Heating',
      formula: 'n · T · τ_E ≥ 3 × 10²¹ keV · s / m³',
      explanation: 'The fundamental condition for a fusion plasma to reach ignition, requiring sufficient plasma density (n), ion temperature (T), and energy confinement time (τ_E) to sustain thermonuclear reactions without external heating.',
    },
    {
      title: 'Thermoelectric Seebeck Voltage & Figure of Merit ZT',
      formula: 'ΔV = -S · ΔT  |  ZT = (S² σ / κ) · T',
      explanation: 'Governs direct solid-state conversion of thermal energy into electrical voltage via the Seebeck coefficient S, electrical conductivity σ, and thermal conductivity κ.',
    },
  ]

  const bibliography = [
    {
      citation: 'IPCC, 2021: Climate Change 2021: The Physical Science Basis.',
      authors: 'Contribution of Working Group I to the Sixth Assessment Report of the Intergovernmental Panel on Climate Change.',
      journal: 'Cambridge University Press, Cambridge, UK and New York, NY, USA, 2391 pp.',
      doi: '10.1017/9781009157896',
    },
    {
      citation: 'Richardson, K., Steffen, W., Lucht, W., et al., 2023: Earth beyond six of nine planetary boundaries.',
      authors: 'Stockholm Resilience Centre, University of Copenhagen, Potsdam Institute for Climate Impact Research.',
      journal: 'Science, Vol 381, Issue 6665, eadh2458.',
      doi: '10.1126/science.adh2458',
    },
    {
      citation: 'Friedlingstein, P., O\'Sullivan, M., Jones, M.W., et al., 2024: Global Carbon Budget 2024.',
      authors: 'Global Carbon Project, University of Exeter, Laboratoire des Sciences du Climat et de l\'Environnement.',
      journal: 'Earth System Science Data, Vol 16, pp. 5643–5738.',
      doi: '10.5194/essd-16-5643-2024',
    },
    {
      citation: 'Lüthi, D., Le Floch, M., Bereiter, B., et al., 2008: High-resolution carbon dioxide concentration record 650,000–800,000 years before present.',
      authors: 'EPICA Dome C Ice Core Drilling Project, University of Bern, CNRS Grenoble.',
      journal: 'Nature, Vol 453, pp. 379–382.',
      doi: '10.1038/nature06949',
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <Badge variant="accent" size="sm" className="mb-2">
          SCIENTIFIC INTEGRITY & REPRODUCIBILITY DIRECTORY
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)]">
          Methodology, Physics Formulas & Data Feeds
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
          Earth Pulse adheres strictly to open-access scientific consensus, empirical observational validation, and reproducible mathematical formulations established by the IPCC, WMO, and NASA.
        </p>
      </div>

      {/* Governing Mathematical Physics Formulations */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold block">
            Theoretical Foundations
          </span>
          <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
            Mathematical Physics & Climate System Equations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {physicalFormulas.map((f) => (
            <LiquidGlassCard key={f.title} className="p-5 border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white mb-2">
                  {f.title}
                </h3>
                <div className="p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-amber-300 font-bold mb-3">
                  {f.formula}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {f.explanation}
                </p>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </section>

      {/* Primary Data Directory Table */}
      <LiquidGlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
            Primary Observational Feeds & Ingestion Directory
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-black/60 border-b border-white/10 text-[var(--text-muted)] uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Organization & Sensor</th>
                <th className="p-3.5">Telemetry Metric</th>
                <th className="p-3.5">Sampling Cadence</th>
                <th className="p-3.5">License</th>
                <th className="p-3.5">Open Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[var(--text-secondary)]">
              {sources.map((src) => (
                <tr key={src.name} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-bold text-white">
                    <div>{src.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-normal mt-0.5">
                      {src.notes}
                    </div>
                  </td>
                  <td className="p-3.5 text-[var(--accent)]">{src.metric}</td>
                  <td className="p-3.5">{src.frequency}</td>
                  <td className="p-3.5 text-white/60">{src.license}</td>
                  <td className="p-3.5">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                    >
                      <span>Access</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LiquidGlassCard>

      {/* Peer-Reviewed Scientific Bibliography */}
      <LiquidGlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
            Peer-Reviewed Scientific Bibliography
          </h2>
        </div>

        <div className="space-y-4">
          {bibliography.map((b) => (
            <div key={b.doi} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <h4 className="font-bold text-white text-xs sm:text-sm">
                {b.citation}
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                {b.authors} — <em className="text-white/70">{b.journal}</em>
              </p>
              <div className="font-mono text-[10px] text-emerald-400">
                DOI: {b.doi}
              </div>
            </div>
          ))}
        </div>
      </LiquidGlassCard>

      {/* Software Architecture & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LiquidGlassCard className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
              Frontier Technical Stack
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs font-mono text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] font-bold">•</span>
              <span><strong>Client Runtime:</strong> React 19 + TypeScript + Vite 8 Rollup engine</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] font-bold">•</span>
              <span><strong>3D Graphics Engine:</strong> React Three Fiber + Three.js r186 + Custom Procedural Shaders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] font-bold">•</span>
              <span><strong>Hardware Physics Simulation:</strong> Direct canvas rendering for Fission, Fusion Tokamak, Piezoelectric, and Seebeck systems</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] font-bold">•</span>
              <span><strong>State Synchronization:</strong> Zustand 5 store synchronizing mode tokens and simulation telemetry across the DOM</span>
            </li>
          </ul>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
              Planetary Observatory Mission
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
            Earth Pulse exists to eliminate the cognitive latency between dense peer-reviewed scientific repositories and public consciousness. By synthesizing satellite interferometry, cryospheric gravimetry, and solid-state energy physics into an interactive, visually stunning telemetry dashboard, we make the living mechanics of our planet intuitive and actionable.
          </p>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-emerald-300">
            "We are the first generation to feel the effect of climate change and the last generation that can do something about it."
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  )
}
