import React from 'react'
import { LiquidGlassCard } from './LiquidGlassCard'
import { Sparkline } from './Sparkline'
import { Badge } from './Badge'
import { Info } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  unit: string
  delta: string
  deltaPeriod: string
  status?: 'critical' | 'warning' | 'positive'
  source: string
  citation?: string
  lastUpdated?: string
  description?: string
  sparkline?: number[]
  className?: string
  onClick?: () => void
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  delta,
  deltaPeriod,
  status = 'critical',
  source,
  citation,
  lastUpdated,
  description,
  sparkline,
  className = '',
  onClick,
}) => {
  return (
    <LiquidGlassCard
      onClick={onClick}
      className={`p-5 transition-all duration-300 hover:border-[var(--accent)] group ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs uppercase tracking-wider font-mono text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
          {title}
        </span>
        <Badge variant={status} pulse={status === 'critical'}>
          {delta}
        </Badge>
      </div>

      <div className="flex items-baseline gap-2 my-2">
        <span className="text-3xl lg:text-4xl font-bold font-display tracking-tight text-[var(--text-primary)]">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        <span className="text-xs font-mono text-[var(--accent)] font-semibold">
          {unit}
        </span>
      </div>

      <div className="text-[11px] font-mono text-[var(--text-muted)] mb-3">
        {deltaPeriod}
      </div>

      {sparkline && sparkline.length > 0 && (
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Historical Trend
            </span>
            <span className="text-[10px] font-mono text-[var(--accent)]">
              Min: {Math.min(...sparkline)} • Max: {Math.max(...sparkline)}
            </span>
          </div>
          <Sparkline data={sparkline} width={100} height={28} />
        </div>
      )}

      {/* Source footer */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
        <span className="truncate flex items-center gap-1" title={citation || source}>
          <Info className="w-3 h-3 text-[var(--accent)] shrink-0" />
          {source}
        </span>
        {lastUpdated && (
          <span className="shrink-0 font-mono text-[9px] text-[var(--text-secondary)]">
            {lastUpdated}
          </span>
        )}
      </div>

      {description && (
        <div className="mt-2 text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
          {description}
        </div>
      )}
    </LiquidGlassCard>
  )
}
