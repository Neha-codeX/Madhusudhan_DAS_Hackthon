import React, { useState } from 'react'
import { type HotspotPin, climateHotspots } from '../../data/climateData'
import { useThemeStore } from '../../store/themeStore'
import { LiquidGlassCard } from '../ui/LiquidGlassCard'
import { Badge } from '../ui/Badge'
import { MapPin, Compass } from 'lucide-react'

export const HotspotMap: React.FC = () => {
  const { mode } = useThemeStore()
  // Filter pins matching current mode, or all if solutions
  const activePins = climateHotspots.filter((h) =>
    mode === 'solutions' ? true : h.mode === mode
  )

  const [selectedPin, setSelectedPin] = useState<HotspotPin>(
    activePins[0] || climateHotspots[0]
  )

  // Map lat/long to SVG 2D mercator projection coordinates (0-1000 x 0-500)
  const project = (lat: number, lng: number) => {
    const x = ((lng + 180) * (1000 / 360))
    const latRad = (lat * Math.PI) / 180
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
    const y = 250 - (500 * mercN) / (2 * Math.PI)
    return { x: Math.max(20, Math.min(980, x)), y: Math.max(30, Math.min(470, y)) }
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-black/40 backdrop-blur-2xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
              Global Planetary Anomaly & Hotspot Radar
            </h3>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            Displaying high-severity telemetry pins for {mode.toUpperCase()} biome
          </p>
        </div>
        <Badge variant="accent" pulse>
          {activePins.length} MONITORED EPICENTERS
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* SVG Interactive World Map */}
        <div className="lg:col-span-2 relative aspect-[2/1] rounded-xl overflow-hidden bg-[#020914] border border-white/10 p-2">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* SVG Map Canvas */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full relative z-10 overflow-visible"
          >
            {/* Equator & Tropics guides */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
            <line x1="0" y1="160" x2="1000" y2="160" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
            <line x1="0" y1="340" x2="1000" y2="340" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />

            {/* Approximate simplified continental outlines */}
            <g fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8">
              {/* North America */}
              <path d="M 120,80 Q 200,60 280,110 Q 260,180 200,240 Q 140,200 110,130 Z" />
              {/* South America */}
              <path d="M 270,260 Q 360,280 340,420 Q 280,450 260,330 Z" />
              {/* Eurasia */}
              <path d="M 450,80 Q 750,70 880,140 Q 820,240 650,220 Q 520,200 450,130 Z" />
              {/* Africa */}
              <path d="M 460,200 Q 560,200 540,360 Q 480,400 450,280 Z" />
              {/* Australia */}
              <path d="M 750,320 Q 860,320 840,400 Q 750,400 750,340 Z" />
              {/* Greenland */}
              <path d="M 330,60 Q 380,50 370,100 Q 330,110 330,60 Z" />
              {/* Antarctica */}
              <path d="M 100,470 Q 500,450 900,470 L 900,500 L 100,500 Z" />
            </g>

            {/* Pins */}
            {activePins.map((pin) => {
              const { x, y } = project(pin.lat, pin.lng)
              const isSelected = selectedPin?.id === pin.id
              const pinColor =
                pin.severity === 'critical'
                  ? '#FF6B5A'
                  : pin.severity === 'severe'
                  ? '#FFB020'
                  : '#6EE7F9'

              return (
                <g
                  key={pin.id}
                  className="cursor-pointer transition-transform"
                  onClick={() => setSelectedPin(pin)}
                >
                  {/* Radar pulse ping */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 18 : 10}
                    fill={pinColor}
                    opacity={isSelected ? 0.4 : 0.2}
                    className="animate-ping"
                  />
                  {/* Glow circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 8 : 5}
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {/* Label */}
                  <text
                    x={x + 12}
                    y={y + 4}
                    fill="#ffffff"
                    fontSize={isSelected ? '12' : '10'}
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="select-none drop-shadow-md"
                  >
                    {pin.name.split(' ')[0]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Selected Hotspot Intelligence Panel */}
        {selectedPin && (
          <LiquidGlassCard className="p-5 border-[var(--accent)]/40 bg-white/5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <Badge variant={selectedPin.severity === 'critical' ? 'critical' : selectedPin.severity === 'severe' ? 'warning' : 'accent'}>
                {selectedPin.severity.toUpperCase()} ALERT
              </Badge>
              <span className="font-mono text-[10px] text-[var(--accent)]">
                {selectedPin.lat > 0 ? `${selectedPin.lat}°N` : `${Math.abs(selectedPin.lat)}°S`},{' '}
                {selectedPin.lng > 0 ? `${selectedPin.lng}°E` : `${Math.abs(selectedPin.lng)}°W`}
              </span>
            </div>

            <h4 className="font-display font-bold text-lg text-[var(--text-primary)] mb-1">
              {selectedPin.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mb-4">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{selectedPin.region}</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                  Primary Telemetry Metric
                </span>
                <span className="text-sm font-mono font-bold text-[var(--accent)]">
                  {selectedPin.metric}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1">
                  Observed Velocity & Trend
                </span>
                <span className="text-xs font-mono text-rose-300">
                  {selectedPin.trend}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {selectedPin.details}
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                <span>Cumulative Impact:</span>
                <span className="text-white font-bold">{selectedPin.historicalLoss}</span>
              </div>
            </div>
          </LiquidGlassCard>
        )}
      </div>
    </div>
  )
}
