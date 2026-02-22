"use client"

import type React from "react"

interface StatusCardProps {
  status: "success" | "warning" | "error" | "info" | "pending"
  title: string
  count?: number
  icon?: React.ReactNode
  description?: string
  onClick?: () => void
}

export default function StatusCard({
  status,
  title,
  count,
  icon,
  description,
  onClick,
}: StatusCardProps) {
  const statusConfig = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      iconBg: "bg-red-100",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      iconBg: "bg-blue-100",
    },
    pending: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-700",
      iconBg: "bg-slate-100",
    },
  }

  const config = statusConfig[status]

  return (
    <div
      onClick={onClick}
      className={`${config.bg} ${config.border} border rounded-xl p-5 cursor-pointer hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`${config.iconBg} p-2 rounded-lg`}>{icon}</div>
          )}
          <div>
            <p className={`text-sm font-medium ${config.text}`}>{title}</p>
            {count !== undefined && (
              <p className="text-2xl font-bold text-slate-900 mt-1">{count}</p>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
