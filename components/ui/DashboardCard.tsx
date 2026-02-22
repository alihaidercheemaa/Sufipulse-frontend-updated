"use client"

import type React from "react"
import Link from "next/link"

interface DashboardCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  hover?: boolean
  onClick?: () => void
}

export default function DashboardCard({
  children,
  className = "",
  title,
  description,
  icon,
  action,
  hover = true,
  onClick,
}: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-slate-200 p-6
        ${hover ? "hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer" : ""}
        ${className}
      `}
    >
      {(title || description || icon || action) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
              {description && <p className="text-sm text-slate-600 mt-0.5">{description}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
