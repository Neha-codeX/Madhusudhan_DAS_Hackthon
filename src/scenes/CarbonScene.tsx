import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useThemeStore } from '../store/themeStore'

// 3D Earth Sphere with Continental Wireframe / Shading
const EarthGlobe: React.FC<{ year: number }> = ({ year }) => {
  const globeRef = useRef<THREE.Group>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)

  // Rotate globe continuously
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.11
    }
  })

  // Carbon warming color shift based on year
  // 1958 = deep oceanic blue/cool green; 2050 = scorched amber/smog red
  const warmingFactor = Math.min(1, Math.max(0, (year - 1958) / (2050 - 1958)))

  return (
    <group ref={globeRef} position={[0, 0, 0]}>
      {/* Base Planet Sphere */}
      <mesh>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshStandardMaterial
          color={new THREE.Color(
            0.1 + warmingFactor * 0.45,
            0.18 + (1 - warmingFactor) * 0.25,
            0.35 * (1 - warmingFactor * 0.6)
          )}
          roughness={0.65}
          metalness={0.2}
        />
      </mesh>

      {/* Atmospheric Halo Glow */}
      <mesh scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          color={warmingFactor > 0.6 ? '#FF4500' : '#FFB020'}
          transparent
          opacity={0.15 + warmingFactor * 0.25}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Cloud & Smog Layer */}
      <mesh ref={cloudsRef} scale={[1.03, 1.03, 1.03]}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshStandardMaterial
          color={warmingFactor > 0.5 ? '#9A7B68' : '#FFFFFF'}
          transparent
          opacity={0.3 + warmingFactor * 0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Emission Beacons at coordinates */}
      <EmissionHotspots year={year} />
    </group>
  )
}

// Rising Hotspot Beacons
const EmissionHotspots: React.FC<{ year: number }> = ({ year }) => {
  const intensity = Math.max(0.2, (year - 1958) / 70)

  // Spherical coordinates for major emitting hubs
  const hotspots = useMemo(() => {
    return [
      { lat: 35, lng: 110, name: 'East Asia' },
      { lat: 40, lng: -95, name: 'North America' },
      { lat: 50, lng: 15, name: 'Europe' },
      { lat: 20, lng: 78, name: 'South Asia' },
      { lat: 28, lng: 45, name: 'Middle East' },
    ]
  }, [])

  return (
    <group>
      {hotspots.map((h, i) => {
        const phi = (90 - h.lat) * (Math.PI / 180)
        const theta = (h.lng + 180) * (Math.PI / 180)
        const r = 2.85

        const x = -(r * Math.sin(phi) * Math.cos(theta))
        const z = r * Math.sin(phi) * Math.sin(theta)
        const y = r * Math.cos(phi)

        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.08 * intensity, 16, 16]} />
              <meshBasicMaterial
                color="#FF2E88"
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// Plume of rising carbon and greenhouse particles
const CarbonParticles: React.FC<{ year: number }> = ({ year }) => {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 1500
  const factor = Math.max(0.15, (year - 1958) / 80)

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 3.0 + Math.random() * 5.0

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return { positions: pos }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12 * factor}
        color={factor > 0.8 ? '#FF4500' : '#FFB020'}
        transparent
        opacity={0.6 * factor}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 2D Fallback
const Carbon2DFallback: React.FC<{ year: number }> = ({ year }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || window.innerWidth)
    const h = (canvas.height = canvas.offsetHeight || window.innerHeight)

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.6)
      grad.addColorStop(0, '#26130B')
      grad.addColorStop(0.5, '#120A14')
      grad.addColorStop(1, '#08080C')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Center globe
      ctx.fillStyle = '#FFB020'
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, 120, 0, Math.PI * 2)
      ctx.fill()

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [year])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export const CarbonScene: React.FC = () => {
  const { carbonYear, setCarbonYear } = useThemeStore()
  const [webGLError, setWebGLError] = React.useState(false)

  // Current ppm calculated from year
  const ppm = (315 + ((carbonYear - 1958) / (2025 - 1958)) * (427.8 - 315)).toFixed(1)

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      {!webGLError ? (
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 48 }}
          className="absolute inset-0 w-full h-full"
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#0B0B10'))
          }}
          onError={() => setWebGLError(true)}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[12, 8, 10]} intensity={1.8} color="#FFF8E7" />
          <pointLight position={[-8, -4, 4]} intensity={2.2} color="#FFB020" />
          <pointLight position={[6, 8, -4]} intensity={1.5} color="#FF2E88" />

          <EarthGlobe year={carbonYear} />
          <CarbonParticles year={carbonYear} />
        </Canvas>
      ) : (
        <Carbon2DFallback year={carbonYear} />
      )}

      {/* Cinematic Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B10] via-transparent to-[#0B0B10]/80" />
      <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-70" />

      {/* Interactive Carbon Scrubber Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl">
        <div className="px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-2xl border border-[#FFB020]/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#FFB020] flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FFB020] animate-ping" />
              KEELING CURVE ATMOSPHERIC SCRUBBER
            </span>
            <span className="text-white/80 font-bold">
              YEAR {carbonYear} • {ppm} PPM CO₂
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/50">1958</span>
            <input
              type="range"
              min="1958"
              max="2050"
              step="1"
              value={carbonYear}
              onChange={(e) => setCarbonYear(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FFB020]"
            />
            <span className="text-[10px] font-mono text-rose-400 font-bold">2050</span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] font-mono text-white/60">
            <button
              type="button"
              onClick={() => setCarbonYear(1958)}
              className="hover:text-[#FFB020] transition-colors"
            >
              [1958 Mauna Loa Start (315 ppm)]
            </button>
            <button
              type="button"
              onClick={() => setCarbonYear(2025)}
              className="text-[#FFB020] font-bold underline"
            >
              [2025 Current (427.8 ppm)]
            </button>
            <button
              type="button"
              onClick={() => setCarbonYear(2050)}
              className="hover:text-rose-400 transition-colors"
            >
              [2050 Tipping (485+ ppm)]
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
