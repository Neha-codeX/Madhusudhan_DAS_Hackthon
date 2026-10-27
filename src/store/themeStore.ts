import { create } from 'zustand'

export type ThemeMode = 'glaciers' | 'deforestation' | 'carbon' | 'solutions'
export type QualityLevel = 'high' | 'medium' | 'low'

interface ThemeState {
  mode: ThemeMode
  prevMode: ThemeMode | null
  isTransitioning: boolean
  transitionName: string
  quality: QualityLevel
  activeTab: string

  // Interactive Scene & Simulation Variables
  meltProgress: number // 0 to 1 (0 = pristine 1850 ice, 1 = 2050 extreme melt)
  forestHealth: number // 0 to 100 (100 = virgin canopy, 0 = fully collapsed)
  carbonYear: number // 1958 to 2050 (year scrubber)
  soundEnabled: boolean

  // Actions
  setMode: (mode: ThemeMode) => void
  setQuality: (quality: QualityLevel) => void
  setActiveTab: (tab: string) => void
  setMeltProgress: (val: number) => void
  setForestHealth: (val: number) => void
  setCarbonYear: (val: number) => void
  toggleSound: () => void
  resetSimulation: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'glaciers',
  prevMode: null,
  isTransitioning: false,
  transitionName: '',
  quality: 'high',
  activeTab: 'overview',

  meltProgress: 0.45,
  forestHealth: 68,
  carbonYear: 2025,
  soundEnabled: false,

  setMode: (newMode) => {
    set((state) => {
      if (state.mode === newMode) return state

      // Determine transition effect name
      let transitionName = 'ice-crack'
      if (newMode === 'deforestation') transitionName = 'axe-slash'
      else if (newMode === 'carbon') transitionName = 'smog-sweep'
      else if (newMode === 'solutions') transitionName = 'solar-dawn'

      // Update DOM data-theme attribute
      document.documentElement.setAttribute('data-theme', newMode)

      return {
        prevMode: state.mode,
        mode: newMode,
        isTransitioning: true,
        transitionName,
      }
    })

    // End transition after animation time
    setTimeout(() => {
      set({ isTransitioning: false })
    }, 1200)
  },

  setQuality: (quality) => set({ quality }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setMeltProgress: (meltProgress) => set({ meltProgress }),
  setForestHealth: (forestHealth) => set({ forestHealth }),
  setCarbonYear: (carbonYear) => set({ carbonYear }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  resetSimulation: () =>
    set({
      meltProgress: 0.45,
      forestHealth: 68,
      carbonYear: 2025,
    }),
}))
