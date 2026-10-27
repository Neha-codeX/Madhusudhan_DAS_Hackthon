import { useState, useEffect } from 'react'
import { useThemeStore } from './store/themeStore'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ThemeTransition } from './components/transitions/ThemeTransition'
import { Home } from './pages/Home'
import { DataExplorer } from './pages/DataExplorer'
import { SimulationLab } from './pages/SimulationLab'
import { Gallery } from './pages/Gallery'
import { PollutionHub } from './pages/PollutionHub'
import { Solutions } from './pages/Solutions'
import { About } from './pages/About'

export function App() {
  const { mode } = useThemeStore()
  const [currentTab, setCurrentTab] = useState<string>('overview')

  // Synchronize mode to data-theme on mount and mode changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  // Handle URL hash navigation if user uses browser history
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (['overview', 'data', 'simulation', 'gallery', 'pollution', 'solutions', 'about'].includes(hash)) {
        setCurrentTab(hash)
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    window.location.hash = tab
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-700 selection:bg-[var(--accent)] selection:text-black font-sans relative antialiased overflow-x-hidden">
      {/* Cinematic theme transition wipe */}
      <ThemeTransition />

      {/* Subtle Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Main Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} />

      {/* Active Tab Viewport */}
      <main className="relative z-10 min-h-screen">
        {currentTab === 'overview' && <Home onNavigate={handleTabChange} />}
        {currentTab === 'data' && <DataExplorer />}
        {currentTab === 'simulation' && <SimulationLab />}
        {currentTab === 'gallery' && <Gallery />}
        {currentTab === 'pollution' && <PollutionHub />}
        {currentTab === 'solutions' && <Solutions />}
        {currentTab === 'about' && <About />}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}

export default App
