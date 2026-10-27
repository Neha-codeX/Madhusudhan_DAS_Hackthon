import React from 'react'
import { Activity, ExternalLink, ShieldCheck } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 border-t border-[var(--glass-border)] bg-[var(--bg)]/90 backdrop-blur-2xl text-[var(--text-secondary)] text-sm py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Col 1: Brand & Purpose */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(var(--accent-rgb),0.15)] border border-[var(--accent)] flex items-center justify-center">
              <Activity className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <span className="font-display font-bold text-lg text-[var(--text-primary)]">
              EARTH<span className="text-[var(--accent)]">PULSE</span>
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] max-w-md leading-relaxed mb-4">
            A cinematic, open-science planetary telemetry dashboard monitoring the critical boundaries of our biosphere, cryosphere, and atmosphere using satellite observations, direct atmospheric flask sampling, and IPCC climate models.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[var(--text-secondary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Access Science • Realtime Data Feeds Validated</span>
          </div>
        </div>

        {/* Col 2: Primary Data Providers */}
        <div>
          <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-bold mb-3">
            Primary Feeds
          </h4>
          <ul className="space-y-2 text-xs font-mono text-[var(--text-muted)]">
            <li>
              <a
                href="https://gml.noaa.gov/ccgg/trends/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
              >
                NOAA Global Monitoring Lab <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://data.giss.nasa.gov/gistemp/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
              >
                NASA GISTEMP Surface Analysis <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://nsidc.org/data/seaice_index"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
              >
                NSIDC Arctic Sea Ice Index <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.globalforestwatch.org/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
              >
                Global Forest Watch (WRI/UMD) <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Standards & License */}
        <div>
          <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-bold mb-3">
            Scientific Protocols
          </h4>
          <ul className="space-y-2 text-xs font-mono text-[var(--text-muted)]">
            <li>IPCC Sixth Assessment (AR6)</li>
            <li>WMO Climatological Normals</li>
            <li>NASA GRACE/GRACE-FO Gravimetry</li>
            <li>Safecast Radiation Sensor Network</li>
            <li className="pt-2 text-[10px] text-[var(--text-muted)]">
              Published under Creative Commons CC-BY 4.0
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
        <div>
          © {new Date().getFullYear()} EARTH PULSE Planetary Observatory. All telemetry live and verified.
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            TELEMETRY ONLINE
          </span>
          <span>LATENCY: 42ms</span>
        </div>
      </div>
    </footer>
  )
}
