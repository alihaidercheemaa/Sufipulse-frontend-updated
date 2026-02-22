"use client"

import type React from "react"
import Link from "next/link"

interface MetricCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  link?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

export default function MetricCard({
  title,
  value,
  icon,
  color,
  link,
  trend,
  description,
}: MetricCardProps) {
  const content = (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-4xl font-bold text-slate-900 mt-2 group-hover:text-emerald-700 transition-colors">
            {value}
          </p>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          {trend && (
            <div className="flex items-center mt-3">
              <span
                className={`text-sm font-semibold ${trend.isPositive ? "text-emerald-600" : "text-red-600"}`}
              >
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-500 ml-2">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      </div>
    </div>
  )

  if (link) {
    return (
      <Link href={link} className="block group">
        {content}
      </Link>
    )
  }

  return <div className="group">{content}</div>
}
