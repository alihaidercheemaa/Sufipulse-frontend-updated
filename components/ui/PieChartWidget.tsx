"use client"

import { useMemo, useState } from "react"

interface PieChartWidgetProps {
  title?: string
  description?: string
  data: {
    label: string
    value: number
    color?: string
  }[]
  type?: "pie" | "donut"
  size?: number
  showLegend?: boolean
  showPercentage?: boolean
  showValue?: boolean
  innerRadius?: number
}

const DEFAULT_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ec4899", // pink
  "#ef4444", // red
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#6366f1", // indigo
]

export default function PieChartWidget({
  title,
  description,
  data,
  type = "donut",
  size = 200,
  showLegend = true,
  showPercentage = true,
  showValue = false,
  innerRadius = 50,
}: PieChartWidgetProps) {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)

  const { total, slices, centerValue } = useMemo(() => {
    if (!data || data.length === 0) {
      return { total: 0, slices: [], centerValue: 0 }
    }

    const total = data.reduce((sum, d) => sum + d.value, 0)
    let currentAngle = -90 // Start from top

    const slices = data.map((d, i) => {
      const percentage = total > 0 ? (d.value / total) * 100 : 0
      const angle = (d.value / total) * 360
      const startAngle = currentAngle
      const endAngle = currentAngle + angle
      currentAngle = endAngle

      const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]

      // Calculate path for pie/donut slice
      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180
      const outerRadius = 50
      const innerR = type === "donut" ? innerRadius : 0

      const x1 = 50 + outerRadius * Math.cos(startRad)
      const y1 = 50 + outerRadius * Math.sin(startRad)
      const x2 = 50 + outerRadius * Math.cos(endRad)
      const y2 = 50 + outerRadius * Math.sin(endRad)
      const x3 = 50 + innerR * Math.cos(endRad)
      const y3 = 50 + innerR * Math.sin(endRad)
      const x4 = 50 + innerR * Math.cos(startRad)
      const y4 = 50 + innerR * Math.sin(startRad)

      const largeArc = angle > 180 ? 1 : 0

      const pathD =
        type === "donut"
          ? `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`
          : `M 50 50 L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`

      return {
        ...d,
        color,
        percentage,
        pathD,
        startAngle,
        endAngle,
      }
    })

    return { total, slices, centerValue: total }
  }, [data, type, innerRadius])

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Chart */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {slices.map((slice, i) => (
              <path
                key={i}
                d={slice.pathD}
                fill={slice.color}
                opacity={hoveredSlice === null || hoveredSlice === i ? 1 : 0.5}
                className="transition-all cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredSlice(i)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            ))}
          </svg>

          {/* Center value for donut */}
          {type === "donut" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{total.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {slices.map((slice, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                  hoveredSlice === null || hoveredSlice === i
                    ? "bg-slate-50"
                    : "opacity-50"
                }`}
                onMouseEnter={() => setHoveredSlice(i)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-sm text-slate-700">{slice.label}</span>
                </div>
                <div className="text-right">
                  {showPercentage && (
                    <p className="text-sm font-semibold text-slate-900">
                      {slice.percentage.toFixed(1)}%
                    </p>
                  )}
                  {showValue && (
                    <p className="text-xs text-slate-500">{slice.value.toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
