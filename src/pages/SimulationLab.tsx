import React, { useState, useEffect, useRef } from 'react'
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard'
import { Badge } from '../components/ui/Badge'
import { Waves, TreePine, Flame, RotateCcw, Sparkles, Smile, BookOpen } from 'lucide-react'

// ============================================================================
// VISUAL ANIMATION 1: COASTAL SEA-LEVEL INUNDATION CANVAS
// ============================================================================
const VisualSeaRiseCanvas: React.FC<{ temp: number }> = ({ temp }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || 600)
    const h = (canvas.height = 250)

    let waveOffset = 0
    let dripOffset = 0

    // Water level parameters
    const baseWaterLevel = h * 0.78
    const maxWaterRise = h * 0.44
    const riseFraction = (temp - 1.0) / 3.0 // 0 to 1

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      waveOffset += 0.04
      dripOffset += 0.1

      const currentWaterY = baseWaterLevel - riseFraction * maxWaterRise

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
      if (temp < 1.8) {
        skyGrad.addColorStop(0, '#0c4a6e')
        skyGrad.addColorStop(1, '#0284c7')
      } else if (temp < 3.0) {
        skyGrad.addColorStop(0, '#0f172a')
        skyGrad.addColorStop(1, '#1e293b')
      } else {
        skyGrad.addColorStop(0, '#450a0a')
        skyGrad.addColorStop(1, '#1f2937')
      }
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h)

      // The Sun (Sweating/Hot if temp > 2.5)
      const sunX = w * 0.45
      const sunY = 42
      ctx.fillStyle = temp > 2.5 ? '#f97316' : '#fde047'
      ctx.beginPath()
      ctx.arc(sunX, sunY, 18, 0, Math.PI * 2)
      ctx.fill()

      // Sun rays
      ctx.strokeStyle = temp > 2.5 ? 'rgba(249, 115, 22, 0.4)' : 'rgba(253, 224, 71, 0.4)'
      ctx.lineWidth = 1.5
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath()
        ctx.moveTo(sunX + Math.cos(a) * 22, sunY + Math.sin(a) * 22)
        ctx.lineTo(sunX + Math.cos(a) * 32, sunY + Math.sin(a) * 32)
        ctx.stroke()
      }

      // Melting Glacier on the far left
      const glacierW = 85
      const glacierH = Math.max(25, 110 - riseFraction * 70) // Shrinks as it melts!
      ctx.fillStyle = '#bae6fd'
      ctx.beginPath()
      ctx.moveTo(0, h * 0.75)
      ctx.lineTo(0, h * 0.75 - glacierH)
      ctx.lineTo(glacierW * 0.4, h * 0.75 - glacierH * 0.85)
      ctx.lineTo(glacierW * 0.7, h * 0.75 - glacierH * 0.6)
      ctx.lineTo(glacierW, h * 0.75)
      ctx.closePath()
      ctx.fill()

      // Glacier meltwater drip drops
      if (temp > 1.2) {
        ctx.fillStyle = '#38bdf8'
        for (let d = 0; d < 3; d++) {
          const dropY = (h * 0.75 - glacierH * 0.5) + ((dripOffset * 15 + d * 25) % 40)
          ctx.beginPath()
          ctx.arc(glacierW * 0.6 + d * 6, dropY, 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Ground Profile: Sand beach sloping upward to elevated city
      ctx.fillStyle = '#334155'
      ctx.beginPath()
      ctx.moveTo(w * 0.28, h)
      ctx.lineTo(w * 0.28, h * 0.8) // Beach shoreline
      ctx.lineTo(w * 0.5, h * 0.68) // Low-lying beach neighborhood
      ctx.lineTo(w * 0.68, h * 0.58) // Sea wall barrier
      ctx.lineTo(w * 0.72, h * 0.52) // City foundation
      ctx.lineTo(w, h * 0.52)
      ctx.lineTo(w, h)
      ctx.closePath()
      ctx.fill()

      // Golden Sand beach overlay
      ctx.fillStyle = '#eab308'
      ctx.beginPath()
      ctx.moveTo(w * 0.28, h)
      ctx.lineTo(w * 0.28, h * 0.8)
      ctx.lineTo(w * 0.5, h * 0.68)
      ctx.lineTo(w * 0.5, h)
      ctx.closePath()
      ctx.fill()

      // Cute Beach Umbrella & Lounge Chair (gets flooded when water rises!)
      const umbX = w * 0.38
      const umbY = h * 0.74
      ctx.strokeStyle = '#f8fafc'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(umbX, umbY)
      ctx.lineTo(umbX, umbY - 18)
      ctx.stroke()
      // Umbrella top
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(umbX, umbY - 18, 12, Math.PI, 0)
      ctx.fill()

      // Coastal Bungalow Home (low ground)
      const h1X = w * 0.44
      const h1Y = h * 0.71
      ctx.fillStyle = '#f87171'
      ctx.fillRect(h1X, h1Y - 16, 20, 16)
      // Roof
      ctx.fillStyle = '#b91c1c'
      ctx.beginPath()
      ctx.moveTo(h1X - 3, h1Y - 16)
      ctx.lineTo(h1X + 10, h1Y - 26)
      ctx.lineTo(h1X + 23, h1Y - 16)
      ctx.closePath()
      ctx.fill()

      // Palm Tree on beach
      ctx.strokeStyle = '#78350f'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(w * 0.32, h * 0.8)
      ctx.quadraticCurveTo(w * 0.33, h * 0.72, w * 0.35, h * 0.66)
      ctx.stroke()
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.arc(w * 0.35, h * 0.66, 10, 0, Math.PI * 2)
      ctx.fill()

      // Concrete Sea Wall
      ctx.fillStyle = '#94a3b8'
      ctx.fillRect(w * 0.67, h * 0.52, 12, h * 0.16)

      // Downtown City Buildings (Elevated high ground)
      const bldgs = [
        { x: w * 0.74, w: 24, h: 80, color: '#38bdf8' },
        { x: w * 0.81, w: 30, h: 105, color: '#0284c7' },
        { x: w * 0.89, w: 26, h: 70, color: '#0369a1' },
      ]
      bldgs.forEach((b) => {
        ctx.fillStyle = b.color
        ctx.fillRect(b.x, h * 0.52 - b.h, b.w, b.h)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        for (let wy = h * 0.52 - b.h + 8; wy < h * 0.52 - 8; wy += 12) {
          ctx.fillRect(b.x + 4, wy, 4, 6)
          ctx.fillRect(b.x + b.w - 8, wy, 4, 6)
        }
      })

      // ANIMATED OCEAN WATER WITH SWELLING WAVES
      ctx.fillStyle = 'rgba(14, 165, 233, 0.75)'
      ctx.beginPath()
      ctx.moveTo(0, h)
      ctx.lineTo(0, currentWaterY)
      for (let x = 0; x <= w; x += 10) {
        const wave = Math.sin(x * 0.03 + waveOffset) * 4 + Math.cos(x * 0.015 - waveOffset) * 3
        ctx.lineTo(x, currentWaterY + wave)
      }
      ctx.lineTo(w, h)
      ctx.closePath()
      ctx.fill()

      // Deep Ocean Body
      ctx.fillStyle = 'rgba(3, 105, 161, 0.85)'
      ctx.fillRect(0, currentWaterY + 8, w * 0.38, h)

      // Cute animated swimming fish in the ocean
      const fishX = ((waveOffset * 30) % (w * 0.3)) + 15
      const fishY = currentWaterY + 28
      ctx.fillStyle = '#fb923c'
      ctx.beginPath()
      ctx.ellipse(fishX, fishY, 6, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(fishX - 6, fishY)
      ctx.lineTo(fishX - 10, fishY - 3)
      ctx.lineTo(fishX - 10, fishY + 3)
      ctx.closePath()
      ctx.fill()

      // On-Canvas Real-Time Alerts
      if (currentWaterY < h * 0.72) {
        ctx.fillStyle = '#fde047'
        ctx.font = 'bold 11px monospace'
        ctx.fillText('⚠️ BEACH UMBRELLA & BUNGALOW FLOODED', 20, 25)
      }
      if (currentWaterY < h * 0.54) {
        ctx.fillStyle = '#ef4444'
        ctx.font = 'bold 13px monospace'
        ctx.fillText('🚨 SEAWALL BREACHED: CITY DOWNTOWN FLOODING!', 20, 48)
      }

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [temp])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-400/30 shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-[250px] block" />
      <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-300">
        WATER LEVEL: +{Math.round(temp * 28)} cm above historic baseline
      </div>
    </div>
  )
}

// ============================================================================
// VISUAL ANIMATION 2: TROPICAL FOREST TREES CUT VS GROW CANVAS
// ============================================================================
const VisualForestCanvas: React.FC<{ logging: number; planting: number }> = ({ logging, planting }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || 600)
    const h = (canvas.height = 250)

    let wind = 0

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      wind += 0.03

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, h)
      sky.addColorStop(0, logging > 60 ? '#1f1a16' : '#082014')
      sky.addColorStop(1, logging > 60 ? '#38281a' : '#0d381e')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h)

      // Rolling Hills
      ctx.fillStyle = logging > 60 ? '#452c16' : '#14532d'
      ctx.beginPath()
      ctx.ellipse(w * 0.3, h * 0.85, w * 0.4, 60, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = logging > 60 ? '#382312' : '#166534'
      ctx.beginPath()
      ctx.ellipse(w * 0.75, h * 0.9, w * 0.45, 70, 0, 0, Math.PI * 2)
      ctx.fill()

      const totalTreeSlots = 20
      const deathFraction = logging / 100
      const plantBonus = planting / 50
      const survivingFraction = Math.max(0.1, Math.min(1.0, 1.0 - deathFraction * 0.8 + plantBonus * 0.5))
      const aliveCount = Math.round(survivingFraction * totalTreeSlots)

      for (let i = 0; i < totalTreeSlots; i++) {
        const tx = (i / totalTreeSlots) * (w - 40) + 30
        const ty = h * 0.78 + Math.sin(i * 1.5) * 15
        const isAlive = i < aliveCount

        if (isAlive) {
          // Tree Trunk
          ctx.fillStyle = '#5c3818'
          ctx.fillRect(tx - 3, ty - 22, 6, 22)

          // Swaying Foliage
          const sway = Math.sin(wind + i) * 3
          ctx.fillStyle = '#22c55e'
          ctx.beginPath()
          ctx.arc(tx + sway, ty - 32, 14, 0, Math.PI * 2)
          ctx.arc(tx - 8 + sway, ty - 24, 11, 0, Math.PI * 2)
          ctx.arc(tx + 8 + sway, ty - 24, 11, 0, Math.PI * 2)
          ctx.fill()

          // Inner foliage highlight
          ctx.fillStyle = '#4ade80'
          ctx.beginPath()
          ctx.arc(tx + sway - 3, ty - 34, 7, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Tree stump
          ctx.fillStyle = '#3e2311'
          ctx.fillRect(tx - 4, ty - 8, 8, 8)
          ctx.fillStyle = '#d97706'
          ctx.beginPath()
          ctx.ellipse(tx, ty - 8, 4, 2, 0, 0, Math.PI * 2)
          ctx.fill()

          // Smoke puff if actively logged
          if (logging > 50) {
            ctx.fillStyle = 'rgba(150, 150, 150, 0.4)'
            ctx.beginPath()
            ctx.arc(tx + Math.sin(wind * 2 + i) * 4, ty - 16, 4, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Sprouting baby saplings if planting is active
      if (planting > 15) {
        ctx.fillStyle = '#86efac'
        for (let s = 0; s < 4; s++) {
          const sx = w * 0.2 + s * 110 + Math.sin(s) * 20
          const sy = h * 0.84
          ctx.beginPath()
          ctx.arc(sx, sy, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Butterflies fluttering if forest is healthy
      if (aliveCount > 12) {
        ctx.fillStyle = '#fde047'
        const bx = w * 0.45 + Math.sin(wind * 2) * 50
        const by = h * 0.45 + Math.cos(wind * 2) * 25
        ctx.beginPath()
        ctx.arc(bx, by, 3, 0, Math.PI * 2)
        ctx.arc(bx + 4, by - 2, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [logging, planting])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-400/30 shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-[250px] block" />
      <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-emerald-300">
        CANOPY DENSITY: {Math.max(10, Math.round(100 - logging * 0.7 + planting * 0.6))}% intact
      </div>
    </div>
  )
}

// ============================================================================
// VISUAL ANIMATION 3: ATMOSPHERE SMOG-TO-SUNSHINE CANVAS
// ============================================================================
const VisualAtmosphereCanvas: React.FC<{ cleanPct: number }> = ({ cleanPct }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || 600)
    const h = (canvas.height = 250)

    let spin = 0

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      spin += 0.05

      const cleanFraction = cleanPct / 100 // 0.2 to 1.0

      // Sky transitions from dirty charcoal/orange smog to brilliant blue
      const sky = ctx.createLinearGradient(0, 0, 0, h)
      if (cleanFraction < 0.4) {
        sky.addColorStop(0, '#1c1917')
        sky.addColorStop(0.6, '#451a03')
        sky.addColorStop(1, '#78350f')
      } else if (cleanFraction < 0.75) {
        sky.addColorStop(0, '#0c4a6e')
        sky.addColorStop(0.7, '#075985')
        sky.addColorStop(1, '#0284c7')
      } else {
        sky.addColorStop(0, '#0284c7')
        sky.addColorStop(0.5, '#38bdf8')
        sky.addColorStop(1, '#7dd3fc')
      }
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h)

      // Golden Sun shining through if clean
      if (cleanFraction > 0.35) {
        const sunAlpha = Math.min(1, (cleanFraction - 0.35) * 2)
        ctx.fillStyle = `rgba(253, 224, 71, ${sunAlpha * 0.95})`
        ctx.beginPath()
        ctx.arc(w * 0.85, 50, 32, 0, Math.PI * 2)
        ctx.fill()

        // Sunbeams
        ctx.strokeStyle = `rgba(254, 240, 138, ${sunAlpha * 0.4})`
        ctx.lineWidth = 2
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath()
          ctx.moveTo(w * 0.85 + Math.cos(a) * 40, 50 + Math.sin(a) * 40)
          ctx.lineTo(w * 0.85 + Math.cos(a) * 60, 50 + Math.sin(a) * 60)
          ctx.stroke()
        }
      }

      // Ground Landscape
      ctx.fillStyle = cleanFraction > 0.6 ? '#15803d' : '#3f2e1e'
      ctx.beginPath()
      ctx.ellipse(w / 2, h * 0.92, w * 0.6, 50, 0, 0, Math.PI * 2)
      ctx.fill()

      // Dirty Smokestacks emitting brown plumes if fossil-heavy
      if (cleanFraction < 0.7) {
        const smogAlpha = 1 - cleanFraction
        ctx.fillStyle = '#334155'
        ctx.fillRect(w * 0.2, h * 0.68, 14, 40)
        ctx.fillRect(w * 0.28, h * 0.64, 18, 50)

        // Smog plumes
        ctx.fillStyle = `rgba(120, 113, 108, ${smogAlpha * 0.7})`
        ctx.beginPath()
        ctx.arc(w * 0.22, h * 0.58, 16, 0, Math.PI * 2)
        ctx.arc(w * 0.25, h * 0.48, 24, 0, Math.PI * 2)
        ctx.arc(w * 0.32, h * 0.42, 32, 0, Math.PI * 2)
        ctx.fill()
      }

      // Modern Wind Turbines & Solar panels if clean power > 30%
      if (cleanFraction > 0.3) {
        ctx.fillStyle = '#e2e8f0'
        ctx.fillRect(w * 0.65 - 2, h * 0.45, 4, 60)

        const bladeLen = 22
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 3
        for (let b = 0; b < 3; b++) {
          const bAngle = spin + (b * Math.PI * 2) / 3
          ctx.beginPath()
          ctx.moveTo(w * 0.65, h * 0.45)
          ctx.lineTo(w * 0.65 + Math.cos(bAngle) * bladeLen, h * 0.45 + Math.sin(bAngle) * bladeLen)
          ctx.stroke()
        }

        // Solar panels array
        ctx.fillStyle = '#1e3a8a'
        ctx.strokeStyle = '#60a5fa'
        ctx.lineWidth = 1.5
        ctx.fillRect(w * 0.45, h * 0.75, 30, 14)
        ctx.strokeRect(w * 0.45, h * 0.75, 30, 14)
      }

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [cleanPct])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-amber-400/30 shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-[250px] block" />
      <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-amber-300">
        ATMOSPHERE: {cleanPct >= 80 ? '☀️ CRISP & ZERO-EMISSIONS' : cleanPct >= 50 ? '⛅ PARTIALLY CLEARING' : '🏭 SMOGGY & HEAVY FOSSIL'}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN SIMULATION LAB PAGE
// ============================================================================
export const SimulationLab: React.FC = () => {
  const [activeSim, setActiveSim] = useState<'sea-level' | 'forest' | 'net-zero'>('sea-level')
  const [isKidMode, setIsKidMode] = useState<boolean>(true)

  // 1. Sea Level Rise Simulator State
  const [tempAnomaly, setTempAnomaly] = useState<number>(2.0)
  const seaRiseMm = Math.round(tempAnomaly * 280)
  const displacedPopulationMillions = Math.round(tempAnomaly * 82)
  const economicLossTrillions = (tempAnomaly * 4.2).toFixed(1)

  // 2. Forest Moratorium Simulator State
  const [loggingRate, setLoggingRate] = useState<number>(50)
  const [reforestationEffort, setReforestationEffort] = useState<number>(30)
  const forestCover2050 = Math.min(
    100,
    Math.max(20, Math.round(68 - (loggingRate / 100) * 28 + (reforestationEffort / 50) * 22))
  )
  const isNetSink = reforestationEffort * 1.5 > loggingRate * 0.8

  // 3. Net Zero Accelerator State
  const [cleanPowerPct, setCleanPowerPct] = useState<number>(65)
  const estimatedNetZeroYear = Math.max(2035, Math.min(2085, Math.round(2085 - cleanPowerPct * 0.6)))
  const peakWarmingEst = (1.5 + Math.max(0, (estimatedNetZeroYear - 2040) * 0.025)).toFixed(2)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="accent" size="sm" pulse>
          🎮 VISUAL PLANETARY EXPERIMENT LAB
        </Badge>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
          Visual Earth Simulation Lab
        </h1>
        <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Slide the controls and watch our planet physically react on screen! See coastlines flood, forests grow or vanish, and city skies clear into pure sunshine.
        </p>
      </div>

      {/* Explainer Mode Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-black/50 border border-white/10 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setIsKidMode(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              isKidMode
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>🧒 Simple & Visual (Kid-Friendly)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsKidMode(false)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              !isKidMode
                ? 'bg-[#6EE7F9] text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>🔬 Science & Telemetry</span>
          </button>
        </div>
      </div>

      {/* Simulator Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setActiveSim('sea-level')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all ${
            activeSim === 'sea-level'
              ? 'bg-[#6EE7F9] text-black shadow-[0_0_20px_rgba(110,231,249,0.5)] scale-105'
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Waves className="w-4 h-4" />
          <span>🌊 1. Ocean Water & Ice Melt</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSim('forest')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all ${
            activeSim === 'forest'
              ? 'bg-[#22C55E] text-black shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-105'
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          <TreePine className="w-4 h-4" />
          <span>🌲 2. Rainforest Trees & Animals</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSim('net-zero')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all ${
            activeSim === 'net-zero'
              ? 'bg-[#FFB020] text-black shadow-[0_0_20px_rgba(255,176,32,0.5)] scale-105'
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>☀️ 3. Smog to Sunshine Sweeper</span>
        </button>
      </div>

      {/* =========================================================
          MODULE 1: SEA LEVEL RISE
          ========================================================= */}
      {activeSim === 'sea-level' && (
        <LiquidGlassCard className="p-8 border-[#6EE7F9]/30 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌊</span>
                <h2 className="font-display font-bold text-2xl text-white">
                  The Coastal Flood Machine
                </h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                Slide global heat up to watch polar glaciers melt, water rise up the beach, and sea walls get tested!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTempAnomaly(1.5)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to +1.5°C</span>
            </button>
          </div>

          {/* DYNAMIC VISUAL ANIMATION CANVAS */}
          <VisualSeaRiseCanvas temp={tempAnomaly} />

          {/* Simple Metaphor vs Science Box */}
          {isKidMode ? (
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 flex items-start gap-3 text-xs leading-relaxed">
              <Smile className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-200 block mb-0.5 font-bold">🥤 The Melting Soda Glass Analogy:</strong>
                <p className="text-white/80">
                  Imagine dropping ice cubes into a glass that is already filled to the top with cold soda! When the ice cubes melt into water, the liquid spills over the edge and makes a puddle on your table. That is exactly what happens when Earth gets too warm: polar ice melts into the ocean and the water climbs up onto our beaches and city streets!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
              <BookOpen className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sky-200 block mb-0.5">🔬 Thermal Expansion & Cryospheric Mass Loss:</strong>
                <p className="text-white/80">
                  Total sea-level rise is governed by ΔSLR = ΔV_steric (thermal steric expansion via dV/dT = β·V0) + ΔM_cryo (mass loss from Greenland and Antarctic ice sheets). Every +1.0°C committed warming corresponds to approximately +280mm eustatic sea-level displacement.
                </p>
              </div>
            </div>
          )}

          {/* Interactive Slider */}
          <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-xs text-white/70">World Temperature Dial:</span>
              <span className="text-2xl font-bold text-[#6EE7F9]">
                +{tempAnomaly.toFixed(1)}°C Warming
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={tempAnomaly}
              onChange={(e) => setTempAnomaly(parseFloat(e.target.value))}
              className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#6EE7F9]"
            />
            <div className="flex justify-between text-[11px] font-mono text-white/50">
              <span>+1.0°C (Beach Safe)</span>
              <span className="text-emerald-400 font-bold">+1.5°C (Paris Safe Limit)</span>
              <span className="text-amber-400 font-bold">+2.0°C (Beach Flooded)</span>
              <span className="text-rose-400 font-bold">+4.0°C (City Submerged!)</span>
            </div>
          </div>

          {/* Impact Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-xs font-mono text-white/50 block mb-1">OCEAN WATER RISE</span>
              <span className="text-3xl font-bold font-display text-[#6EE7F9]">+{seaRiseMm} mm</span>
              <span className="text-[11px] font-mono text-white/40 block mt-1">({(seaRiseMm / 10).toFixed(1)} cm / {(seaRiseMm / 25.4).toFixed(1)} inches)</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-xs font-mono text-white/50 block mb-1">COASTAL HOMES AT RISK</span>
              <span className="text-3xl font-bold font-display text-rose-400">{displacedPopulationMillions} Million People</span>
              <span className="text-[11px] font-mono text-white/40 block mt-1">Need seawall defense or relocation</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-xs font-mono text-white/50 block mb-1">GLOBAL DAMAGE BILL</span>
              <span className="text-3xl font-bold font-display text-amber-300">${economicLossTrillions} Trillion</span>
              <span className="text-[11px] font-mono text-white/40 block mt-1">Ports, beachfront roads & bridges</span>
            </div>
          </div>
        </LiquidGlassCard>
      )}

      {/* =========================================================
          MODULE 2: FOREST CUT VS GROW
          ========================================================= */}
      {activeSim === 'forest' && (
        <LiquidGlassCard className="p-8 border-[#22C55E]/30 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌲</span>
                <h2 className="font-display font-bold text-2xl text-white">
                  The Rainforest Tree Machine
                </h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                Chop down trees with logging or plant new ones to watch green leaves, butterflies, and healthy canopies return!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoggingRate(20)
                setReforestationEffort(40)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plant & Protect Mode</span>
            </button>
          </div>

          {/* DYNAMIC VISUAL ANIMATION CANVAS */}
          <VisualForestCanvas logging={loggingRate} planting={reforestationEffort} />

          {/* Simple Metaphor vs Science Box */}
          {isKidMode ? (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-400/30 flex items-start gap-3 text-xs leading-relaxed">
              <Smile className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-200 block mb-0.5 font-bold">🫁 Earth's Giant Super-Lungs:</strong>
                <p className="text-white/80">
                  Trees are like planet Earth's giant green lungs! When factories and cars puff out smoke, trees inhale the dirty carbon air like a superpower vacuum cleaner and exhale cool, fresh oxygen for you, your pets, and wild animals to breathe!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
              <BookOpen className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-teal-200 block mb-0.5">🔬 Biospheric Carbon Sink Kinetics:</strong>
                <p className="text-white/80">
                  Net biospheric carbon exchange: dC/dt = NPP (Net Primary Productivity: GPP - Ra) - Rh - Deforestation Flux. Aboveground biomass sequestering 1.8 Gt CO2/yr across tropical rainforests prevents dieback tipping points.
                </p>
              </div>
            </div>
          )}

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-amber-300 font-bold">🪓 Tree Chopping / Logging:</span>
                <span className="text-white font-bold">{loggingRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={loggingRate}
                onChange={(e) => setLoggingRate(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/50">
                <span className="text-emerald-400">0% (Total Protection)</span>
                <span className="text-rose-400">100% (Clear Cut)</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-emerald-300 font-bold">🌱 Tree Planting / Restoring:</span>
                <span className="text-white font-bold">{reforestationEffort} Mha/yr</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={reforestationEffort}
                onChange={(e) => setReforestationEffort(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/50">
                <span>0 (No planting)</span>
                <span className="text-emerald-400">50 Million Hectares/yr</span>
              </div>
            </div>
          </div>

          {/* Impact Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-xs font-mono text-white/50 block mb-1">HEALTHY TREES REMAINING</span>
              <span className="text-3xl font-bold font-display text-[#22C55E]">{forestCover2050}%</span>
              <span className="text-[11px] font-mono text-white/40 block mt-1">Tipping boundary is 22%</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-xs font-mono text-white/50 block mb-1">EARTH'S LUNGS STATUS</span>
              <span className={`text-2xl font-bold font-display ${isNetSink ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isNetSink ? 'BREATHING CLEAN SINK' : 'BURNING CARBON SOURCE'}
              </span>
              <span className="text-[11px] font-mono text-white/40 block mt-1">{isNetSink ? 'Absorbing CO₂ from sky' : 'Emitting smoke into sky'}</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-xs font-mono text-white/50 block mb-1">ANIMALS & WILDLIFE</span>
              <span className={`text-2xl font-bold font-display ${forestCover2050 > 65 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {forestCover2050 > 65 ? 'THRIVING & SAFE' : 'LOSING HOMES'}
              </span>
              <span className="text-[11px] font-mono text-white/40 block mt-1">Jaguars, toucans, butterflies</span>
            </div>
          </div>
        </LiquidGlassCard>
      )}

      {/* =========================================================
          MODULE 3: NET ZERO SMOG CLEARING
          ========================================================= */}
      {activeSim === 'net-zero' && (
        <LiquidGlassCard className="p-8 border-[#FFB020]/30 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">☀️</span>
                <h2 className="font-display font-bold text-2xl text-white">
                  The Smog-to-Sunshine Machine
                </h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                Slide clean power from 20% to 100% to watch smokestacks vanish and the city sky fill with sunshine!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCleanPowerPct(100)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Max 100% Clean Grid</span>
            </button>
          </div>

          {/* DYNAMIC VISUAL ANIMATION CANVAS */}
          <VisualAtmosphereCanvas cleanPct={cleanPowerPct} />

          {/* Simple Metaphor vs Science Box */}
          {isKidMode ? (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-400/30 flex items-start gap-3 text-xs leading-relaxed">
              <Smile className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block mb-0.5 font-bold">🧹 The Sky Sweeper Analogy:</strong>
                <p className="text-white/80">
                  Smog is like a dusty, dirty blanket over our planet that makes the sky cough. When we install spinning wind turbines and glistening solar panels, we sweep away the dusty blanket so the golden sunbeams can shine and the air smells like fresh rain!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
              <BookOpen className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-orange-200 block mb-0.5">🔬 Atmospheric Aerosol Optical Depth (AOD):</strong>
                <p className="text-white/80">
                  Replacing fossil coal/gas thermal units with non-emitting renewables reduces PM2.5 particulate concentrations below WHO limits (&lt; 5 μg/m³), eliminating 4.2 million annual premature deaths from cardiopulmonary disease.
                </p>
              </div>
            </div>
          )}

          {/* Interactive Slider */}
          <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-xs text-white/70">Clean Power Grid Slider:</span>
              <span className="text-2xl font-bold text-[#FFB020]">
                {cleanPowerPct}% Clean Energy
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={cleanPowerPct}
              onChange={(e) => setCleanPowerPct(parseInt(e.target.value))}
              className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FFB020]"
            />
            <div className="flex justify-between text-[11px] font-mono text-white/50">
              <span>20% (Heavy Coal & Smog)</span>
              <span>60% (Transitioning)</span>
              <span className="text-emerald-400 font-bold">100% (Pure Clean Sun & Wind)</span>
            </div>
          </div>

          {/* Impact Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-xs font-mono text-white/50 block mb-1">YEAR WE REACH ZERO SMOG</span>
              <span className="text-3xl font-bold font-display text-[#FFB020]">Year {estimatedNetZeroYear}</span>
              <span className="text-[11px] font-mono text-white/40 block mt-1">Faster transition = earlier clean air</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-xs font-mono text-white/50 block mb-1">WARMING STOPS AT</span>
              <span className={`text-3xl font-bold font-display ${parseFloat(peakWarmingEst) <= 1.7 ? 'text-emerald-400' : 'text-rose-400'}`}>
                +{peakWarmingEst}°C
              </span>
              <span className="text-[11px] font-mono text-white/40 block mt-1">Prevents runaway tipping points</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-xs font-mono text-white/50 block mb-1">HEALTH & BREATHING</span>
              <span className="text-2xl font-bold font-display text-emerald-400">
                {cleanPowerPct > 75 ? 'CRYSTAL CLEAR' : cleanPowerPct > 45 ? 'MODERATE AIR' : 'ASTHMA SMOG'}
              </span>
              <span className="text-[11px] font-mono text-white/40 block mt-1">Prevents millions of lung illnesses</span>
            </div>
          </div>
        </LiquidGlassCard>
      )}
    </div>
  )
}
