import React, { useRef, useState } from 'react'

interface LiquidGlassCardProps {
  children: React.ReactNode
  className?: string
  tilt?: boolean
  glow?: boolean
  onClick?: () => void
  highlight?: boolean
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = '',
  tilt = true,
  glow = true,
  onClick,
  highlight = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Max 8deg tilt
    const rX = ((y - centerY) / centerY) * -6
    const rY = ((x - centerX) / centerX) * 6

    setRotateX(rX)
    setRotateY(rY)
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt && isHovered ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)` : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      className={`
        relative rounded-2xl overflow-hidden
        bg-white/[0.03] backdrop-blur-2xl
        border border-[var(--glass-border)]
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        ${glow && isHovered ? 'shadow-[0_0_30px_rgba(var(--accent-rgb),0.25)] border-[rgba(var(--accent-rgb),0.4)]' : ''}
        ${highlight ? 'ring-1 ring-[var(--accent)]' : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}
        ${className}
      `}
    >
      {/* Glare gradient follow */}
      {tilt && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(var(--accent-rgb), 0.22), transparent 70%)`,
          }}
        />
      )}

      {/* Top subtle highlight reflection border */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--accent-rgb),0.45)] to-transparent" />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
