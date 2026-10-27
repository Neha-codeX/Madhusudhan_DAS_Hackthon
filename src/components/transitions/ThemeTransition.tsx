import React from 'react'
import { useThemeStore } from '../../store/themeStore'

export const ThemeTransition: React.FC = () => {
  const { isTransitioning, transitionName } = useThemeStore()

  if (!isTransitioning) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* 1. Ice-crack wipe for Glacier mode */}
      {transitionName === 'ice-crack' && (
        <div className="absolute inset-0 bg-[#04111F]/60 backdrop-blur-md animate-theme-wipe flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* SVG Ice crystal fracture lines */}
            <svg
              className="w-full h-full absolute inset-0 opacity-80"
              viewBox="0 0 1000 1000"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="ice-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6EE7F9" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#2B7FFF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path
                d="M 500,500 L 100,50 M 500,500 L 900,120 M 500,500 L 950,750 M 500,500 L 50,850 M 500,500 L 480,980 M 500,500 L 520,20 M 300,250 L 150,450 M 700,300 L 850,550"
                stroke="url(#ice-grad)"
                strokeWidth="2.5"
                fill="none"
              />
            </svg>
            <div className="font-display font-bold text-xl sm:text-2xl tracking-widest text-[#6EE7F9] bg-[#04111F]/90 px-6 py-2.5 rounded-full border border-[#6EE7F9]/50 shadow-[0_0_40px_rgba(110,231,249,0.5)]">
              CRYOSPHERE ACTIVE
            </div>
          </div>
        </div>
      )}

      {/* 2. Axe-slash wipe for Deforestation mode */}
      {transitionName === 'axe-slash' && (
        <div className="absolute inset-0 bg-[#07140C]/60 backdrop-blur-md animate-theme-wipe flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/20 via-transparent to-[#112616]/80"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
            }}
          />
          <div className="font-display font-bold text-xl sm:text-2xl tracking-widest text-[#22C55E] bg-[#07140C]/90 px-6 py-2.5 rounded-full border border-[#22C55E]/50 shadow-[0_0_40px_rgba(34,197,94,0.5)] relative z-10">
            BIOSPHERE ACTIVE
          </div>
        </div>
      )}

      {/* 3. Smog-sweep for Carbon mode */}
      {transitionName === 'smog-sweep' && (
        <div className="absolute inset-0 bg-[#0B0B10]/60 backdrop-blur-md animate-theme-wipe flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFB020]/25 via-[#FF2E88]/15 to-transparent" />
          <div className="font-display font-bold text-xl sm:text-2xl tracking-widest text-[#FFB020] bg-[#0B0B10]/90 px-6 py-2.5 rounded-full border border-[#FFB020]/50 shadow-[0_0_40px_rgba(255,176,32,0.5)] relative z-10">
            ATMOSPHERE ACTIVE
          </div>
        </div>
      )}

      {/* 4. Solar dawn for Solutions mode */}
      {transitionName === 'solar-dawn' && (
        <div className="absolute inset-0 bg-[#F0F9FF]/60 backdrop-blur-md animate-theme-wipe flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9]/20 via-[#34D399]/20 to-[#F59E0B]/20" />
          <div className="font-display font-bold text-xl sm:text-2xl tracking-widest text-[#0EA5E9] bg-white/95 px-6 py-2.5 rounded-full border border-[#0EA5E9]/50 shadow-[0_0_40px_rgba(14,165,233,0.5)] relative z-10">
            RENEWABLE DAWN
          </div>
        </div>
      )}
    </div>
  )
}
