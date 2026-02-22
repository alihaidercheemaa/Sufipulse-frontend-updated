"use client"

import React from "react"
import { LucideIcon } from "lucide-react"

export interface StatBoxProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "emerald" | "blue" | "purple" | "amber" | "red"
  className?: string
}

export const StatBox: React.FC<StatBoxProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  color = "emerald",
  className = "",
}) => {
  const colorClasses = {
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      iconBg: "bg-amber-100",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      iconBg: "bg-red-100",
    },
  }

  const { bg, text, iconBg } = colorClasses[color]

  return (
    <div className={`p-4 rounded-xl border border-slate-200 ${bg} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className={`text-2xl font-bold ${text} mt-1`}>{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.isPositive ? "text-emerald-600" : "text-red-600"}`}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconBg}`}>
            <Icon className={`w-6 h-6 ${text}`} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatBox
