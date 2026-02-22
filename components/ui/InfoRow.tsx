"use client"

import React from "react"
import { LucideIcon } from "lucide-react"

export interface InfoRowProps {
  label: string
  value: string | number | React.ReactNode
  icon?: LucideIcon
  copyable?: boolean
  emptyValue?: string
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  icon: Icon,
  copyable = false,
  emptyValue = "—",
  className = "",
  labelClassName = "",
  valueClassName = "",
}) => {
  const handleCopy = async () => {
    if (copyable && typeof value === "string") {
      await navigator.clipboard.writeText(value)
    }
  }

  const isEmpty = value === null || value === undefined || value === ""

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {Icon && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-slate-500 ${labelClassName}`}>{label}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className={`text-base font-medium text-slate-900 break-words ${valueClassName}`}>
            {isEmpty ? emptyValue : value}
          </p>
          {copyable && !isEmpty && typeof value === "string" && (
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-emerald-600 transition-colors"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoRow
