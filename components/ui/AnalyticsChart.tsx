"use client"

import { useState, useMemo } from "react"

interface AnalyticsChartProps {
  title?: string
  description?: string
  data: {
    label: string
    value: number
    date?: string
  }[]
  type?: "line" | "bar" | "area"
  color?: string
  height?: number
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showTooltip?: boolean
  formatY?: (value: number) => string
}

export default function AnalyticsChart({
  title,
  description,
  data,
  type = "line",
  color = "#10b981",
  height = 250,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  formatY = (v) => v.toString(),
}: AnalyticsChartProps) {
  const { maxValue, points, pathD, areaPathD, bars } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 0, points: [], pathD: "", areaPathD: "", bars: [] }
    }

    const values = data.map((d) => d.value)
    const maxValue = Math.max(...values, 1)
    const chartWidth = 100
    const chartHeight = 100
    const padding = 5

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1 || 1)) * (chartWidth - 2 * padding)
      const y = chartHeight - padding - (d.value / maxValue) * (chartHeight - 2 * padding)
      return { x, y, ...d }
    })

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ")

    const areaPathD =
      points.length > 0
        ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
        : ""

    const barWidth = (chartWidth - 2 * padding) / data.length - 2
    const bars = data.map((d, i) => {
      const x = padding + i * ((chartWidth - 2 * padding) / data.length) + 1
      const barHeight = ((d.value / maxValue) * (chartHeight - 2 * padding)) || 0
      const y = chartHeight - padding - barHeight
      return { x, y, width: barWidth, height: barHeight, ...d }
    })

    return { maxValue, points, pathD, areaPathD, bars }
  }, [data])

  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full ">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      )}

      <div className="relative " style={{ height }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full absolute  h-full"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Grid lines */}
          {showGrid && (
            <g className="text-slate-200 ">
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.2"
                  strokeDasharray="2,2"
                />
              ))}
            </g>
          )}

          {/* Y Axis labels */}
          {showYAxis && (
            <g className="text-slate-400 text-[3px]">
              {[0, 50, 100].map((val) => (
                <text
                  key={val}
                  x="-1"
                  y={val === 0 ? 98 : val === 50 ? 50 : 5}
                  textAnchor="end"
                  alignmentBaseline="middle"
                >
                  {formatY((val / 100) * maxValue)}
                </text>
              ))}
            </g>
          )}

          {/* Bars for bar chart */}
          {type === "bar" &&
            bars.map((bar, i) => (
              <g key={i}>
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill={color}
                  opacity={hoveredPoint === i ? 0.8 : 0.6}
                  rx="1"
                  className="transition-opacity cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                />
                {showTooltip && hoveredPoint === i && (
                  <g>
                    <rect
                      x={bar.x - 20}
                      y={bar.y - 5}
                      width="20"
                      height="10"
                      fill="#1e293b"
                      rx="2"
                    />
                    <text
                      x={bar.x - 6}
                      y={bar.y + 1}
                      textAnchor="middle"
                      fill="white"
                      fontSize="3"
                    >
                      {formatY(bar.value)}
                    </text>
                  </g>
                )}
              </g>
            ))}

          {/* Area fill for area chart */}
          {type === "area" && areaPathD && (
            <path
              d={areaPathD}
              fill={color}
              fillOpacity="0.1"
              className="transition-all"
            />
          )}

          {/* Line for line/area chart */}
          {(type === "line" || type === "area") && pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all"
            />
          )}

          {/* Data points for line/area chart */}
          {(type === "line" || type === "area") &&
            points.map((point, i) => (
              <g key={i}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint === i ? 3 : 2}
                  fill="white"
                  stroke={color}
                  strokeWidth="1"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                />
                {showTooltip && hoveredPoint === i && (
                  <g>
                    <rect
                      x={point.x - 25}
                      y={point.y - 5}
                      width="20"
                      height="12"
                      fill="#1e293b"
                      rx="2"
                    />
                    <text
                      x={point.x - 10}
                      y={point.y + 1}
                      textAnchor="middle"
                      fill="white"
                      fontSize="3"
                      
                    >
                      {formatY(point.value)}
                    </text>
                  </g>
                )}
              </g>
            ))}

          {/* X Axis labels */}
          {showXAxis && data.length <= 12 && (
            <g className="text-slate-400 text-[2.5px]">
              {data.map((d, i) => {
                const x = 5 + (i / (data.length - 1 || 1)) * 90
                return (
                  <text
                    key={i}
                    x={x}
                    y="102"
                    textAnchor="middle"
                    alignmentBaseline="hanging"
                  >
                    {d.label.length > 6 ? d.label.substring(0, 6) + "…" : d.label}
                  </text>
                )
              })}
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}
