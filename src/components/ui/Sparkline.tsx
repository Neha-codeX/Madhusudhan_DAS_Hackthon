import React, { useState } from 'react'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  fillGradient?: boolean
  showHover?: boolean
  className?: string
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 36,
  color = 'var(--accent)',
  fillGradient = true,
  showHover = true,
  className = '',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const padding = 4
  const usableWidth = width - padding * 2
  const usableHeight = height - padding * 2

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth
    const y = height - padding - ((val - min) / range) * usableHeight
    return { x, y, val }
  })

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
  }, '')

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  const gradId = `spark-grad-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {fillGradient && <path d={areaD} fill={`url(#${gradId})`} />}

        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover interaction points */}
        {showHover &&
          points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={hoverIndex === i ? 4 : 2}
              className="cursor-pointer transition-all duration-150"
              fill={hoverIndex === i ? '#ffffff' : color}
              stroke={hoverIndex === i ? color : 'none'}
              strokeWidth="2"
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}
      </svg>

      {hoverIndex !== null && (
        <div
          className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur-md shadow-lg border border-white/20 bg-black/80"
          style={{ left: `${points[hoverIndex].x}px` }}
        >
          {data[hoverIndex]}
        </div>
      )}
    </div>
  )
}
