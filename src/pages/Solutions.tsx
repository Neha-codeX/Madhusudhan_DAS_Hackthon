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
} from 'lucide-react'

// ============================================================================
// SIMULATION 1: NUCLEAR FISSION CONTROLLED CHAIN REACTION
// ============================================================================
const FissionSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [controlRods, setControlRods] = useState(50) // 0 = runaway, 50 = critical (k=1), 100 = SCRAM
  const [isRunning, setIsRunning] = useState(true)

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
    const w = (canvas.width = canvas.offsetWidth || 500)
    const h = (canvas.height = 260)

    // Particles: Uranium nuclei & neutrons
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

    // Seed initial neutrons
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

      // Control rods visualization (descending black cadmium blades)
      const rodHeight = (controlRods / 100) * (h * 0.75)
      ctx.fillStyle = '#1e293b'
      ctx.strokeStyle = '#64748b'
      ctx.lineWidth = 1.5
      for (let rx = 50; rx < w; rx += 70) {
        ctx.fillRect(rx - 6, 0, 12, rodHeight)
        ctx.strokeRect(rx - 6, 0, 12, rodHeight)
      }

      // Fuel pin grid (Uranium pellets in green)
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

      // Update & render neutrons
      if (isRunning) {
        for (let i = neutrons.length - 1; i >= 0; i--) {
          const n = neutrons[i]
          n.x += n.vx
          n.y += n.vy
          n.life--

          // Bounce off boundaries
          if (n.x < 5 || n.x > w - 5) n.vx *= -1
          if (n.y < 5 || n.y > h - 5) n.vy *= -1

          // Absorption by control rods
          const rodCol = Math.round((n.x - 50) / 70)
          const rodX = rodCol * 70 + 50
          if (Math.abs(n.x - rodX) < 8 && n.y < rodHeight) {
            neutrons.splice(i, 1)
            continue
          }

          // Random fission collision with Uranium
          if (Math.random() < 0.02 * parseFloat(keff)) {
            explosions.push({ x: n.x, y: n.y, radius: 4, alpha: 1.0 })
            // Release 2 to 3 new prompt neutrons if not crowded
            if (neutrons.length < 120) {
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

          // Render neutron (glowing cyan bead)
          ctx.beginPath()
          ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = '#38bdf8'
          ctx.shadowColor = '#38bdf8'
          ctx.shadowBlur = 8
          ctx.fill()
          ctx.shadowBlur = 0

          if (n.life <= 0) neutrons.splice(i, 1)
        }

        // Replenish ambient neutrons if extinguished
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

      // Render fission flashes
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
        <canvas ref={canvasRef} className="w-full h-[260px] block" />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isSupercritical ? 'bg-amber-400 animate-ping' : isSubcritical ? 'bg-sky-400' : 'bg-emerald-400'
            }`}
          />
          <span className="text-white font-bold">
            {isSupercritical
              ? 'PROMPT CRITICAL (SUPERCRITICAL)'
              : isSubcritical
              ? 'SUBCRITICAL (DECAYING)'
              : 'CRITICAL EQUILIBRIUM (k=1.000)'}
          </span>
        </div>
      </div>

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
            <span className="text-amber-400">0% (Withdrawn / High Flux)</span>
            <span className="text-emerald-400 font-bold">50% (Steady Baseload)</span>
            <span className="text-rose-400">100% (Full SCRAM Shutdown)</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white/5 flex flex-col justify-between">
          <div className="flex justify-between text-white/70">
            <span>Reactivity (k_eff):</span>
            <span className="font-bold text-white">{keff}</span>
          </div>
          <div className="flex justify-between text-white/70 mt-1">
            <span>Core Power:</span>
            <span className="font-bold text-emerald-400">{thermalMW} MWth</span>
          </div>
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="mt-2 py-1 px-2 rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-all text-center"
          >
            {isRunning ? 'Pause Core Telemetry' : 'Resume Chain Reaction'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIMULATION 2: MAGNETIC CONFINEMENT TOKAMAK FUSION
// ============================================================================
const FusionSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [bFieldTesla, setBFieldTesla] = useState(16) // 5 to 20 Tesla
  const [plasmaTempM, setPlasmaTempM] = useState(150) // 50 to 200 Million C

  // Lawson criteria triple product calculation: n * T * tau_E
  const confinementTime = (bFieldTesla * 0.22).toFixed(1)
  const tripleProduct = ((plasmaTempM * 0.1) * (bFieldTesla * 0.45) * parseFloat(confinementTime)).toFixed(1)
  const qFactor = Math.max(0.1, (parseFloat(tripleProduct) / 12.0) ** 1.8).toFixed(1)
  const isNetEnergy = parseFloat(qFactor) >= 1.0

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || 500)
    const h = (canvas.height = 260)
    const cx = w / 2
    const cy = h / 2

    let angle = 0

    const render = () => {
      ctx.fillStyle = '#030D14'
      ctx.fillRect(0, 0, w, h)

      angle += 0.02 * (bFieldTesla / 10)

      // Torus chamber cross-section
      ctx.strokeStyle = '#1e3a5f'
      ctx.lineWidth = 14
      ctx.beginPath()
      ctx.ellipse(cx, cy, 140, 75, 0, 0, Math.PI * 2)
      ctx.stroke()

      // Magnetic field flux lines (D-shaped Tokamak poloidal magnetic contours)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)'
      ctx.lineWidth = 1.5
      for (let r = 25; r <= 80; r += 18) {
        ctx.beginPath()
        ctx.ellipse(cx, cy, 140 + (r - 50) * 0.8, 75 + (r - 50) * 0.6, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Swirling Deuterium (cyan) and Tritium (magenta) ions inside magnetic confinement
      const particleCount = 80
      for (let i = 0; i < particleCount; i++) {
        const pAngle = angle * (1.2 + (i % 5) * 0.1) + (i / particleCount) * Math.PI * 2
        const radJitter = Math.sin(angle * 3 + i) * (200 - plasmaTempM) * 0.08
        const rx = 135 + radJitter
        const ry = 70 + radJitter * 0.5

        const px = cx + Math.cos(pAngle) * rx
        const py = cy + Math.sin(pAngle) * ry

        ctx.beginPath()
        ctx.arc(px, py, i % 2 === 0 ? 3 : 2.5, 0, Math.PI * 2)
        ctx.fillStyle = i % 2 === 0 ? '#38BDF8' : '#EC4899'
        ctx.shadowColor = i % 2 === 0 ? '#38BDF8' : '#EC4899'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Center magnetic plasma core glow
      const coreGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 110)
      coreGrad.addColorStop(0, `rgba(244, 114, 182, ${Math.min(0.8, plasmaTempM / 200)})`)
      coreGrad.addColorStop(0.5, `rgba(56, 189, 248, ${Math.min(0.5, bFieldTesla / 30)})`)
      coreGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.ellipse(cx, cy, 130, 65, 0, 0, Math.PI * 2)
      ctx.fill()

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [bFieldTesla, plasmaTempM])

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-[260px] block" />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              parseFloat(qFactor) >= 10 ? 'bg-amber-400 animate-ping' : isNetEnergy ? 'bg-emerald-400' : 'bg-sky-400'
            }`}
          />
          <span className="text-white font-bold">
            {parseFloat(qFactor) >= 10
              ? `BURNING PLASMA REGIME (Q = ${qFactor} - ITER TARGET)`
              : isNetEnergy
              ? `NET ENERGY GAIN (Q = ${qFactor} > 1.0 BREAKEVEN)`
              : `SCIENTIFIC CONFINEMENT (Q = ${qFactor})`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Superconducting Toroidal Field:</span>
            <span className="font-bold text-[#38BDF8]">{bFieldTesla} Tesla (REBCO Magnet)</span>
          </div>
          <input
            type="range"
            min="6"
            max="22"
            value={bFieldTesla}
            onChange={(e) => setBFieldTesla(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-[#38BDF8] cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Core Ion Plasma Temperature:</span>
            <span className="font-bold text-pink-400">{plasmaTempM} Million °C</span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            value={plasmaTempM}
            onChange={(e) => setPlasmaTempM(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-pink-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIMULATION 3: PIEZOELECTRIC KINETIC & HIGHWAY HARVESTER
// ============================================================================
const PiezoSimulator: React.FC = () => {
  const [pressureMPa, setPressureMPa] = useState(18) // 0 to 30 MPa (freight truck axle load)

  const voltage = (pressureMPa * 3.2).toFixed(1) // Volts generated
  const powerDensityW = (pressureMPa * 1.85).toFixed(1) // Watts per tile

  const handleCompress = () => {
    setPressureMPa((prev) => (prev >= 30 ? 5 : prev + 5))
  }

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-xl bg-gradient-to-br from-[#061825] to-[#040e17] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Crystal lattice diagram */}
        <div className="flex flex-col items-center my-4 cursor-pointer" onClick={handleCompress}>
          <div className="text-[10px] font-mono text-white/50 mb-1">
            [CLICK UNIT CELL OR SLIDE PRESSURE TO COMPRESS]
          </div>
          {/* Mechanical Piston */}
          <div
            className="w-48 h-8 rounded-t bg-slate-700 border-2 border-slate-500 flex items-center justify-center font-mono text-[10px] text-white transition-transform"
            style={{ transform: `translateY(${pressureMPa * 0.6}px)` }}
          >
            DOWNWARD AXLE LOAD: {pressureMPa} MPa
          </div>

          {/* Piezoelectric PZT Crystal Lattice */}
          <div
            className="w-48 rounded bg-teal-950/80 border-2 border-teal-400/60 p-4 flex flex-col items-center justify-center transition-all duration-150 relative"
            style={{
              height: `${80 - pressureMPa * 0.8}px`,
              boxShadow: `0 0 ${pressureMPa * 2}px rgba(45, 212, 191, 0.4)`,
            }}
          >
            <div className="flex items-center gap-4 text-xs font-mono font-bold text-teal-300">
              <span>Ti⁴⁺ Dipole Shift</span>
              <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div className="text-[10px] font-mono text-teal-200/60">
              {'PZT (Pb[Zr_x Ti_{1-x}]O₃)'}
            </div>
          </div>

          {/* Fixed Base Substrate */}
          <div className="w-48 h-6 rounded-b bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-[9px] font-mono text-white/40">
            ROADWAY ASPHALT SUBSTRATE
          </div>
        </div>

        {/* Live Voltage Output Meter */}
        <div className="flex items-center gap-6 mt-4 p-3 rounded-xl bg-black/60 border border-teal-500/30 font-mono">
          <div>
            <span className="text-[10px] text-white/50 block">OPEN-CIRCUIT VOLTAGE</span>
            <span className="text-2xl font-bold text-teal-300">+{voltage} V</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <span className="text-[10px] text-white/50 block">INSTANTANEOUS POWER</span>
            <span className="text-2xl font-bold text-amber-300">{powerDensityW} W / tile</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono space-y-2">
        <div className="flex justify-between">
          <span className="text-white/70">Vehicle Compression Stress (Truck Wheel Load):</span>
          <span className="font-bold text-teal-300">{pressureMPa} MPa</span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          value={pressureMPa}
          onChange={(e) => setPressureMPa(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/20 rounded accent-teal-400 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-white/50">
          <span>0 MPa (Stationary)</span>
          <span>15 MPa (Passenger Car)</span>
          <span className="text-amber-400">30 MPa (40-Ton Freight Truck)</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIMULATION 4: THERMOELECTRIC PELTIER & SEEBECK EFFECT
// ============================================================================
const ThermoelectricSimulator: React.FC = () => {
  const [hotTempC, setHotTempC] = useState(320) // 100 to 500 C
  const coldTempC = 25 // ambient room / air cooling

  const deltaT = hotTempC - coldTempC
  const seebeckVolts = ((deltaT * 220) / 1000).toFixed(1) // uV/K -> mV
  const carnotLimit = ((deltaT / (hotTempC + 273.15)) * 100).toFixed(1)
  const recoveredKW = (deltaT * 0.42).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-xl bg-gradient-to-br from-[#061825] to-[#040e17] border border-white/10 flex flex-col items-center justify-center">
        {/* Thermocouple junction schematic */}
        <div className="w-full max-w-md space-y-2 font-mono">
          {/* Hot Side Plate */}
          <div className="w-full py-2 px-4 rounded bg-rose-950/80 border border-rose-500/60 text-center text-xs text-rose-300 font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            HOT JUNCTION: INDUSTRIAL EXHAUST ({hotTempC}°C)
          </div>

          {/* Semiconductor Legs */}
          <div className="grid grid-cols-2 gap-4 h-28 my-2">
            <div className="rounded bg-sky-950/80 border border-sky-400/60 p-2 flex flex-col items-center justify-between text-[10px] text-sky-200">
              <span className="font-bold">n-Type Bi₂Te₃</span>
              <span className="text-white/60">Electrons (e⁻) migrate ↓</span>
              <span className="text-xs text-sky-400">↓ Current</span>
            </div>

            <div className="rounded bg-amber-950/80 border border-amber-400/60 p-2 flex flex-col items-center justify-between text-[10px] text-amber-200">
              <span className="font-bold">p-Type Sb₂Te₃</span>
              <span className="text-white/60">Holes (h⁺) migrate ↓</span>
              <span className="text-xs text-amber-400">↑ Return Loop</span>
            </div>
          </div>

          {/* Cold Side Plate */}
          <div className="w-full py-2 px-4 rounded bg-cyan-950/80 border border-cyan-500/60 text-center text-xs text-cyan-300 font-bold">
            COLD JUNCTION: HEATSINK / AIR ({coldTempC}°C)
          </div>
        </div>

        {/* Live Output Telemetry */}
        <div className="grid grid-cols-3 gap-4 mt-6 w-full max-w-md font-mono text-center">
          <div className="p-3 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[10px] text-white/50 block">THERMAL GRADIENT</span>
            <span className="text-xl font-bold text-white">ΔT = {deltaT}°C</span>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[10px] text-white/50 block">SEEBECK POTENTIAL</span>
            <span className="text-xl font-bold text-[#38BDF8]">{seebeckVolts} mV</span>
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-white/10">
            <span className="text-[10px] text-white/50 block">POWER RECOVERED</span>
            <span className="text-xl font-bold text-emerald-400">{recoveredKW} kW</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono space-y-2">
        <div className="flex justify-between">
          <span className="text-white/70">Industrial Heat Source Temperature:</span>
          <span className="font-bold text-rose-400">{hotTempC}°C (Carnot Cap: {carnotLimit}%)</span>
        </div>
        <input
          type="range"
          min="80"
          max="500"
          value={hotTempC}
          onChange={(e) => setHotTempC(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/20 rounded accent-rose-400 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-white/50">
          <span>80°C (Hot Water Pipe)</span>
          <span>300°C (Diesel Exhaust)</span>
          <span className="text-rose-400">500°C (Steel Mill Smelter)</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN SOLUTIONS PAGE COMPONENT
// ============================================================================
export const Solutions: React.FC = () => {
  const [activeSimulationTab, setActiveSimulationTab] = useState<'fission' | 'fusion' | 'piezo' | 'peltier'>('fission')

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
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#38BDF8', '#34D399', '#F59E0B', '#60A5FA', '#10B981'],
    })
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="accent" size="sm" pulse>
          FRONTIER CLEAN ENERGY & PHYSICS TELEMETRY
        </Badge>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
          Thermodynamics of Planetary Decarbonization
        </h1>
        <p className="text-xs sm:text-base text-[var(--text-secondary)] leading-relaxed">
          From quantum tunneling in thermonuclear fusion to direct solid-state Seebeck harvesting, explore the fundamental physical mechanisms powering the post-fossil epoch.
        </p>
      </div>

      {/* =========================================================
          SECTION 1: INTERACTIVE PHYSICS SIMULATION LAB
          ========================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold block">
              Interactive Hardware Simulations
            </span>
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
              Frontier Energy Particle & Reactor Simulators
            </h2>
          </div>

          {/* Sub-simulation switcher pills */}
          <div className="flex flex-wrap items-center p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setActiveSimulationTab('fission')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                activeSimulationTab === 'fission'
                  ? 'bg-[#38BDF8] text-black font-bold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Nuclear Fission</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSimulationTab('fusion')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                activeSimulationTab === 'fusion'
                  ? 'bg-pink-500 text-white font-bold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Nuclear Fusion</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSimulationTab('piezo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                activeSimulationTab === 'piezo'
                  ? 'bg-teal-400 text-black font-bold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Piezoelectric</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSimulationTab('peltier')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                activeSimulationTab === 'peltier'
                  ? 'bg-rose-400 text-black font-bold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Thermoelectric / Peltier</span>
            </button>
          </div>
        </div>

        {/* Selected Simulation Card */}
        <LiquidGlassCard className="p-6 border-[var(--accent)]/30">
          {activeSimulationTab === 'fission' && (
            <div>
              <div className="mb-4">
                <Badge variant="accent" size="sm" className="mb-1">
                  ACTINIDE FISSION EQUILIBRIUM
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Controlled Uranium-235 Nuclear Fission & Reactivity Reactor
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Equation: ²³⁵₉₂U + ¹₀n → ¹⁴¹₅₆Ba + ⁹²₃₆Kr + 2.43 ¹₀n + 200 MeV (3.2 × 10⁻¹¹ J). Adjust control rods to observe prompt neutron moderation.
                </p>
              </div>
              <FissionSimulator />
            </div>
          )}

          {activeSimulationTab === 'fusion' && (
            <div>
              <div className="mb-4">
                <Badge variant="warning" size="sm" className="mb-1">
                  THERMONUCLEAR MAGNETIC CONFINEMENT
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Tokamak Deuterium-Tritium Fusion & Lawson Triple Product
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Equation: ²₁H + ³₁H → ⁴₂He (3.5 MeV) + ¹₀n (14.1 MeV) + 17.6 MeV. Confined by 20 Tesla REBCO magnetic fields at 150 Million °C.
                </p>
              </div>
              <FusionSimulator />
            </div>
          )}

          {activeSimulationTab === 'piezo' && (
            <div>
              <div className="mb-4">
                <Badge variant="positive" size="sm" className="mb-1">
                  SOLID-STATE KINETIC HARVESTING
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Piezoelectric PZT Lattice Compression & Roadway Harvesting
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Constitutive Law: D_i = d_{'{ijk}'} σ_{'{jk}'} + ε_T E_k. Compress the crystal stack to observe instantaneous charge displacement.
                </p>
              </div>
              <PiezoSimulator />
            </div>
          )}

          {activeSimulationTab === 'peltier' && (
            <div>
              <div className="mb-4">
                <Badge variant="critical" size="sm" className="mb-1">
                  CARNOT WASTE HEAT RECOVERY
                </Badge>
                <h3 className="font-display font-bold text-xl text-white">
                  Seebeck & Peltier Thermoelectric Energy Harvester
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                  Coupled Transport: ΔV = -S · ΔT | Figure of Merit: ZT = (S² σ / κ) · T. Recovers gigawatts of industrial exhaust heat.
                </p>
              </div>
              <ThermoelectricSimulator />
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
            Physics & Engineering Dossier
          </span>
          <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
            Theoretical Principles & Technological Readiness (TRL)
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
                Balance variable renewables (Solar/Wind) with firm clean baseload (Nuclear/Hydro/Storage) to achieve Paris 1.5°C compliance.
              </p>
            </div>

            {isParisCompliant ? (
              <button
                type="button"
                onClick={handleCelebrate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:brightness-110"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>PARIS 1.5°C COMPLIANT! (FIRE CONFETTI)</span>
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
                $29/MWh • Low land use
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
                $68/MWh • 24/7 Firm baseload
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
                $38/MWh • Supercritical 400°C
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
                100h Iron-air battery
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
                Weighted LCOE
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
                -64% cheaper than coal baseload ($110/MWh)
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
                Paris 1.5°C benchmark: &lt; 35 g CO₂/kWh
              </span>
            </div>
          </div>
        </LiquidGlassCard>
      </section>
    </div>
  )
}
