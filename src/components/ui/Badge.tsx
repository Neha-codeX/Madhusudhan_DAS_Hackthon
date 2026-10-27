import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'critical' | 'warning' | 'positive' | 'accent' | 'neutral'
  pulse?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  pulse = false,
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    critical: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    positive: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    accent: 'bg-[rgba(var(--accent-rgb),0.15)] text-[var(--accent)] border-[rgba(var(--accent-rgb),0.35)]',
    neutral: 'bg-white/10 text-white/80 border-white/15',
  }

  const pulseDotColors = {
    critical: 'bg-rose-400',
    warning: 'bg-amber-400',
    positive: 'bg-emerald-400',
    accent: 'bg-[var(--accent)]',
    neutral: 'bg-white/60',
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wide',
    md: 'text-xs px-2.5 py-1',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border backdrop-blur-md ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseDotColors[variant]}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${pulseDotColors[variant]}`}
          />
        </span>
      )}
      {children}
    </span>
  )
}
