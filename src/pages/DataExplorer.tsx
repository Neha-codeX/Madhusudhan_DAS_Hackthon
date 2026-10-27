import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import {
  historicalClimateData,
  emissionsBySector,
  countryEmissions,
  paleoclimateIceCoreData,
} from '../data/climateData'
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard'
import { Badge } from '../components/ui/Badge'
import { Download, Filter, Table, Check } from 'lucide-react'

export const DataExplorer: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<
    'temp' | 'co2' | 'paleo' | 'forcing' | 'sectors' | 'countries'
  >('temp')
  const [startYear, setStartYear] = useState(1960)
  const [endYear, setEndYear] = useState(2025)
  const [copied, setCopied] = useState(false)
  const [tableSearch, setTableSearch] = useState('')

  // Filter historical data by year range
  const filteredData = useMemo(() => {
    return historicalClimateData.filter(
      (d) => d.year >= startYear && d.year <= endYear
    )
  }, [startYear, endYear])

  // Radiative Forcing Breakdown data (IPCC AR6 WG1 Chapter 7)
  const radiativeForcingData = [
    { agent: 'Carbon Dioxide (CO₂)', forcingWm2: 2.16, category: 'Warming', color: '#FF6B5A' },
    { agent: 'Methane (CH₄)', forcingWm2: 0.54, category: 'Warming', color: '#F59E0B' },
    { agent: 'Halocarbons (CFC/HFC)', forcingWm2: 0.41, category: 'Warming', color: '#FF2E88' },
    { agent: 'Nitrous Oxide (N₂O)', forcingWm2: 0.21, category: 'Warming', color: '#7C5CFF' },
    { agent: 'Short-Lived Ozone (O₃)', forcingWm2: 0.47, category: 'Warming', color: '#38BDF8' },
    { agent: 'Aerosol Direct & Cloud Albedo', forcingWm2: -1.10, category: 'Cooling Offset', color: '#64748B' },
    { agent: 'Net Total Anthropogenic Forcing', forcingWm2: 2.91, category: 'Net Warming', color: '#22C55E' },
  ]

  // CSV Export handler
  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,'
    if (selectedMetric === 'temp' || selectedMetric === 'co2') {
      csvContent += 'Year,Global_Temp_Anomaly_C,Atmospheric_CO2_PPM\n'
      filteredData.forEach((row) => {
        csvContent += `${row.year},${row.value},${row.baseline}\n`
      })
    } else if (selectedMetric === 'paleo') {
      csvContent += 'Thousand_Years_Ago,CO2_PPM,Temperature_Delta_C\n'
      paleoclimateIceCoreData.forEach((p) => {
        csvContent += `${p.kYearsAgo},${p.co2},${p.tempDelta}\n`
      })
    } else if (selectedMetric === 'forcing') {
      csvContent += 'Climate_Agent,Radiative_Forcing_W_m2,Category\n'
      radiativeForcingData.forEach((f) => {
        csvContent += `"${f.agent}",${f.forcingWm2},"${f.category}"\n`
      })
    } else if (selectedMetric === 'sectors') {
      csvContent += 'Sector,Share_Percent,CO2_Gt_Annual\n'
      emissionsBySector.forEach((s) => {
        csvContent += `"${s.name}",${s.share},${s.co2Gt}\n`
      })
    } else {
      csvContent += 'Country,Emissions_Mt_CO2,Per_Capita_Tons,Global_Share_Pct,Target\n'
      countryEmissions.forEach((c) => {
        csvContent += `"${c.country}",${c.mt},${c.perCapita},${c.share},"${c.reductionTarget}"\n`
      })
    }

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `earth_pulse_${selectedMetric}_export.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--glass-border)] pb-6">
        <div>
          <Badge variant="accent" size="sm" className="mb-2">
            PLANETARY DATA LAKE • MULTI-OBSERVATIONAL TELEMETRY
          </Badge>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)]">
            Climate Data Explorer & Telemetry Lake
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Query, correlate, and inspect peer-reviewed observational records spanning modern high-resolution satellite radiometry to 800,000-year Antarctic ice core paleoclimate strata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold bg-[var(--accent)] text-black hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            {copied ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{copied ? 'Exported CSV!' : 'Download CSV Dataset'}</span>
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'temp', label: '1. Surface Temperature Anomaly (°C)' },
          { id: 'co2', label: '2. Atmospheric CO₂ Concentration (PPM)' },
          { id: 'paleo', label: '3. 800,000-Yr EPICA Ice Core Record' },
          { id: 'forcing', label: '4. Radiative Forcing Breakdown (W/m²)' },
          { id: 'sectors', label: '5. Global Sector Emissions' },
          { id: 'countries', label: '6. Top Emitter Rankings' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedMetric(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-mono text-xs transition-all ${
              selectedMetric === tab.id
                ? 'bg-[var(--accent)] text-black font-bold shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Controls & Filter Bar (for time-series) */}
      {(selectedMetric === 'temp' || selectedMetric === 'co2') && (
        <LiquidGlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
            <Filter className="w-4 h-4 text-[var(--accent)]" />
            <span>ANNUAL FILTER:</span>
            <span className="text-[var(--accent)] font-bold">{startYear}</span>
            <span>TO</span>
            <span className="text-[var(--accent)] font-bold">{endYear}</span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="text-xs font-mono text-white/50">1880</span>
            <input
              type="range"
              min="1880"
              max="2000"
              step="5"
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value))}
              className="w-32 h-1.5 bg-white/20 rounded appearance-none cursor-pointer accent-[var(--accent)]"
            />
            <input
              type="range"
              min="2000"
              max="2025"
              step="1"
              value={endYear}
              onChange={(e) => setEndYear(parseInt(e.target.value))}
              className="w-32 h-1.5 bg-white/20 rounded appearance-none cursor-pointer accent-[var(--accent)]"
            />
            <span className="text-xs font-mono text-white/50">2025</span>
          </div>
        </LiquidGlassCard>
      )}

      {/* Primary Chart Visualization Card */}
      <LiquidGlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
              {selectedMetric === 'temp' && 'NASA GISTEMP Global Mean Surface Temperature Anomaly (1880–2025)'}
              {selectedMetric === 'co2' && 'NOAA Global Monitoring Lab Atmospheric CO₂ Concentration (PPM)'}
              {selectedMetric === 'paleo' && '800,000-Year EPICA Dome C Antarctic Ice Core CO₂ Record'}
              {selectedMetric === 'forcing' && 'IPCC AR6 Anthropogenic Radiative Forcing Components (W/m²)'}
              {selectedMetric === 'sectors' && 'Breakdown of Global Greenhouse Gas Emissions by Sector'}
              {selectedMetric === 'countries' && 'National Annual Carbon Emissions Comparison (Mt CO₂/yr)'}
            </h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {selectedMetric === 'temp' && 'GISTEMP v4 analysis • 250km spatial smoothing • Baseline 1850-1900'}
              {selectedMetric === 'co2' && 'Mauna Loa continuous in-situ NDIR spectroscopic sampling'}
              {selectedMetric === 'paleo' && 'Nature 2008 / EPICA Dome C 3,260m deep ice core air bubbles'}
              {selectedMetric === 'forcing' && 'IPCC Sixth Assessment Working Group 1 Chapter 7 synthesis'}
              {selectedMetric === 'sectors' && 'Climate TRACE & Our World in Data 2024 verified accounts'}
              {selectedMetric === 'countries' && 'Global Carbon Budget 2024 / CDIAC territorial accounts'}
            </span>
          </div>
          <Badge variant="accent">VERIFIED PEER-REVIEWED DATA</Badge>
        </div>

        <div className="h-[400px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === 'temp' ? (
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B5A" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#2B7FFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="year" stroke="#ffffff60" tick={{ fontSize: 11 }} />
                <YAxis stroke="#ffffff60" tick={{ fontSize: 11 }} unit="°C" domain={[-0.4, 1.8]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071828',
                    border: '1px solid rgba(110,231,249,0.3)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`+${value}°C`, 'Temp Anomaly']}
                  labelFormatter={(year) => `Year: ${year}`}
                />
                <Area type="monotone" dataKey="value" stroke="#FF6B5A" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGrad)" />
              </AreaChart>
            ) : selectedMetric === 'co2' ? (
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB020" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FFB020" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="year" stroke="#ffffff60" tick={{ fontSize: 11 }} />
                <YAxis stroke="#ffffff60" tick={{ fontSize: 11 }} unit=" ppm" domain={[280, 440]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121A',
                    border: '1px solid rgba(255,176,32,0.3)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value} ppm`, 'CO₂ Concentration']}
                  labelFormatter={(year) => `Year: ${year}`}
                />
                <Area type="monotone" dataKey="baseline" stroke="#FFB020" strokeWidth={2.5} fillOpacity={1} fill="url(#co2Grad)" />
              </AreaChart>
            ) : selectedMetric === 'paleo' ? (
              <LineChart data={paleoclimateIceCoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="kYearsAgo" stroke="#ffffff60" tick={{ fontSize: 11 }} unit="k YA" reversed />
                <YAxis stroke="#ffffff60" tick={{ fontSize: 11 }} unit=" ppm" domain={[160, 450]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071828',
                    border: '1px solid rgba(110,231,249,0.3)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} ppm CO₂`, 'Atmospheric Trapped Gas']}
                  labelFormatter={(k) => `${k} Thousand Years Ago`}
                />
                <Line type="monotone" dataKey="co2" stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 4, fill: '#38BDF8' }} />
              </LineChart>
            ) : selectedMetric === 'forcing' ? (
              <BarChart data={radiativeForcingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" stroke="#ffffff60" unit=" W/m²" domain={[-1.5, 3.5]} />
                <YAxis type="category" dataKey="agent" stroke="#ffffff80" tick={{ fontSize: 11 }} width={200} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071828',
                    border: '1px solid rgba(110,231,249,0.3)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} W/m²`, 'Radiative Forcing']}
                />
                <Bar dataKey="forcingWm2" radius={[0, 8, 8, 0]}>
                  {radiativeForcingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : selectedMetric === 'sectors' ? (
              <BarChart data={emissionsBySector} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" stroke="#ffffff60" unit="%" />
                <YAxis type="category" dataKey="name" stroke="#ffffff80" tick={{ fontSize: 11 }} width={160} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071828',
                    border: '1px solid rgba(110,231,249,0.3)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(val: any, _name: any, item: any) => [
                    `${val}% (${item.payload.co2Gt} Gt CO₂/yr)`,
                    'Share',
                  ]}
                />
                <Bar dataKey="share" radius={[0, 8, 8, 0]}>
                  {emissionsBySector.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={countryEmissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="country" stroke="#ffffff60" tick={{ fontSize: 11 }} />
                <YAxis stroke="#ffffff60" unit=" Mt" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071828',
                    border: '1px solid rgba(110,231,249,0.3)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val.toLocaleString()} Mt CO₂`, 'Annual Emissions']}
                />
                <Bar dataKey="mt" fill="#38BDF8" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Detailed Scientific Notes Box */}
        <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10 text-xs leading-relaxed text-[var(--text-secondary)]">
          {selectedMetric === 'temp' && (
            <p>
              <strong className="text-white">Scientific Analysis:</strong> The NASA GISTEMP v4 dataset integrates over 26,000 meteorological weather stations across continental surfaces combined with ERSSTv5 oceanic buoy and satellite radiometric sea surface temperatures. The recent +1.49°C anomaly represents the hottest multi-year average since the onset of the Eemian interglacial epoch approximately 125,000 years ago.
            </p>
          )}
          {selectedMetric === 'co2' && (
            <p>
              <strong className="text-white">Scientific Analysis:</strong> Charles David Keeling began continuous flask sampling atop the Mauna Loa caldera in 1958 at 3,400 meters altitude. The prominent seasonal sawtooth waveform reflects the seasonal respiratory cycle of Northern Hemisphere terrestrial vegetation: global photosynthesis draws down 6–7 ppm between May and September, followed by autumnal soil microbial release.
            </p>
          )}
          {selectedMetric === 'paleo' && (
            <p>
              <strong className="text-white">Scientific Analysis:</strong> By analyzing microscopic air bubbles trapped in 3,260-meter-deep ice cores drilled at EPICA Dome C in East Antarctica, paleoclimatologists proved that for 800,000 years across 8 distinct ice age glacial-interglacial cycles, atmospheric CO₂ never exceeded 300 ppm or dropped below 180 ppm. The current breach to 427.8 ppm represents an unprecedented vertical surge occurring within just 150 years.
            </p>
          )}
          {selectedMetric === 'forcing' && (
            <p>
              <strong className="text-white">Scientific Analysis:</strong> Radiative forcing measures the net change in the planetary energy balance ($W/m^2$) at the top of the atmosphere. Anthropogenic greenhouse gases add +3.79 W/m² of thermal trapping, partially offset by -1.10 W/m² of aerosol reflection (sulfates & nitrates), yielding a net positive forcing of +2.91 W/m² driving planetary heating.
            </p>
          )}
          {selectedMetric === 'sectors' && (
            <p>
              <strong className="text-white">Scientific Analysis:</strong> Electricity and heat generation remain the single largest emitting sector (15.8 Gt CO₂/yr), primarily driven by 2,420 thermal coal generators worldwide. Heavy manufacturing (cement calcination, blast furnace blast steel, and petrochemical cracking) accounts for 21.4%, while transportation comprises 16.2%.
            </p>
          )}
          {selectedMetric === 'countries' && (
            <p>
              <strong className="text-white">Scientific Analysis:</strong> China, the United States, and India represent over 49% of all global territorial emissions. While China produces 11,400 Mt CO₂ annually, the United States maintains more than double the per capita emissions footprint (14.9 tons/capita vs 8.1 tons in China and 1.9 tons in India).
            </p>
          )}
        </div>
      </LiquidGlassCard>

      {/* Raw Data Table Section */}
      <LiquidGlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              Tabular Dataset Inspection & Telemetry Logs
            </h3>
          </div>
          <input
            type="text"
            placeholder="Search dataset..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 font-mono text-xs text-white focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="overflow-x-auto max-h-[340px] overflow-y-auto rounded-xl border border-white/10">
          <table className="w-full text-left font-mono text-xs">
            <thead className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-white/10 text-[var(--text-muted)] uppercase text-[10px]">
              <tr>
                <th className="p-3">Year / Epoch</th>
                <th className="p-3">Primary Observation</th>
                <th className="p-3">Baseline Concentration</th>
                <th className="p-3">IPCC AR6 Risk Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[var(--text-secondary)]">
              {filteredData
                .filter((r) => tableSearch === '' || r.year.toString().includes(tableSearch))
                .slice(-15)
                .map((row) => (
                  <tr key={row.year} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-white">{row.year}</td>
                    <td className="p-3 text-[var(--accent)]">
                      +{row.value}°C Surface Anomaly
                    </td>
                    <td className="p-3">{row.baseline} PPM CO₂</td>
                    <td className="p-3">
                      <Badge variant={row.value > 1.2 ? 'critical' : row.value > 0.8 ? 'warning' : 'neutral'}>
                        {row.value > 1.2 ? 'CRITICAL TIPPING' : row.value > 0.8 ? 'ACCELERATED' : 'MODERATE'}
                      </Badge>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </LiquidGlassCard>
    </div>
  )
}
