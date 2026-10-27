import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Wind Turbine with rotating rotor
const WindTurbine: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => {
  const bladesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z = state.clock.elapsedTime * 2.5
    }
  })

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Tower */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.08, 0.16, 4, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Nacelle */}
      <mesh position={[0, 4, 0.15]}>
        <boxGeometry args={[0.3, 0.3, 0.6]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Hub & Blades */}
      <group ref={bladesRef} position={[0, 4, 0.45]}>
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.3} />
        </mesh>
        {/* 3 Aerofoil Blades */}
        {[0, 120, 240].map((deg) => (
          <group key={deg} rotation={[0, 0, (deg * Math.PI) / 180]}>
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[0.1, 2.4, 0.02]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

// Clean Rolling Landscape
const CleanEnergyTerrain: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <planeGeometry args={[60, 60, 32, 32]} />
      <meshStandardMaterial color="#0A2533" roughness={0.8} />
    </mesh>
  )
}

export const SolutionsScene: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        className="absolute inset-0 w-full h-full"
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#04141E'))
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1.8} color="#E0F2FE" />
        <pointLight position={[-4, 6, 2]} intensity={2.0} color="#38BDF8" />
        <pointLight position={[4, 3, -1]} intensity={1.5} color="#34D399" />

        <WindTurbine position={[-3.5, -1.8, -2]} scale={0.9} />
        <WindTurbine position={[0, -1.8, -4]} scale={1.2} />
        <WindTurbine position={[3.8, -1.8, -1]} scale={0.8} />

        <CleanEnergyTerrain />
        <fog attach="fog" args={['#04141E', 6, 25]} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04141E] via-transparent to-[#04141E]/80" />
      <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-70" />
    </div>
  )
}
