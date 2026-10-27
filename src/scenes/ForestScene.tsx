import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useThemeStore } from '../store/themeStore'
import confetti from 'canvas-confetti'

// Instanced Trees
const CanopyTrees: React.FC<{ health: number }> = ({ health }) => {
  const groupRef = useRef<THREE.Group>(null)

  // Generate grid of trees
  const treePositions = useMemo(() => {
    const list: { x: number; z: number; scale: number; rotY: number; type: number }[] = []
    const range = 24
    for (let x = -range; x <= range; x += 2.2) {
      for (let z = -range; z <= range; z += 2.2) {
        // jitter
        const jx = x + (Math.random() - 0.5) * 1.2
        const jz = z + (Math.random() - 0.5) * 1.2
        const dist = Math.sqrt(jx * jx + jz * jz)
        if (dist > 3 && dist < 26) {
          list.push({
            x: jx,
            z: jz,
            scale: 0.8 + Math.random() * 0.6,
            rotY: Math.random() * Math.PI * 2,
            type: Math.random() > 0.4 ? 1 : 2,
          })
        }
      }
    }
    return list
  }, [])

  // Trees fall or vanish if health drops below their threshold
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      groupRef.current.children.forEach((child, i) => {
        // Subtle wind sway
        child.rotation.z = Math.sin(time * 1.5 + i * 0.2) * 0.04
      })
    }
  })

  // Fraction of surviving trees based on health (0-100)
  const survivingCount = Math.floor((health / 100) * treePositions.length)

  return (
    <group ref={groupRef}>
      {treePositions.map((t, i) => {
        const isFelled = i >= survivingCount
        return (
          <group
            key={i}
            position={[t.x, isFelled ? -1.8 : -1.0, t.z]}
            rotation={[isFelled ? Math.PI / 2.2 : 0, t.rotY, 0]}
            scale={isFelled ? [t.scale * 0.8, t.scale * 0.2, t.scale * 0.8] : [t.scale, t.scale, t.scale]}
          >
            {/* Trunk */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.08, 0.14, 1.2, 5]} />
              <meshStandardMaterial color={isFelled ? '#3D2517' : '#4E311F'} roughness={0.9} />
            </mesh>

            {/* Foliage Cone (if alive) */}
            {!isFelled && (
              <mesh position={[0, 1.8, 0]}>
                <coneGeometry args={[0.9, 1.8, 6]} />
                <meshStandardMaterial
                  color={health > 70 ? '#15803D' : health > 40 ? '#4D7C0F' : '#854D0E'}
                  roughness={0.6}
                  flatShading
                />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

// Glowing Spores & Fireflies
const ForestFireflies: React.FC<{ health: number }> = ({ health }) => {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 800

  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const rnd = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = Math.random() * 8 - 1
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30

      rnd[i * 3] = Math.random() * 2
      rnd[i * 3 + 1] = Math.random() * 2
      rnd[i * 3 + 2] = Math.random() * 2
    }
    return { positions: pos, randoms: rnd }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3] += Math.sin(time + randoms[i * 3]) * 0.015
      pos[i * 3 + 1] += Math.cos(time * 0.8 + randoms[i * 3 + 1]) * 0.01
      pos[i * 3 + 2] += Math.sin(time * 0.5 + randoms[i * 3 + 2]) * 0.015
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={health > 50 ? '#86EFAC' : '#FDE047'}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Forest Floor Terrain
const ForestFloor: React.FC<{ health: number }> = ({ health }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <planeGeometry args={[60, 60, 16, 16]} />
      <meshStandardMaterial
        color={health > 60 ? '#0B1C10' : health > 30 ? '#261C0E' : '#3B1A12'}
        roughness={0.95}
      />
    </mesh>
  )
}

// 2D Canvas Fallback
const Forest2DFallback: React.FC<{ health: number }> = ({ health }) => {
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
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, '#07140C')
      grad.addColorStop(0.6, '#0D2916')
      grad.addColorStop(1, '#051109')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Canopy layers
      ctx.fillStyle = `rgba(34, 197, 94, ${0.12 * (health / 100)})`
      for (let i = 0; i < 6; i++) {
        ctx.beginPath()
        ctx.arc(w * (0.15 + i * 0.16), h * 0.7, w * 0.18, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [health])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export const ForestScene: React.FC = () => {
  const { forestHealth, setForestHealth } = useThemeStore()
  const [webGLError, setWebGLError] = React.useState(false)

  const handleRestore = () => {
    setForestHealth(95)
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#22C55E', '#86EFAC', '#15803D', '#FDE047'],
    })
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      {!webGLError ? (
        <Canvas
          camera={{ position: [0, 3, 12], fov: 50 }}
          className="absolute inset-0 w-full h-full"
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#07140C'))
          }}
          onError={() => setWebGLError(true)}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 15, 8]} intensity={1.8} color="#D1FAE5" />
          <pointLight position={[-8, 6, 2]} intensity={2.0} color="#22C55E" />
          <pointLight position={[6, 3, 4]} intensity={1.5} color="#A7F3D0" />

          <CanopyTrees health={forestHealth} />
          <ForestFloor health={forestHealth} />
          <ForestFireflies health={forestHealth} />
          <fog attach="fog" args={['#07140C', 8, 30]} />
        </Canvas>
      ) : (
        <Forest2DFallback health={forestHealth} />
      )}

      {/* Cinematic Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07140C] via-transparent to-[#07140C]/80" />
      <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-70" />

      {/* Interactive Forest Health Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl">
        <div className="px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-2xl border border-[#22C55E]/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#22C55E] flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              TROPICAL CANOPY INTEGRITY
            </span>
            <span className="text-white/80 font-bold">
              {forestHealth}% INTACT ({100 - forestHealth}% DEFORESTED)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-rose-400 font-bold">0% Collapse</span>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={forestHealth}
              onChange={(e) => setForestHealth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#22C55E]"
            />
            <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Virgin</span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] font-mono text-white/60">
            <button
              type="button"
              onClick={() => setForestHealth(22)}
              className="hover:text-rose-400 transition-colors"
            >
              [Tipping Point (22%)]
            </button>
            <button
              type="button"
              onClick={() => setForestHealth(68)}
              className="text-[#22C55E] font-bold underline"
            >
              [2025 Current (68%)]
            </button>
            <button
              type="button"
              onClick={handleRestore}
              className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/50 hover:bg-[#22C55E]/30 transition-all font-bold"
            >
              🌱 RESTORE CANOPY
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
