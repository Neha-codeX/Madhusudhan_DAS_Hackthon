import React, { useEffect, useState } from 'react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useThemeStore } from '../../store/themeStore'
import { Activity, Globe, Menu, X, BarChart2, Cpu, Image, AlertTriangle, Zap, HelpCircle } from 'lucide-react'

interface NavbarProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { mode } = useThemeStore()
  const [utcTime, setUtcTime] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setUtcTime(
        now.toISOString().slice(11, 19) + ' UTC'
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { id: 'overview', label: 'Overview', icon: <Globe className="w-4 h-4" /> },
    { id: 'data', label: 'Data Explorer', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'simulation', label: 'Simulation Lab', icon: <Cpu className="w-4 h-4" /> },
    { id: 'gallery', label: 'Evidence Gallery', icon: <Image className="w-4 h-4" /> },
    { id: 'pollution', label: 'Pollution Hub', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'solutions', label: 'Solutions', icon: <Zap className="w-4 h-4" /> },
    { id: 'about', label: 'Sources', icon: <HelpCircle className="w-4 h-4" /> },
  ]

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 bg-[var(--bg)]/85 backdrop-blur-2xl border-b border-[var(--glass-border)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('overview')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-[var(--accent)]/40 shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]">
            <span className="absolute inset-0 rounded-full animate-ping opacity-25 bg-[var(--accent)]" />
            <Activity className="w-5 h-5 text-[var(--accent)] transition-transform group-hover:scale-110" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base sm:text-lg tracking-wider text-[var(--text-primary)]">
                EARTH<span className="text-[var(--accent)]">PULSE</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[rgba(var(--accent-rgb),0.15)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.3)]">
                LIVE
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]">
              <span>{utcTime}</span>
              <span>•</span>
              <span className="text-[var(--accent)] uppercase">{mode} MODE</span>
            </div>
          </div>
        </button>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden xl:flex items-center p-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] text-[var(--accent)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Right: Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-b border-[var(--glass-border)] bg-[var(--bg)]/95 backdrop-blur-2xl p-4 mt-2 transition-all">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-mono transition-colors ${
                    isActive
                      ? 'bg-[rgba(var(--accent-rgb),0.15)] text-[var(--accent)] font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
