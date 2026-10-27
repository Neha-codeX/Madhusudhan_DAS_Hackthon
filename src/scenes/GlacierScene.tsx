import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useThemeStore } from '../store/themeStore'

// Procedural Ice Peaks Mesh
const IceTerrain: React.FC<{ melt: number }> = ({ melt }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  // Procedural jagged mountain geometry with noise
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(30, 30, 48, 48)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      // Jagged glacier ridges
      const distFromCenter = Math.sqrt(x * x + y * y)
      const ridge = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 2.2
      const peak = Math.exp(-distFromCenter * 0.15) * 4.5
      const noise = (Math.sin(x * 1.5) + Math.cos(y * 1.8)) * 0.4
      pos.setZ(i, (ridge + peak + noise) * (1 - melt * 0.6))
    }
    geo.computeVertexNormals()
    return geo
  }, [melt])

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2.3, 0, 0]}
      position={[0, -2.5 - melt * 1.5, -6]}
    >
      <meshStandardMaterial
        color={new THREE.Color(0.85 - melt * 0.2, 0.95 - melt * 0.1, 1.0)}
        roughness={0.25}
        metalness={0.15}
        wireframe={false}
        flatShading={true}
      />
    </mesh>
  )
}

// Floating Icebergs
const FloatingIcebergs: React.FC<{ melt: number }> = ({ melt }) => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(state.clock.elapsedTime * 1.2 + i) * 0.003
        child.rotation.y += 0.001 * (i % 2 === 0 ? 1 : -1)
      })
    }
  })

  const bergs = useMemo(() => {
    return [
      { pos: [-4, -1.2, -4], scale: 1.4 },
      { pos: [4.5, -1.5, -5], scale: 1.8 },
      { pos: [-1.5, -1.8, -3], scale: 0.9 },
      { pos: [2.2, -1.4, -2.5], scale: 1.1 },
    ]
  }, [])

  return (
    <group ref={groupRef}>
      {bergs.map((b, idx) => {
        const currentScale = b.scale * Math.max(0.2, 1 - melt * 0.75)
        return (
          <mesh
            key={idx}
            position={[b.pos[0], b.pos[1] - melt * 0.8, b.pos[2]]}
            scale={[currentScale, currentScale * (1 - melt * 0.5), currentScale]}
          >
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#A5F3FC"
              roughness={0.18}
              metalness={0.3}
              flatShading
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Swirling Blizzard Snow Particles
const SnowBlizzard: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 2000

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const spd = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35
      pos[i * 3 + 1] = Math.random() * 20 - 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25
      spd[i] = 0.05 + Math.random() * 0.08
    }
    return { positions: pos, speeds: spd }
  }, [particleCount])

  useFrame(() => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] -= speeds[i] // fall down
      pos[i * 3] += Math.sin(pos[i * 3 + 1] * 0.2) * 0.02 // drift sideways

      if (pos[i * 3 + 1] < -6) {
        pos[i * 3 + 1] = 14
        pos[i * 3] = (Math.random() - 0.5) * 35
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#E0F7FA"
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}

// Water Ocean Plane
const FjordWater: React.FC<{ melt: number }> = ({ melt }) => {
  const waterRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = -2.2 + melt * 0.7 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04
    }
  })

  return (
    <mesh
      ref={waterRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.2 + melt * 0.7, 0]}
    >
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color={melt > 0.6 ? '#063B54' : '#032035'}
        roughness={0.08}
        metalness={0.8}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

// 2D Canvas Fallback (Used when WebGL is unaccelerated or in low quality)
const Canvas2DFallback: React.FC<{ melt: number }> = ({ melt }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const w = (canvas.width = canvas.offsetWidth || window.innerWidth)
    const h = (canvas.height = canvas.offsetHeight || window.innerHeight)

    const particles: { x: number; y: number; r: number; vy: number; vx: number }[] = []
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1,
        vy: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h)

      // Ocean gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, '#04111F')
      grad.addColorStop(0.6, '#07253D')
      grad.addColorStop(1, '#020C17')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Glacier mountain silhouette
      ctx.fillStyle = `rgba(110, 231, 249, ${0.15 * (1 - melt * 0.5)})`
      ctx.beginPath()
      ctx.moveTo(0, h * 0.75)
      ctx.lineTo(w * 0.25, h * (0.35 + melt * 0.2))
      ctx.lineTo(w * 0.5, h * (0.55 + melt * 0.15))
      ctx.lineTo(w * 0.75, h * (0.3 + melt * 0.25))
      ctx.lineTo(w, h * 0.75)
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()

      // Snow particles
      ctx.fillStyle = '#EAF8FF'
      particles.forEach((p) => {
        p.y += p.vy
        p.x += p.vx
        if (p.y > h) p.y = -5
        if (p.x > w) p.x = 0
        if (p.x < 0) p.x = w

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [melt])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export const GlacierScene: React.FC = () => {
  const { meltProgress, setMeltProgress } = useThemeStore()
  const [webGLError, setWebGLError] = React.useState(false)

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      {/* 3D Scene */}
      {!webGLError ? (
        <Canvas
          camera={{ position: [0, 1.5, 7], fov: 55 }}
          className="absolute inset-0 w-full h-full"
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#04111F'))
          }}
          onError={() => setWebGLError(true)}
        >
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[8, 12, 5]}
            intensity={1.4}
            color="#EAF8FF"
          />
          <pointLight
            position={[-6, 4, 3]}
            intensity={2.2}
            color="#6EE7F9"
          />
          <pointLight
            position={[0, -2, 2]}
            intensity={1.0}
            color="#2B7FFF"
          />

          <IceTerrain melt={meltProgress} />
          <FloatingIcebergs melt={meltProgress} />
          <FjordWater melt={meltProgress} />
          <SnowBlizzard />
          <fog attach="fog" args={['#04111F', 6, 26]} />
        </Canvas>
      ) : (
        <Canvas2DFallback melt={meltProgress} />
      )}

      {/* Cinematic Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04111F] via-transparent to-[#04111F]/80" />
      <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-70" />

      {/* Interactive Thaw Control Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl">
        <div className="px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-2xl border border-[#6EE7F9]/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#6EE7F9] flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#6EE7F9] animate-ping" />
              GLACIER THAW & SEA RISE ACCELERATOR
            </span>
            <span className="text-white/80 font-bold">
              +{ (meltProgress * 3.8).toFixed(1) }°C / +{ (meltProgress * 84).toFixed(0) } cm SLR
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/50">1850</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={meltProgress}
              onChange={(e) => setMeltProgress(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#6EE7F9]"
            />
            <span className="text-[10px] font-mono text-rose-400 font-bold">2050</span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] font-mono text-white/60">
            <button
              type="button"
              onClick={() => setMeltProgress(0.0)}
              className="hover:text-[#6EE7F9] transition-colors"
            >
              [1850 Pristine]
            </button>
            <button
              type="button"
              onClick={() => setMeltProgress(0.45)}
              className="text-[#6EE7F9] font-bold underline"
            >
              [2025 Current (+1.49°C)]
            </button>
            <button
              type="button"
              onClick={() => setMeltProgress(0.95)}
              className="hover:text-rose-400 transition-colors"
            >
              [2050 Tipping (+3.5°C)]
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
