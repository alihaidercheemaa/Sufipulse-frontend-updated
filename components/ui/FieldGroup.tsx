"use client"

import React from "react"
import { LucideIcon } from "lucide-react"

export interface FieldGroupProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
  headerClassName?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export const FieldGroup: React.FC<FieldGroupProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = "",
  headerClassName = "",
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  if (collapsible) {
    return (
      <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            w-full px-6 py-4 flex items-center gap-3 bg-slate-50 hover:bg-slate-100 
            transition-colors text-left
            ${headerClassName}
          `}
        >
          {Icon && (
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Icon className="w-5 h-5 text-emerald-600" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {description && (
              <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {!isCollapsed && (
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {children}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 ${className}`}>
      <div className={`px-6 py-4 border-b border-slate-100 flex items-start gap-3 ${headerClassName}`}>
        {Icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-emerald-600" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default FieldGroup
