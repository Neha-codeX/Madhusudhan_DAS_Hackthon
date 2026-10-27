import React, { useState, useEffect, useRef } from 'react'
import { LiquidGlassCard } from '../components/ui/LiquidGlassCard'
import { Badge } from '../components/ui/Badge'
import { frontierEnergySolutions } from '../data/climateData'
import confetti from 'canvas-confetti'
import {
  Atom,
  Flame,
  Zap,
  Sparkles,
  Award,
  Sun,
  Wind,
  Droplets,
  Mountain,
  Smile,
  BookOpen,
} from 'lucide-react'

// ============================================================================
// SIMULATION 1: SOLAR PHOTOVOLTAIC (PV) QUANTUM CELL
// ============================================================================
const SolarSimulator: React.FC<{ isKidMode: boolean }> = ({ isKidMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [irradiance, setIrradiance] = useState(950) // W/m^2 (0 - 1200)
  const [cloudCover, setCloudCover] = useState(15) // % (0 - 100)
  const [tiltAngle, setTiltAngle] = useState(34) // deg (0 - 90)

  // Calculations
  const effectiveSun = Math.max(0, Math.round(irradiance * (1 - (cloudCover / 100) * 0.75)))
  const tiltEfficiency = Math.max(0.2, Math.cos(((tiltAngle - 35) * Math.PI) / 180))
  const powerOutputGW = ((effectiveSun / 1000) * tiltEfficiency * 18.5).toFixed(2)
  const cellEfficiency = 28.4 // Perovskite-tandem
  const homesPowered = Math.round(parseFloat(powerOutputGW) * 420000)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || 560)
    const h = (canvas.height = 250)

    let photonOffset = 0
    let electronOffset = 0

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      photonOffset += 1.5 + (effectiveSun / 400)
      electronOffset += 1.2 + (parseFloat(powerOutputGW) / 4)

      // Dark Tech Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
      skyGrad.addColorStop(0, '#04141E')
      skyGrad.addColorStop(1, '#072538')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h)

      // Glowing Sun in upper-left
      const sunX = 70
      const sunY = 55
      const sunRadius = 24 + (effectiveSun / 1200) * 8

      // Sun halo
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, sunRadius * 2.2)
      sunGlow.addColorStop(0, 'rgba(253, 224, 71, 0.9)')
      sunGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)')
      sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)')
      ctx.fillStyle = sunGlow
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius * 2.2, 0, Math.PI * 2)
      ctx.fill()

      // Core Sun
      ctx.fillStyle = '#FDE047'
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
      ctx.fill()

      // Clouds (if cloud cover > 10%)
      if (cloudCover > 10) {
        ctx.fillStyle = `rgba(148, 163, 184, ${(cloudCover / 100) * 0.7})`
        ctx.beginPath()
        ctx.arc(sunX + 35, sunY - 5, 20, 0, Math.PI * 2)
        ctx.arc(sunX + 60, sunY - 12, 28, 0, Math.PI * 2)
        ctx.arc(sunX + 90, sunY - 5, 22, 0, Math.PI * 2)
        ctx.fill()
      }

      // PV Solar Panel Wafer
      const panelX = w * 0.38
      const panelY = h * 0.58
      const panelW = 160
      const panelH = 50

      // Anti-reflective Top Layer
      ctx.fillStyle = '#0284c7'
      ctx.fillRect(panelX, panelY - 10, panelW, 10)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 8px monospace'
      ctx.fillText('N-TYPE EMITTER LAYER', panelX + 22, panelY - 2)

      // P-N Depletion Junction
      const pnGrad = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH)
      pnGrad.addColorStop(0, '#0369a1')
      pnGrad.addColorStop(0.5, '#0f766e')
      pnGrad.addColorStop(1, '#064e3b')
      ctx.fillStyle = pnGrad
      ctx.fillRect(panelX, panelY, panelW, panelH)

      // Silicon Grid contacts
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 1.2
      for (let gx = panelX + 15; gx < panelX + panelW; gx += 20) {
        ctx.beginPath()
        ctx.moveTo(gx, panelY)
        ctx.lineTo(gx, panelY + panelH)
        ctx.stroke()
      }

      // Substrate base
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(panelX, panelY + panelH, panelW, 12)
      ctx.fillStyle = '#94a3b8'
      ctx.font = '8px monospace'
      ctx.fillText('P-TYPE SILICON BASE', panelX + 26, panelY + panelH + 9)

      // Streaming Light Photons (Gold Packets)
      if (effectiveSun > 50) {
        ctx.strokeStyle = '#FDE047'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 8])
        ctx.lineDashOffset = -photonOffset

        const rayCount = 5
        for (let r = 0; r < rayCount; r++) {
          const startX = sunX + r * 12
          const startY = sunY + 10
          const targetX = panelX + 20 + r * 30
          const targetY = panelY - 5

          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(targetX, targetY)
          ctx.stroke()
        }
        ctx.setLineDash([])
      }

      // Free Electrons (Cyan particles flowing into external circuit)
      const electronCount = Math.min(18, Math.round((effectiveSun / 1200) * 16))
      ctx.fillStyle = '#38BDF8'
      ctx.shadowColor = '#38BDF8'
      ctx.shadowBlur = 6

      for (let e = 0; e < electronCount; e++) {
        const progress = ((electronOffset + e * 35) % 200) / 200
        const ex = panelX + progress * panelW
        const ey = panelY + 12 + Math.sin(progress * Math.PI * 4) * 10
        ctx.beginPath()
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      // External Circuit Wire leading to Lightbulb / House
      const wireX1 = panelX + panelW
      const wireY1 = panelY + 5
      const wireX2 = w - 60
      const wireY2 = panelY + 5

      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      ctx.lineDashOffset = -electronOffset
      ctx.beginPath()
      ctx.moveTo(wireX1, wireY1)
      ctx.lineTo(wireX2, wireY2)
      ctx.lineTo(wireX2, h * 0.3)
      ctx.stroke()
      ctx.setLineDash([])

      // Lightbulb / House Load on right
      const bulbX = wireX2
      const bulbY = h * 0.3
      const glowIntensity = Math.min(1, parseFloat(powerOutputGW) / 14)

      // Bulb glow
      if (glowIntensity > 0.05) {
        const bGlow = ctx.createRadialGradient(bulbX, bulbY, 2, bulbX, bulbY, 35 * glowIntensity)
        bGlow.addColorStop(0, `rgba(253, 224, 71, ${glowIntensity})`)
        bGlow.addColorStop(1, 'rgba(253, 224, 71, 0)')
        ctx.fillStyle = bGlow
        ctx.beginPath()
        ctx.arc(bulbX, bulbY, 35 * glowIntensity, 0, Math.PI * 2)
        ctx.fill()
      }

      // Bulb body
      ctx.fillStyle = glowIntensity > 0.3 ? '#FDE047' : '#475569'
      ctx.beginPath()
      ctx.arc(bulbX, bulbY, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(bulbX - 6, bulbY + 12, 12, 8)

      // Indicator Text
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 9px monospace'
      ctx.fillText(glowIntensity > 0.1 ? '⚡ POWERED' : '💤 NO SUN', bulbX - 25, bulbY - 20)

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [irradiance, cloudCover, tiltAngle, effectiveSun, powerOutputGW])

  return (
    <div className="space-y-4">
      {/* Visual Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-amber-400/30 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-[250px] block" />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-amber-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>SOLAR FLUX: {effectiveSun} W/m² (Effective Photons)</span>
        </div>
      </div>

      {/* Kid / Simple Analogy Callout vs Deep Science */}
      {isKidMode ? (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-400/30 flex items-start gap-3 text-xs leading-relaxed">
          <Smile className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-200 block mb-0.5 font-bold">🧒 How it works in simple words:</strong>
            <p className="text-white/80">
              Imagine sunlight is made of billions of tiny, energetic ping-pong balls called <strong className="text-amber-300">photons</strong>! When they hit the dark solar glass, they crash into sleepy electrons resting in silicon crystals and bounce them free into a wire slide. That rushing river of electrons makes your lights, phone, and TV turn on!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
          <BookOpen className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-200 block mb-0.5">🔬 Quantum Bandgap Physics:</strong>
            <p className="text-white/80">
              Photons with energy exceeding silicon bandgap (hν &gt; Eg = 1.34 eV) induce electron-hole pair generation. The built-in electric field of the p-n depletion zone sweeps excited conduction-band electrons into the emitter contact grid, yielding a carrier drift current Jsc = 42.4 mA/cm².
            </p>
          </div>
        </div>
      )}

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Sunlight Irradiance:</span>
            <span className="font-bold text-amber-400">{irradiance} W/m²</span>
          </div>
          <input
            type="range"
            min="0"
            max="1200"
            step="50"
            value={irradiance}
            onChange={(e) => setIrradiance(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/50">
            <span>0 (Night)</span>
            <span>800 (Morning)</span>
            <span className="text-amber-400">1200 (Noon Desert)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Cloud Cover:</span>
            <span className="font-bold text-sky-300">{cloudCover}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={cloudCover}
            onChange={(e) => setCloudCover(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-sky-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/50">
            <span>0% (Clear Sky)</span>
            <span>50% (Scattered)</span>
            <span className="text-slate-400">100% (Storm Overcast)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Array Zenith Tilt:</span>
            <span className="font-bold text-emerald-400">{tiltAngle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            value={tiltAngle}
            onChange={(e) => setTiltAngle(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/50">
            <span>0° (Flat Roof)</span>
            <span className="text-emerald-400 font-bold">34° (Optimal)</span>
            <span>90° (Vertical Wall)</span>
          </div>
        </div>
      </div>

      {/* Output Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">OUTPUT POWER</span>
          <span className="text-xl font-bold text-amber-400">{powerOutputGW} GW</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">HOMES POWERED</span>
          <span className="text-xl font-bold text-emerald-400">{homesPowered.toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">CELL EFFICIENCY</span>
          <span className="text-xl font-bold text-[#38BDF8]">{cellEfficiency}%</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">CO2 AVOIDED</span>
          <span className="text-xl font-bold text-emerald-300">{(parseFloat(powerOutputGW) * 0.45).toFixed(1)} Mt/yr</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIMULATION 2: 15MW AERODYNAMIC WIND TURBINE
// ============================================================================
const WindSimulator: React.FC<{ isKidMode: boolean }> = ({ isKidMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [windSpeed, setWindSpeed] = useState(11.5) // m/s (0 - 30)
  const [bladePitch, setBladePitch] = useState(3.5) // deg (0 - 45)

  // Calculations
  const isCutoff = windSpeed > 25
  const isCutIn = windSpeed >= 3.0
  const isOperating = isCutIn && !isCutoff

  // Rotor speed & power calculation
  const rotorRpm = isOperating ? Math.min(16.5, Math.max(0, (windSpeed - 3) * 1.3 - (bladePitch / 45) * 4)).toFixed(1) : '0.0'
  const powerOutputMW = isOperating ? Math.min(15.0, Math.max(0, 0.5 * 1.225 * Math.PI * (118 ** 2) * (windSpeed ** 3) * 0.45 * 1e-6 * (1 - bladePitch / 50))).toFixed(1) : '0.0'
  const clusterGW = (parseFloat(powerOutputMW) * 0.8).toFixed(2)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || 560)
    const h = (canvas.height = 250)

    let rotorAngle = 0
    let windOffset = 0

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      windOffset += windSpeed * 0.4
      if (isOperating) {
        rotorAngle += (parseFloat(rotorRpm) / 60) * 0.35
      }

      // Background Sky & Ocean
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
      skyGrad.addColorStop(0, '#04141E')
      skyGrad.addColorStop(0.8, '#0a2e47')
      skyGrad.addColorStop(1, '#053e5c')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h)

      // Ocean Waves
      ctx.fillStyle = '#0369a1'
      ctx.beginPath()
      ctx.moveTo(0, h)
      ctx.lineTo(0, h * 0.88)
      for (let x = 0; x <= w; x += 15) {
        ctx.lineTo(x, h * 0.88 + Math.sin(x * 0.05 + windOffset * 0.2) * 3)
      }
      ctx.lineTo(w, h)
      ctx.closePath()
      ctx.fill()

      // Wind Flow Vectors (cyan streamlined curves)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([12, 10])
      ctx.lineDashOffset = -windOffset

      for (let y = 35; y < h * 0.8; y += 38) {
        ctx.beginPath()
        ctx.moveTo(10, y)
        ctx.quadraticCurveTo(w * 0.4, y + Math.sin(y) * 10, w - 10, y)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Offshore Monopile Tower
      const towerBaseX = w * 0.52
      const hubX = towerBaseX
      const hubY = h * 0.4

      ctx.fillStyle = '#64748b'
      ctx.beginPath()
      ctx.moveTo(towerBaseX - 8, hubY + 10)
      ctx.lineTo(towerBaseX + 8, hubY + 10)
      ctx.lineTo(towerBaseX + 16, h * 0.9)
      ctx.lineTo(towerBaseX - 16, h * 0.9)
      ctx.closePath()
      ctx.fill()

      // Nacelle & Generator Housing
      ctx.fillStyle = '#334155'
      ctx.fillRect(hubX - 16, hubY - 10, 48, 20)
      ctx.strokeStyle = '#38bdf8'
      ctx.strokeRect(hubX - 16, hubY - 10, 48, 20)

      // Internal spinning generator coils
      if (isOperating) {
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.arc(hubX + 12, hubY, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      // 3 Blades Rotor
      const bladeLength = 70
      ctx.save()
      ctx.translate(hubX - 14, hubY)
      ctx.rotate(rotorAngle)

      // Hub Center Cap
      ctx.fillStyle = '#e2e8f0'
      ctx.beginPath()
      ctx.arc(0, 0, 9, 0, Math.PI * 2)
      ctx.fill()

      // 3 Airfoil Blades (120 degrees apart)
      for (let b = 0; b < 3; b++) {
        ctx.save()
        ctx.rotate((b * Math.PI * 2) / 3)

        // Blade contour
        ctx.fillStyle = '#f8fafc'
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(-3, 0)
        ctx.quadraticCurveTo(-6, -bladeLength * 0.5, 0, -bladeLength)
        ctx.quadraticCurveTo(5, -bladeLength * 0.5, 3, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // Red tip warning stripe
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.rect(-2, -bladeLength, 4, 12)
        ctx.fill()

        ctx.restore()
      }
      ctx.restore()

      // Electricity cable down the tower
      if (isOperating) {
        ctx.strokeStyle = '#34d399'
        ctx.lineWidth = 2.5
        ctx.setLineDash([4, 4])
        ctx.lineDashOffset = -windOffset
        ctx.beginPath()
        ctx.moveTo(hubX, hubY + 10)
        ctx.lineTo(hubX, h * 0.9)
        ctx.lineTo(w - 20, h * 0.9)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Storm Cutoff Alert
      if (isCutoff) {
        ctx.fillStyle = '#ef4444'
        ctx.font = 'bold 12px monospace'
        ctx.fillText('🚨 STORM CUTOFF: BLADES FEATHERED (WIND > 25 m/s)', 30, 30)
      } else if (!isCutIn) {
        ctx.fillStyle = '#fbbf24'
        ctx.font = 'bold 12px monospace'
        ctx.fillText('⏳ CALM AIR: WAITING FOR CUT-IN SPEED (> 3 m/s)', 30, 30)
      }

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [windSpeed, bladePitch, isOperating, rotorRpm])

  return (
    <div className="space-y-4">
      {/* Visual Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-cyan-400/30 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-[250px] block" />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isOperating ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
          <span>ROTOR STATUS: {isOperating ? `${rotorRpm} RPM (ACTIVE LIFT)` : isCutoff ? 'STORM BRAKED' : 'IDLE'}</span>
        </div>
      </div>

      {/* Kid / Simple Analogy Callout vs Deep Science */}
      {isKidMode ? (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 flex items-start gap-3 text-xs leading-relaxed">
          <Smile className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-200 block mb-0.5 font-bold">🧒 How it works in simple words:</strong>
            <p className="text-white/80">
              Like blowing on a giant pinwheel! The invisible push of ocean wind hugs curved airplane-shaped wings, lifting them so they spin round and round. Inside the top box, the blades spin a huge magnet wrapped in copper wires, capturing <strong className="text-cyan-300">lightning on a leash</strong> to send power straight to your town!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
          <BookOpen className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sky-200 block mb-0.5">🔬 Aerodynamic Fluid & Generator Physics:</strong>
            <p className="text-white/80">
              Crossflow over NACA 64-series airfoils induces asymmetric static pressure distributions (Bernoulli lift). Mechanical shaft power is constrained by Betz limit (Cp,max = 59.3%), transferred via a direct-drive synchronous permanent-magnet generator into undersea ±320kV HVDC transmission.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Wind Velocity:</span>
            <span className="font-bold text-[#38BDF8]">{windSpeed} m/s</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="0.5"
            value={windSpeed}
            onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-[#38BDF8] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/50">
            <span>0 m/s (Calm)</span>
            <span className="text-emerald-400 font-bold">12 m/s (Rated Peak)</span>
            <span className="text-rose-400">25+ m/s (Storm Shutoff)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Blade Pitch Angle:</span>
            <span className="font-bold text-emerald-400">{bladePitch}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="45"
            step="0.5"
            value={bladePitch}
            onChange={(e) => setBladePitch(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/50">
            <span className="text-emerald-400 font-bold">0° (Max Torque)</span>
            <span>15° (Partial Feather)</span>
            <span>45° (Storm Brake)</span>
          </div>
        </div>
      </div>

      {/* Telemetry Output */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">TURBINE OUTPUT</span>
          <span className="text-xl font-bold text-sky-400">{powerOutputMW} MW</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">CLUSTER TOTAL</span>
          <span className="text-xl font-bold text-emerald-400">{clusterGW} GW</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">ROTOR VELOCITY</span>
          <span className="text-xl font-bold text-white">{rotorRpm} RPM</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">LCOE</span>
          <span className="text-xl font-bold text-teal-300">$44 / MWh</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIMULATION 3: HYDROELECTRIC DAM & PELTON RUNNER
// ============================================================================
const HydroSimulator: React.FC<{ isKidMode: boolean }> = ({ isKidMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gateValve, setGateValve] = useState(70) // % open (0 - 100)
  const [headHeight, setHeadHeight] = useState(180) // meters (50 - 250)

  // Calculations
  const flowRateM3s = Math.round((gateValve / 100) * 850)
  const hydroPowerMW = Math.round(0.92 * 1000 * 9.81 * flowRateM3s * headHeight * 1e-6)
  const powerGW = (hydroPowerMW / 1000).toFixed(2)
  const waterVelocity = Math.round(Math.sqrt(2 * 9.81 * headHeight))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || 560)
    const h = (canvas.height = 250)

    let waterFlowOffset = 0
    let turbineAngle = 0

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      const flowSpeed = (flowRateM3s / 850) * 6
      waterFlowOffset += flowSpeed
      turbineAngle += flowSpeed * 0.08

      // Sky
      ctx.fillStyle = '#051824'
      ctx.fillRect(0, 0, w, h)

      // Mountain reservoir rock on left
      ctx.fillStyle = '#1e293b'
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(w * 0.35, 0)
      ctx.lineTo(w * 0.35, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()

      // High Mountain Water Reservoir (left)
      const waterLevelY = h * 0.25 - (headHeight / 250) * 20
      ctx.fillStyle = 'rgba(14, 165, 233, 0.85)'
      ctx.fillRect(0, waterLevelY, w * 0.35, h - waterLevelY)

      // Water Surface Waves
      ctx.fillStyle = '#38bdf8'
      ctx.beginPath()
      ctx.moveTo(0, waterLevelY)
      for (let x = 0; x <= w * 0.35; x += 10) {
        ctx.lineTo(x, waterLevelY + Math.sin(x * 0.1 + waterFlowOffset * 0.2) * 2)
      }
      ctx.lineTo(w * 0.35, waterLevelY + 8)
      ctx.lineTo(0, waterLevelY + 8)
      ctx.closePath()
      ctx.fill()

      // Massive Concrete Gravity Dam (middle slope)
      ctx.fillStyle = '#475569'
      ctx.beginPath()
      ctx.moveTo(w * 0.35, waterLevelY - 10)
      ctx.lineTo(w * 0.42, waterLevelY - 10)
      ctx.lineTo(w * 0.62, h * 0.85)
      ctx.lineTo(w * 0.35, h * 0.85)
      ctx.closePath()
      ctx.fill()

      // Steel Penstock Pipe (slanted tube through the dam)
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 14
      ctx.beginPath()
      ctx.moveTo(w * 0.35, waterLevelY + 25)
      ctx.lineTo(w * 0.65, h * 0.8)
      ctx.stroke()

      // Rushing Water inside Penstock
      if (gateValve > 5) {
        ctx.strokeStyle = '#67e8f9'
        ctx.lineWidth = 8
        ctx.setLineDash([8, 6])
        ctx.lineDashOffset = -waterFlowOffset * 2
        ctx.beginPath()
        ctx.moveTo(w * 0.35, waterLevelY + 25)
        ctx.lineTo(w * 0.65, h * 0.8)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Valve Gate visual indicator
      ctx.fillStyle = gateValve > 50 ? '#34d399' : '#f59e0b'
      ctx.fillRect(w * 0.38, waterLevelY + 15, 6, 18)

      // Powerhouse Building (lower right)
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(w * 0.68, h * 0.65, 90, h * 0.35)
      ctx.strokeStyle = '#64748b'
      ctx.strokeRect(w * 0.68, h * 0.65, 90, h * 0.35)

      // Spinning Pelton Waterwheel / Turbine Runner
      const tX = w * 0.76
      const tY = h * 0.78
      const tR = 24

      ctx.save()
      ctx.translate(tX, tY)
      ctx.rotate(turbineAngle)

      // Wheel Rim
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(0, 0, tR, 0, Math.PI * 2)
      ctx.stroke()

      // Buckets / Spoons
      for (let s = 0; s < 6; s++) {
        ctx.save()
        ctx.rotate((s * Math.PI * 2) / 6)
        ctx.fillStyle = '#e2e8f0'
        ctx.beginPath()
        ctx.arc(tR, 0, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      ctx.restore()

      // Water spray droplets hitting the turbine
      if (gateValve > 5) {
        ctx.fillStyle = '#bae6fd'
        for (let d = 0; d < 8; d++) {
          const dx = tX - 12 + Math.sin(waterFlowOffset + d) * 12
          const dy = tY - 8 + Math.cos(waterFlowOffset + d) * 10
          ctx.beginPath()
          ctx.arc(dx, dy, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Tailrace water outlet
      ctx.fillStyle = 'rgba(14, 165, 233, 0.7)'
      ctx.fillRect(w * 0.84, h * 0.88, w * 0.16, h * 0.12)

      // Power lines from powerhouse
      if (gateValve > 10) {
        ctx.strokeStyle = '#34d399'
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.lineDashOffset = -waterFlowOffset
        ctx.beginPath()
        ctx.moveTo(w * 0.76, h * 0.65)
        ctx.lineTo(w * 0.76, h * 0.45)
        ctx.lineTo(w - 10, h * 0.45)
        ctx.stroke()
        ctx.setLineDash([])
      }

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [gateValve, headHeight, flowRateM3s])

  return (
    <div className="space-y-4">
      {/* Visual Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-teal-400/30 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-[250px] block" />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-teal-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>HYDROSTATIC HEAD: {headHeight}m | WATER SPEED: {waterVelocity} m/s</span>
        </div>
      </div>

      {/* Kid / Simple Analogy Callout vs Deep Science */}
      {isKidMode ? (
        <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-400/30 flex items-start gap-3 text-xs leading-relaxed">
          <Smile className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-teal-200 block mb-0.5 font-bold">🧒 How it works in simple words:</strong>
            <p className="text-white/80">
              Like a giant waterpark slide powering an entire city! Water held high up in the lake is heavy. When we open the pipe gate, gravity pulls the water down super fast, blasting against a wheel with metal cups. That waterwheel spins a generator, making <strong className="text-teal-300">clean, reliable electricity 24 hours a day</strong>!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
          <BookOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-200 block mb-0.5">🔬 Hydrodynamic Potential Equations:</strong>
            <p className="text-white/80">
              Gravitational energy conversion: P = η · ρ · g · Q · H. High-pressure water accelerates through the penstock nozzle, converting potential head into kinetic impulse jets (v = √(2gH)) driving Pelton turbine runners at 92%+ hydrodynamic efficiency.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Penstock Valve Opening:</span>
            <span className="font-bold text-teal-400">{gateValve}% ({flowRateM3s} m³/s)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={gateValve}
            onChange={(e) => setGateValve(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-teal-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/50">
            <span>0% (Closed Gate)</span>
            <span>50% (Standard Flow)</span>
            <span className="text-teal-400">100% (Maximum Surge)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Reservoir Head (Height Drop):</span>
            <span className="font-bold text-[#38BDF8]">{headHeight} meters</span>
          </div>
          <input
            type="range"
            min="50"
            max="250"
            value={headHeight}
            onChange={(e) => setHeadHeight(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-[#38BDF8] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/50">
            <span>50m (Run of River)</span>
            <span>150m (Medium Dam)</span>
            <span className="text-sky-300 font-bold">250m (High Mountain Dam)</span>
          </div>
        </div>
      </div>

      {/* Telemetry Output */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">OUTPUT POWER</span>
          <span className="text-xl font-bold text-teal-400">{powerGW} GW</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">WATER FLOW</span>
          <span className="text-xl font-bold text-sky-400">{flowRateM3s} m³/s</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">RAMP TIME</span>
          <span className="text-xl font-bold text-emerald-400">&lt; 15 sec</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">BASELOAD STATUS</span>
          <span className="text-xl font-bold text-white">100% Dispatchable</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIMULATION 4: GEOTHERMAL EARTH HEAT & MAGMA STEAM
// ============================================================================
const GeothermalSimulator: React.FC<{ isKidMode: boolean }> = ({ isKidMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [boreholeDepthKm, setBoreholeDepthKm] = useState(3.5) // km (1 - 5)
  const [subsurfaceTempC, setSubsurfaceTempC] = useState(260) // C (120 - 450)

  // Calculations
  const steamPressureBar = Math.round((boreholeDepthKm / 5) * 85 + (subsurfaceTempC / 450) * 95)
  const powerOutputMW = Math.round((steamPressureBar / 180) * 1250)
  const powerGW = (powerOutputMW / 1000).toFixed(2)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || 560)
    const h = (canvas.height = 250)

    let steamOffset = 0

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      steamOffset += 2.0

      // Surface Layer (top 25%): Grassy land & sky
      ctx.fillStyle = '#051824'
      ctx.fillRect(0, 0, w, h * 0.25)

      // Earth Strata (Cross-section)
      // Layer 1: Soil & Sedimentary
      ctx.fillStyle = '#3f2e1e'
      ctx.fillRect(0, h * 0.25, w, h * 0.25)
      // Layer 2: Hard Basalt / Granite Rock
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, h * 0.5, w, h * 0.3)
      // Layer 3: Magma Chamber (bottom 20%)
      const magmaGrad = ctx.createLinearGradient(0, h * 0.8, 0, h)
      magmaGrad.addColorStop(0, '#ea580c')
      magmaGrad.addColorStop(0.5, '#dc2626')
      magmaGrad.addColorStop(1, '#7f1d1d')
      ctx.fillStyle = magmaGrad
      ctx.fillRect(0, h * 0.8, w, h * 0.2)

      // Magma glow particles
      ctx.fillStyle = '#fde047'
      for (let m = 0; m < 6; m++) {
        const mx = (w * 0.15) + (m * 65) + Math.sin(steamOffset * 0.1 + m) * 10
        const my = h * 0.88 + Math.cos(steamOffset * 0.1 + m) * 4
        ctx.beginPath()
        ctx.arc(mx, my, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Geothermal Plant Building on surface
      ctx.fillStyle = '#334155'
      ctx.fillRect(w * 0.45, h * 0.12, 60, h * 0.13)
      ctx.strokeStyle = '#38bdf8'
      ctx.strokeRect(w * 0.45, h * 0.12, 60, h * 0.13)

      // Cooling Tower puffing steam
      ctx.fillStyle = '#475569'
      ctx.beginPath()
      ctx.moveTo(w * 0.65, h * 0.25)
      ctx.lineTo(w * 0.68, h * 0.1)
      ctx.lineTo(w * 0.74, h * 0.1)
      ctx.lineTo(w * 0.77, h * 0.25)
      ctx.closePath()
      ctx.fill()

      // White Steam Puffs from cooling tower
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.beginPath()
      ctx.arc(w * 0.71, h * 0.06 - Math.sin(steamOffset * 0.1) * 3, 10, 0, Math.PI * 2)
      ctx.arc(w * 0.73, h * 0.02 - Math.cos(steamOffset * 0.1) * 4, 14, 0, Math.PI * 2)
      ctx.fill()

      // Injection Well (Cold Water down, Blue)
      const wellX1 = w * 0.42
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 4
      ctx.setLineDash([6, 6])
      ctx.lineDashOffset = steamOffset
      ctx.beginPath()
      ctx.moveTo(wellX1, h * 0.25)
      ctx.lineTo(wellX1, h * 0.8)
      ctx.stroke()
      ctx.setLineDash([])

      // Production Well (Superheated Steam up, Red/White)
      const wellX2 = w * 0.54
      ctx.strokeStyle = '#f97316'
      ctx.lineWidth = 4
      ctx.setLineDash([6, 6])
      ctx.lineDashOffset = -steamOffset * 1.5
      ctx.beginPath()
      ctx.moveTo(wellX2, h * 0.8)
      ctx.lineTo(wellX2, h * 0.25)
      ctx.stroke()
      ctx.setLineDash([])

      // Fractured hot rock zone connecting the two wells
      ctx.strokeStyle = '#fca5a5'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(wellX1, h * 0.8)
      ctx.lineTo(w * 0.48, h * 0.82)
      ctx.lineTo(wellX2, h * 0.8)
      ctx.stroke()

      // Indicator labels on canvas
      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 8px monospace'
      ctx.fillText('COLD WATER INJECTION ↓', wellX1 - 40, h * 0.4)

      ctx.fillStyle = '#f97316'
      ctx.font = 'bold 8px monospace'
      ctx.fillText('SUPERHEATED STEAM ↑', wellX2 + 8, h * 0.4)

      ctx.fillStyle = '#fde047'
      ctx.font = 'bold 9px monospace'
      ctx.fillText(`MAGMA HEAT: ${subsurfaceTempC}°C`, w * 0.38, h * 0.94)

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [boreholeDepthKm, subsurfaceTempC])

  return (
    <div className="space-y-4">
      {/* Visual Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-orange-400/30 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-[250px] block" />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-orange-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span>BOREHOLE DEPTH: {boreholeDepthKm} km | STEAM PRESSURE: {steamPressureBar} Bar</span>
        </div>
      </div>

      {/* Kid / Simple Analogy Callout vs Deep Science */}
      {isKidMode ? (
        <div className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-400/30 flex items-start gap-3 text-xs leading-relaxed">
          <Smile className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-orange-200 block mb-0.5 font-bold">🧒 How it works in simple words:</strong>
            <p className="text-white/80">
              Earth's giant underground teapot! The center of our planet is like a boiling soup pot of hot rocks. We drill a deep tube, squirt water down, and the hot rocks instantly flash it into <strong className="text-orange-300">whistling steam</strong> that shoots up to spin our fans. It works in the dark, during blizzards, and forever!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
          <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-200 block mb-0.5">🔬 Supercritical Thermodynamic Cycles:</strong>
            <p className="text-white/80">
              Enhanced Geothermal Systems (EGS) circulate pressurized brine through fractured crystalline granite at 250°C–450°C. Isobutane binary Rankine cycles extract enthalpy across heat exchangers with zero fugitive atmospheric emissions and 95%+ capacity factors.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Drilling Borehole Depth:</span>
            <span className="font-bold text-orange-400">{boreholeDepthKm} km</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="5.0"
            step="0.1"
            value={boreholeDepthKm}
            onChange={(e) => setBoreholeDepthKm(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-orange-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/50">
            <span>1 km (Shallow)</span>
            <span>3.5 km (Deep Sedimentary)</span>
            <span className="text-orange-400 font-bold">5 km (Supercritical Crust)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Subsurface Magma Heat:</span>
            <span className="font-bold text-amber-400">{subsurfaceTempC}°C</span>
          </div>
          <input
            type="range"
            min="120"
            max="450"
            value={subsurfaceTempC}
            onChange={(e) => setSubsurfaceTempC(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/50">
            <span>120°C (Hot Spring)</span>
            <span>260°C (Volcanic Basin)</span>
            <span className="text-rose-400 font-bold">450°C (Superheated Pluton)</span>
          </div>
        </div>
      </div>

      {/* Telemetry Output */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">OUTPUT POWER</span>
          <span className="text-xl font-bold text-orange-400">{powerGW} GW</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">STEAM PRESSURE</span>
          <span className="text-xl font-bold text-amber-400">{steamPressureBar} Bar</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">CAPACITY FACTOR</span>
          <span className="text-xl font-bold text-emerald-400">95.4% (24/7)</span>
        </div>
        <div className="p-3 rounded-xl bg-black/60 border border-white/10">
          <span className="text-[10px] text-white/50 block">WEATHER DEPENDENCY</span>
          <span className="text-xl font-bold text-white">0% (Unstoppable)</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIMULATION 5: NUCLEAR FISSION CONTROLLED CHAIN REACTION
// ============================================================================
const FissionSimulator: React.FC<{ isKidMode: boolean }> = ({ isKidMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [controlRods, setControlRods] = useState(50) // 0 = runaway, 50 = critical (k=1), 100 = SCRAM
  const [isRunning] = useState(true)

  // k_effective reactivity factor
  const keff = (1.35 - (controlRods / 100) * 0.7).toFixed(3)
  const thermalMW = Math.max(0, Math.round(1200 * (parseFloat(keff) / 1.0) ** 2))
  const isSupercritical = parseFloat(keff) > 1.05
  const isSubcritical = parseFloat(keff) < 0.95

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || 560)
    const h = (canvas.height = 250)

    interface Neutron {
      x: number
      y: number
      vx: number
      vy: number
      life: number
    }
    interface FissionEvent {
      x: number
      y: number
      radius: number
      alpha: number
    }

    const neutrons: Neutron[] = []
    const explosions: FissionEvent[] = []

    for (let i = 0; i < 15; i++) {
      neutrons.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 120,
      })
    }

    const render = () => {
      ctx.fillStyle = '#06131E'
      ctx.fillRect(0, 0, w, h)

      const rodHeight = (controlRods / 100) * (h * 0.75)
      ctx.fillStyle = '#1e293b'
      ctx.strokeStyle = '#64748b'
      ctx.lineWidth = 1.5
      for (let rx = 50; rx < w; rx += 70) {
        ctx.fillRect(rx - 6, 0, 12, rodHeight)
        ctx.strokeRect(rx - 6, 0, 12, rodHeight)
      }

      for (let fx = 25; fx < w; fx += 70) {
        for (let fy = 35; fy < h - 20; fy += 45) {
          ctx.beginPath()
          ctx.arc(fx, fy, 10, 0, Math.PI * 2)
          ctx.fillStyle = '#0f766e'
          ctx.fill()
          ctx.strokeStyle = '#2dd4bf'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      if (isRunning) {
        for (let i = neutrons.length - 1; i >= 0; i--) {
          const n = neutrons[i]
          n.x += n.vx
          n.y += n.vy
          n.life--

          if (n.x < 5 || n.x > w - 5) n.vx *= -1
          if (n.y < 5 || n.y > h - 5) n.vy *= -1

          const rodCol = Math.round((n.x - 50) / 70)
          const rodX = rodCol * 70 + 50
          if (Math.abs(n.x - rodX) < 8 && n.y < rodHeight) {
            neutrons.splice(i, 1)
            continue
          }

          if (Math.random() < 0.02 * parseFloat(keff)) {
            explosions.push({ x: n.x, y: n.y, radius: 4, alpha: 1.0 })
            if (neutrons.length < 100) {
              for (let k = 0; k < 2; k++) {
                neutrons.push({
                  x: n.x,
                  y: n.y,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  life: 100,
                })
              }
            }
          }

          ctx.beginPath()
          ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = '#38bdf8'
          ctx.fill()

          if (n.life <= 0) neutrons.splice(i, 1)
        }

        if (neutrons.length < 4 && controlRods < 95) {
          neutrons.push({
            x: Math.random() * w,
            y: Math.random() * (h - rodHeight) + rodHeight,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 150,
          })
        }
      }

      for (let j = explosions.length - 1; j >= 0; j--) {
        const exp = explosions[j]
        exp.radius += 1.2
        exp.alpha -= 0.05
        ctx.beginPath()
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(253, 224, 71, ${exp.alpha})`
        ctx.lineWidth = 2
        ctx.stroke()
        if (exp.alpha <= 0) explosions.splice(j, 1)
      }

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [controlRods, isRunning, keff])

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-[250px] block" />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isSupercritical ? 'bg-amber-400 animate-ping' : isSubcritical ? 'bg-sky-400' : 'bg-emerald-400'
            }`}
          />
          <span className="text-white font-bold">
            {isSupercritical
              ? 'SUPERCRITICAL (POWER SURGING)'
              : isSubcritical
              ? 'SUBCRITICAL (POWER DECAYING)'
              : 'CRITICAL EQUILIBRIUM (k=1.000 BASELOAD)'}
          </span>
        </div>
      </div>

      {/* Kid / Simple Analogy Callout vs Deep Science */}
      {isKidMode ? (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 flex items-start gap-3 text-xs leading-relaxed">
          <Smile className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-200 block mb-0.5 font-bold">🧒 How it works in simple words:</strong>
            <p className="text-white/80">
              Like hitting bowling pins! A tiny flying ball (neutron) hits a big uranium atom, splitting it in two and shooting out heat plus two new mini balls. The black control rods are like soft sponges you slide in to catch the balls and keep everything perfectly balanced and safe!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
          <BookOpen className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200 block mb-0.5">🔬 Fission Neutronics & Moderation:</strong>
            <p className="text-white/80">
              Reaction: ²³⁵₉₂U + ¹₀n → ¹⁴¹₅₆Ba + ⁹²₃₆Kr + 2.43 ¹₀n + 200 MeV (3.2 × 10⁻¹¹ J). Cadmium rods absorb thermal neutrons to maintain exact reactivity equilibrium (k_eff = 1.000).
            </p>
          </div>
        </div>
      )}

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between">
            <span className="text-white/70">Control Rod Insertion (Boron/Cadmium):</span>
            <span className="font-bold text-[#38BDF8]">{controlRods}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={controlRods}
            onChange={(e) => setControlRods(parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded accent-[#38BDF8] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/50">
            <span className="text-amber-400">0% (Supercritical)</span>
            <span className="text-emerald-400 font-bold">50% (Steady Baseload)</span>
            <span className="text-rose-400">100% (Full SCRAM)</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white/5 flex flex-col justify-between">
          <div className="flex justify-between text-white/70">
            <span>Reactivity (k_eff):</span>
            <span className="font-bold text-white">{keff}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Core Thermal Power:</span>
            <span className="font-bold text-emerald-400">{thermalMW} MWth</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIMULATION 6: TOKAMAK DEUTERIUM-TRITIUM FUSION
// ============================================================================
const FusionSimulator: React.FC<{ isKidMode: boolean }> = ({ isKidMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [magneticFieldTesla, setMagneticFieldTesla] = useState(12) // Tesla (5 - 20)
  const [plasmaTempMK, setPlasmaTempMK] = useState(150) // Million Kelvin (50 - 300)

  const tripleProduct = ((magneticFieldTesla * plasmaTempMK * 1.8) / 100).toFixed(2)
  const qFactor = Math.max(0.1, ((parseFloat(tripleProduct) / 10) ** 2.2)).toFixed(1)
  const isNetGain = parseFloat(qFactor) > 1.0

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || 560)
    const h = (canvas.height = 250)

    interface PlasmaIon {
      angle: number
      radius: number
      speed: number
      type: 'deuterium' | 'tritium'
      color: string
    }

    const ions: PlasmaIon[] = []
    for (let i = 0; i < 90; i++) {
      const isDeuterium = i % 2 === 0
      ions.push({
        angle: Math.random() * Math.PI * 2,
        radius: 40 + Math.random() * 45,
        speed: (0.015 + Math.random() * 0.02) * (plasmaTempMK / 150),
        type: isDeuterium ? 'deuterium' : 'tritium',
        color: isDeuterium ? '#38bdf8' : '#ec4899',
      })
    }

    const centerX = w / 2
    const centerY = h / 2

    const render = () => {
      ctx.fillStyle = '#03080e'
      ctx.fillRect(0, 0, w, h)

      const confinementJitter = Math.max(1, 20 - magneticFieldTesla)
      const rMajor = 75

      const plasmaGlow = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 110)
      plasmaGlow.addColorStop(0, 'rgba(236, 72, 153, 0.4)')
      plasmaGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.25)')
      plasmaGlow.addColorStop(1, 'rgba(3, 8, 14, 0)')
      ctx.fillStyle = plasmaGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, 110, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(1, magneticFieldTesla / 15)})`
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, rMajor + 35, rMajor + 15, 0, 0, Math.PI * 2)
      ctx.stroke()

      for (let i = 0; i < ions.length; i++) {
        const ion = ions[i]
        ion.angle += ion.speed

        const r = ion.radius + (Math.random() - 0.5) * confinementJitter
        const x = centerX + Math.cos(ion.angle) * (r * 1.5)
        const y = centerY + Math.sin(ion.angle) * (r * 0.9)

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = ion.color
        ctx.fill()
      }

      ctx.fillStyle = '#ffffff'
      ctx.font = '10px monospace'
      ctx.fillText(`Plasma Core: ${plasmaTempMK}M °C`, 20, 25)

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [magneticFieldTesla, plasmaTempMK])

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-pink-500/30 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-[250px] block" />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isNetGain ? 'bg-pink-400 animate-ping' : 'bg-amber-400'}`} />
          <span className="text-white font-bold">
            ENERGY MULTIPLIER: Q = {qFactor} ({isNetGain ? 'NET POWER GENERATING' : 'SUBSURFACE ABSORPTION'})
          </span>
        </div>
      </div>

      {isKidMode ? (
        <div className="p-3.5 rounded-xl bg-pink-950/40 border border-pink-400/30 flex items-start gap-3 text-xs leading-relaxed">
          <Smile className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-pink-200 block mb-0.5 font-bold">🧒 How it works in simple words:</strong>
            <p className="text-white/80">
              We are building a <strong className="text-pink-300">miniature star inside a magnetic bottle</strong> right here on Earth! Two tiny hydrogen atoms from regular seawater hug so tightly that they merge into helium, releasing enormous star-power with zero pollution and zero dangerous waste!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
          <BookOpen className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-purple-200 block mb-0.5">🔬 Thermonuclear Lawson Criterion:</strong>
            <p className="text-white/80">
              ²₁H + ³₁H → ⁴₂He (3.5 MeV) + ¹₀n (14.1 MeV) + 17.6 MeV. Confinement via 12-Tesla high-temperature superconducting (REBCO) magnetic fields satisfying Lawson triple product n · T · τE &gt; 3 × 10²¹ keV·s/m³.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Magnetic Field Confinement:</span>
            <span className="font-bold text-pink-400">{magneticFieldTesla} Tesla</span>
          </div>
          <input
            type="range"
            min="5"
            max="20"
            value={magneticFieldTesla}
            onChange={(e) => setMagneticFieldTesla(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-pink-400 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Core Plasma Temperature:</span>
            <span className="font-bold text-purple-400">{plasmaTempMK} Million °C</span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            value={plasmaTempMK}
            onChange={(e) => setPlasmaTempMK(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-purple-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIMULATION 7: PIEZOELECTRIC KINETIC ROADWAY HARVESTING
// ============================================================================
const PiezoSimulator: React.FC<{ isKidMode: boolean }> = ({ isKidMode }) => {
  const [pressureBar, setPressureBar] = useState(25)
  const [trafficVehiclesPerHour, setTrafficVehiclesPerHour] = useState(1200)

  const voltageVolts = Math.round(pressureBar * 1.8)
  const powerWattsPerKm = Math.round((trafficVehiclesPerHour * voltageVolts * 0.12))

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-xl bg-gradient-to-br from-teal-950/40 to-black/80 border border-teal-500/30 flex flex-col items-center justify-center">
        <div className="w-full max-w-md h-24 rounded-lg bg-teal-950/70 border-2 border-dashed border-teal-400/60 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-teal-500/10 animate-pulse" />
          <span className="text-white font-mono text-sm font-bold z-10">
            COMPRESSION APPLIED: {pressureBar} BAR
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md font-mono text-center">
          <div className="p-3 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[10px] text-white/50 block">PIEZO VOLTAGE DISPLACEMENT</span>
            <span className="text-2xl font-bold text-teal-300">{voltageVolts} V</span>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[10px] text-white/50 block">ROADWAY ENERGY HARVEST</span>
            <span className="text-2xl font-bold text-emerald-400">{(powerWattsPerKm / 1000).toFixed(1)} kW/km</span>
          </div>
        </div>
      </div>

      {isKidMode ? (
        <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-400/30 flex items-start gap-3 text-xs leading-relaxed">
          <Smile className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-teal-200 block mb-0.5 font-bold">🧒 How it works in simple words:</strong>
            <p className="text-white/80">
              Magic crystals under the road! Just like squeezing a wet sponge makes water squirt out, squeezing special crystals under the street when heavy cars drive over them squeezes out <strong className="text-teal-300">electricity</strong> to light up the highway!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
          <BookOpen className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-teal-200 block mb-0.5">🔬 Constitutive Piezoelectric Law:</strong>
            <p className="text-white/80">
              Constitutive formulation: D_i = d_ijk · σ_jk + ε_T · E_k. Compressive mechanical stresses applied to lead-zirconate-titanate (PZT) ceramic lattices induce instantaneous macroscopic electric polarization.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Vehicle Axle Pressure:</span>
            <span className="font-bold text-teal-300">{pressureBar} Bar</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={pressureBar}
            onChange={(e) => setPressureBar(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-teal-400 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Highway Traffic Volume:</span>
            <span className="font-bold text-teal-300">{trafficVehiclesPerHour} cars/hr</span>
          </div>
          <input
            type="range"
            min="200"
            max="3000"
            step="100"
            value={trafficVehiclesPerHour}
            onChange={(e) => setTrafficVehiclesPerHour(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-teal-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIMULATION 8: SEEBECK & PELTIER THERMOELECTRIC HARVESTER
// ============================================================================
const ThermoelectricSimulator: React.FC<{ isKidMode: boolean }> = ({ isKidMode }) => {
  const [hotTempC, setHotTempC] = useState(280)
  const coldTempC = 25

  const deltaT = hotTempC - coldTempC
  const seebeckVolts = Math.round(deltaT * 0.22)
  const recoveredKW = ((deltaT * 1.4) / 10).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-xl bg-gradient-to-br from-rose-950/40 to-black/80 border border-rose-500/30 flex flex-col items-center">
        <div className="w-full max-w-md space-y-2">
          <div className="w-full py-2 px-4 rounded bg-rose-950/80 border border-rose-500/60 text-center text-xs text-rose-300 font-bold">
            HOT JUNCTION: INDUSTRIAL SMELTER / EXHAUST ({hotTempC}°C)
          </div>
          <div className="w-full py-2 px-4 rounded bg-cyan-950/80 border border-cyan-500/60 text-center text-xs text-cyan-300 font-bold">
            COLD JUNCTION: COOL AIR HEATSINK ({coldTempC}°C)
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 w-full max-w-md font-mono text-center">
          <div className="p-3 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[10px] text-white/50 block">TEMPERATURE DIFF</span>
            <span className="text-xl font-bold text-white">ΔT = {deltaT}°C</span>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[10px] text-white/50 block">SEEBECK VOLTS</span>
            <span className="text-xl font-bold text-[#38BDF8]">{seebeckVolts} mV</span>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[10px] text-white/50 block">RECOVERED POWER</span>
            <span className="text-xl font-bold text-emerald-400">{recoveredKW} kW</span>
          </div>
        </div>
      </div>

      {isKidMode ? (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-400/30 flex items-start gap-3 text-xs leading-relaxed">
          <Smile className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-rose-200 block mb-0.5 font-bold">🧒 How it works in simple words:</strong>
            <p className="text-white/80">
              Hot and cold make power! If you put one end of a special chip near a campfire and the other end on an ice cube, electrons hate being hot and rush toward the cold side. That one-way stampede of electrons creates <strong className="text-rose-300">free electricity from wasted factory heat</strong>!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-400/30 flex items-start gap-3 text-xs font-mono leading-relaxed">
          <BookOpen className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-rose-200 block mb-0.5">🔬 Thermoelectric Figure of Merit:</strong>
            <p className="text-white/80">
              Seebeck thermoelectric potential: ΔV = -S · ΔT. Figure of merit ZT = (S²σ/κ)·T. Bi₂Te₃ / Sb₂Te₃ semiconductor junctions harness industrial flue waste heat directly into DC power without moving parts.
            </p>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono space-y-2">
        <div className="flex justify-between">
          <span className="text-white/70">Factory Heat Source Temperature:</span>
          <span className="font-bold text-rose-400">{hotTempC}°C</span>
        </div>
        <input
          type="range"
          min="80"
          max="500"
          value={hotTempC}
          onChange={(e) => setHotTempC(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/20 rounded accent-rose-400 cursor-pointer"
        />
      </div>
    </div>
  )
}

// ============================================================================
// MAIN SOLUTIONS PAGE COMPONENT
// ============================================================================
export const Solutions: React.FC = () => {
  // Category tabs: 'renewables' vs 'frontier'
  const [simulationCategory, setSimulationCategory] = useState<'renewables' | 'frontier'>('renewables')

  // Selected simulation
  const [activeSimulationTab, setActiveSimulationTab] = useState<
    'solar' | 'wind' | 'hydro' | 'geothermal' | 'fission' | 'fusion' | 'piezo' | 'peltier'
  >('solar')

  // Global toggle for Kid / Simple words vs Deep science
  const [isKidMode, setIsKidMode] = useState<boolean>(true)

  // Energy Mix Sandbox Sliders
  const [solarPct, setSolarPct] = useState(35)
  const [windPct, setWindPct] = useState(30)
  const [nuclearPct, setNuclearPct] = useState(15)
  const [hydroPct, setHydroPct] = useState(10)
  const [storagePct, setStoragePct] = useState(10)

  const totalPct = solarPct + windPct + nuclearPct + hydroPct + storagePct

  // Derived metrics
  const carbonIntensity = Math.max(12, Math.round(180 - (totalPct / 100) * 165))
  const lcoe = Math.round(
    (solarPct * 29 + windPct * 44 + nuclearPct * 68 + hydroPct * 38 + storagePct * 45) /
      (totalPct || 1)
  )
  const firmCleanShare = nuclearPct + hydroPct + storagePct
  const reliabilityScore = Math.min(99, Math.round(65 + firmCleanShare * 0.8))

  const isParisCompliant = carbonIntensity <= 35 && totalPct >= 95

  const handleCelebrate = () => {
    confetti({
      particleCount: 160,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#38BDF8', '#34D399', '#F59E0B', '#60A5FA', '#10B981'],
    })
  }

  // Quick Preset Handlers
  const applyPreset = (type: 'sun' | 'wind' | 'hydro' | 'geo') => {
    setSimulationCategory('renewables')
    if (type === 'sun') {
      setActiveSimulationTab('solar')
      setSolarPct(55)
      setWindPct(20)
      setStoragePct(25)
    } else if (type === 'wind') {
      setActiveSimulationTab('wind')
      setWindPct(50)
      setSolarPct(25)
      setHydroPct(15)
      setStoragePct(10)
    } else if (type === 'hydro') {
      setActiveSimulationTab('hydro')
      setHydroPct(30)
      setSolarPct(30)
      setWindPct(30)
      setStoragePct(10)
    } else if (type === 'geo') {
      setActiveSimulationTab('geothermal')
      setSolarPct(25)
      setWindPct(25)
      setHydroPct(20)
      setNuclearPct(20)
      setStoragePct(10)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="accent" size="sm" pulse>
          ⚡ CLEAN ENERGY & PHYSICS TELEMETRY LAB
        </Badge>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
          How Clean Energy Powers Our Future
        </h1>
        <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Test interactive hardware simulators for sun, wind, water, and deep Earth heat, plus advanced quantum reactors. Slide the controls to generate clean electricity in real time!
        </p>
      </div>

      {/* Global Presets & Explainer Toggle HUD Bar */}
      <div className="p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Kid / Simple Analogy Toggle */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => setIsKidMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              isKidMode
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>🧒 Simple Words (Kid-Friendly)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsKidMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              !isKidMode
                ? 'bg-[#38BDF8] text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>🔬 Deep Science Telemetry</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-white/50 hidden md:inline">PRESETS:</span>
          <button
            type="button"
            onClick={() => applyPreset('sun')}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
          >
            ☀️ Max Sun
          </button>
          <button
            type="button"
            onClick={() => applyPreset('wind')}
            className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30"
          >
            💨 Storm Gale
          </button>
          <button
            type="button"
            onClick={() => applyPreset('hydro')}
            className="px-2.5 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30"
          >
            🌊 High Runoff
          </button>
          <button
            type="button"
            onClick={() => applyPreset('geo')}
            className="px-2.5 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30"
          >
            🌋 Magma Boost
          </button>
        </div>
      </div>

      {/* =========================================================
          SECTION 1: INTERACTIVE HARDWARE SIMULATION LAB
          ========================================================= */}
      <section className="space-y-6">
        {/* Tier 1: Category Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold block">
              Interactive Energy Simulators
            </span>
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
              {simulationCategory === 'renewables'
                ? '☀️ Core Renewable Energy Simulators'
                : '⚛️ Frontier & Deep-Tech Physics Simulators'}
            </h2>
          </div>

          <div className="flex items-center p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => {
                setSimulationCategory('renewables')
                setActiveSimulationTab('solar')
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${
                simulationCategory === 'renewables'
                  ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-black shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>☀️ Renewables</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSimulationCategory('frontier')
                setActiveSimulationTab('fusion')
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${
                simulationCategory === 'frontier'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>⚛️ Frontier Tech</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Sub-Simulation Tabs */}
        {simulationCategory === 'renewables' ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSimulationTab('solar')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs transition-all ${
                activeSimulationTab === 'solar'
                  ? 'bg-amber-400 text-black font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>1. Solar Photovoltaic (PV)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSimulationTab('wind')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs transition-all ${
                activeSimulationTab === 'wind'
                  ? 'bg-sky-400 text-black font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>2. 15MW Wind Turbine</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSimulationTab('hydro')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs transition-all ${
                activeSimulationTab === 'hydro'
                  ? 'bg-teal-400 text-black font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>3. Hydro Dam & Pelton Runner</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSimulationTab('geothermal')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs transition-all ${
                activeSimulationTab === 'geothermal'
                  ? 'bg-orange-400 text-black font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>4. Geothermal Magma Drill</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSimulationTab('fusion')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs transition-all ${
                activeSimulationTab === 'fusion'
                  ? 'bg-pink-500 text-white font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>1. Tokamak Fusion</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSimulationTab('fission')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs transition-all ${
                activeSimulationTab === 'fission'
                  ? 'bg-[#38BDF8] text-black font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>2. Uranium Fission</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSimulationTab('piezo')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs transition-all ${
                activeSimulationTab === 'piezo'
                  ? 'bg-teal-400 text-black font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>3. Piezoelectric</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSimulationTab('peltier')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs transition-all ${
                activeSimulationTab === 'peltier'
                  ? 'bg-rose-400 text-black font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>4. Thermoelectric Seebeck</span>
            </button>
          </div>
        )}

        {/* Selected Simulation Card */}
        <LiquidGlassCard className="p-6 border-[var(--accent)]/30">
          {activeSimulationTab === 'solar' && (
            <div>
              <div className="mb-4">
                <Badge variant="warning" size="sm" className="mb-1">
                  ☀️ PHOTOVOLTAIC SEMICONDUCTOR CELL
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Solar Silicon & Perovskite Quantum Electron Excitation
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Watch golden sunlight photons crash into silicon crystals to knock electrons free into our electrical wires!
                </p>
              </div>
              <SolarSimulator isKidMode={isKidMode} />
            </div>
          )}

          {activeSimulationTab === 'wind' && (
            <div>
              <div className="mb-4">
                <Badge variant="accent" size="sm" className="mb-1">
                  💨 AERODYNAMIC AIRFOIL LIFT
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  15MW Offshore Wind Turbine & Generator Rotors
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Curved airplane-shaped blades capture ocean breezes to spin giant permanent magnets and feed undersea powerlines!
                </p>
              </div>
              <WindSimulator isKidMode={isKidMode} />
            </div>
          )}

          {activeSimulationTab === 'hydro' && (
            <div>
              <div className="mb-4">
                <Badge variant="positive" size="sm" className="mb-1">
                  🌊 GRAVITATIONAL HYDRO-KINETIC
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Mountain Reservoir Dam & High-Speed Pelton Runner
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Water rushes down a steep penstock pipe to blast a waterwheel at high speed, giving 100% steady baseload power!
                </p>
              </div>
              <HydroSimulator isKidMode={isKidMode} />
            </div>
          )}

          {activeSimulationTab === 'geothermal' && (
            <div>
              <div className="mb-4">
                <Badge variant="critical" size="sm" className="mb-1">
                  🌋 DEEP EARTH VOLCANIC ENTHALPY
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Subterranean Magma Steam Borehole & Turbines
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Pumping water deep into volcanic rock boils it into whistling steam that spins power plants 24/7 without sun or wind!
                </p>
              </div>
              <GeothermalSimulator isKidMode={isKidMode} />
            </div>
          )}

          {activeSimulationTab === 'fusion' && (
            <div>
              <div className="mb-4">
                <Badge variant="warning" size="sm" className="mb-1">
                  ⭐ STAR IN A MAGNETIC BOTTLE
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Tokamak Deuterium-Tritium Thermonuclear Fusion
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Confining 150 Million °C plasma with superconducting magnets to fuse hydrogen into helium with zero emissions!
                </p>
              </div>
              <FusionSimulator isKidMode={isKidMode} />
            </div>
          )}

          {activeSimulationTab === 'fission' && (
            <div>
              <div className="mb-4">
                <Badge variant="accent" size="sm" className="mb-1">
                  ⚛️ CONTROLLED ATOMIC CHAIN REACTION
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Uranium-235 Fission & Control Rod Moderation
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Splitting uranium nuclei with neutrons to release steady, zero-carbon thermal energy for city electric grids.
                </p>
              </div>
              <FissionSimulator isKidMode={isKidMode} />
            </div>
          )}

          {activeSimulationTab === 'piezo' && (
            <div>
              <div className="mb-4">
                <Badge variant="positive" size="sm" className="mb-1">
                  ⚡ KINETIC ROADWAY HARVESTING
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Piezoelectric PZT Crystal Compression
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Squeezing special crystals under roadways whenever heavy cars drive over them to create clean electricity!
                </p>
              </div>
              <PiezoSimulator isKidMode={isKidMode} />
            </div>
          )}

          {activeSimulationTab === 'peltier' && (
            <div>
              <div className="mb-4">
                <Badge variant="critical" size="sm" className="mb-1">
                  🔥 WASTE HEAT RECOVERY
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Seebeck & Peltier Thermoelectric Harvester
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Turning the temperature difference between hot factory smokestacks and cool air directly into electricity!
                </p>
              </div>
              <ThermoelectricSimulator isKidMode={isKidMode} />
            </div>
          )}
        </LiquidGlassCard>
      </section>

      {/* =========================================================
          SECTION 2: DEEP DIVE SCIENTIFIC DOSSIER
          ========================================================= */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold block">
            Physics & Engineering Fact Files
          </span>
          <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
            Verified Clean Energy Specs & Technology Readiness
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {frontierEnergySolutions.map((sol) => (
            <LiquidGlassCard key={sol.id} className="p-6 border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Badge variant="accent">{sol.category}</Badge>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {sol.trl}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-white mb-1">
                  {sol.title}
                </h3>

                <div className="p-3 rounded-lg bg-black/60 border border-white/10 my-3 font-mono text-xs">
                  <span className="text-[10px] text-white/50 block mb-1">GOVERNING PHYSICAL LAW</span>
                  <div className="text-amber-300 font-bold overflow-x-auto">
                    {sol.formula}
                  </div>
                  <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
                    {sol.formulaExplanation}
                  </p>
                </div>

                <div className="space-y-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  <p>
                    <strong className="text-white">Operating Mechanism:</strong> {sol.deepDive.howItWorks}
                  </p>
                  <p>
                    <strong className="text-amber-300">Engineering Bottleneck:</strong> {sol.deepDive.keyEngineeringChallenge}
                  </p>
                  <p>
                    <strong className="text-emerald-300">Planetary Impact:</strong> {sol.deepDive.climateImpact}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-white/50 block">EFFICIENCY</span>
                  <span className="font-bold text-white">{sol.efficiency}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block">LEVELIZED COST</span>
                  <span className="font-bold text-[#38BDF8]">{sol.levelizedCost}</span>
                </div>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 3: BUILD YOUR GLOBAL ENERGY MIX SANDBOX
          ========================================================= */}
      <section>
        <LiquidGlassCard className="p-8 border-[#38BDF8]/40 bg-white/[0.03]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#38BDF8]" />
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
                  Build Your Global Clean Energy Mix
                </h2>
              </div>
              <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
                Balance sun, wind, hydro, geothermal, and nuclear to reach 100% clean power and save the planet!
              </p>
            </div>

            {isParisCompliant ? (
              <button
                type="button"
                onClick={handleCelebrate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:brightness-110"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>PARIS 1.5°C COMPLIANT! (FIRE CONFETTI 🚀)</span>
              </button>
            ) : (
              <Badge variant="warning">
                TOTAL ALLOCATION: {totalPct}% (Target: 100%)
              </Badge>
            )}
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-amber-300 font-semibold">☀️ Solar PV</span>
                <span className="font-bold text-white">{solarPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={solarPct}
                onChange={(e) => setSolarPct(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-white/40 block">
                $29/MWh • Low land footprint
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-sky-300 font-semibold">💨 Wind Power</span>
                <span className="font-bold text-white">{windPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={windPct}
                onChange={(e) => setWindPct(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded accent-sky-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-white/40 block">
                $44/MWh • Floating ocean
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-indigo-300 font-semibold">⚛️ Nuclear SMR</span>
                <span className="font-bold text-white">{nuclearPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={nuclearPct}
                onChange={(e) => setNuclearPct(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded accent-indigo-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-white/40 block">
                $68/MWh • 24/7 Steady baseload
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-teal-300 font-semibold">🌊 Hydro / Geo</span>
                <span className="font-bold text-white">{hydroPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={hydroPct}
                onChange={(e) => setHydroPct(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded accent-teal-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-white/40 block">
                $38/MWh • Fast dispatch
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-emerald-300 font-semibold">🔋 Grid Storage</span>
                <span className="font-bold text-white">{storagePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={storagePct}
                onChange={(e) => setStoragePct(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded accent-emerald-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-white/40 block">
                Iron-air 100h battery
              </span>
            </div>
          </div>

          {/* Live System Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/10">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                Grid Reliability Index
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-display text-emerald-400">
                  {reliabilityScore}%
                </span>
                <span className="text-xs font-mono text-white/60">
                  {reliabilityScore >= 95 ? 'Ultra-Resilient' : 'Needs Baseload'}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${reliabilityScore}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                Weighted Clean LCOE
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-display text-[#38BDF8]">
                  ${lcoe}
                </span>
                <span className="text-xs font-mono text-white/60">
                  / MWh generated
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 block mt-2">
                -64% cheaper than coal power plants
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-xs font-mono text-[var(--text-muted)] block mb-1">
                Grid Carbon Intensity
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-display text-emerald-400">
                  {carbonIntensity}
                </span>
                <span className="text-xs font-mono text-white/60">
                  g CO₂ / kWh
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/50 block mt-2">
                Paris benchmark: &lt; 35 g CO₂/kWh
              </span>
            </div>
          </div>
        </LiquidGlassCard>
      </section>
    </div>
  )
}
