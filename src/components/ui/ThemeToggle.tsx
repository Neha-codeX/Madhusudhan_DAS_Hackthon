import React from 'react'
import { useThemeStore, type ThemeMode } from '../../store/themeStore'
import { Snowflake, Trees, Flame, SunMedium } from 'lucide-react'

export const ThemeToggle: React.FC = () => {
  const { mode, setMode, isTransitioning } = useThemeStore()

  const themes: { id: ThemeMode; label: string; icon: React.ReactNode; glowColor: string }[] = [
    {
      id: 'glaciers',
      label: 'Glaciers',
      icon: <Snowflake className="w-3.5 h-3.5" />,
      glowColor: '#6EE7F9',
    },
    {
      id: 'deforestation',
      label: 'Deforestation',
      icon: <Trees className="w-3.5 h-3.5" />,
      glowColor: '#22C55E',
    },
    {
      id: 'carbon',
      label: 'Carbon',
      icon: <Flame className="w-3.5 h-3.5" />,
      glowColor: '#FFB020',
    },
    {
      id: 'solutions',
      label: 'Solutions',
      icon: <SunMedium className="w-3.5 h-3.5" />,
      glowColor: '#0EA5E9',
    },
  ]

  return (
    <div className="relative inline-flex items-center p-1 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      {themes.map((t) => {
        const isActive = mode === t.id
        return (
          <button
            key={t.id}
            type="button"
            disabled={isTransitioning}
            onClick={() => setMode(t.id)}
            className={`
              relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-300
              ${isActive ? 'text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'}
            `}
            style={{
              boxShadow: isActive ? `0 0 16px ${t.glowColor}55` : 'none',
            }}
          >
            {isActive && (
              <span
                className="absolute inset-0 rounded-full transition-all duration-300 -z-10"
                style={{
                  background: `linear-gradient(135deg, ${t.glowColor}40, ${t.glowColor}15)`,
                  border: `1px solid ${t.glowColor}80`,
                }}
              />
            )}
            <span
              style={{
                color: isActive ? t.glowColor : 'inherit',
              }}
            >
              {t.icon}
            </span>
            <span>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
