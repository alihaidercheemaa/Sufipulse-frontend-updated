"use client"

import React from "react"
import { Check, X } from "lucide-react"

export interface SmartToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export const SmartToggle: React.FC<SmartToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-9 h-5",
    md: "w-11 h-6",
    lg: "w-14 h-7",
  }

  const knobSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const translateClasses = {
    sm: checked ? "translate-x-4" : "translate-x-0",
    md: checked ? "translate-x-5" : "translate-x-0",
    lg: checked ? "translate-x-7" : "translate-x-0",
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex items-center rounded-full transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${checked ? "bg-emerald-600" : "bg-slate-300"}
        `}
      >
        <span
          className={`
            inline-flex items-center justify-center rounded-full bg-white shadow transform transition-transform duration-200
            ${knobSizeClasses[size]}
            ${translateClasses[size]}
          `}
        >
          {checked ? (
            <Check className={`${size === "sm" ? "w-2.5 h-2.5" : size === "md" ? "w-3 h-3" : "w-3.5 h-3.5"} text-emerald-600`} />
          ) : (
            <X className={`${size === "sm" ? "w-2.5 h-2.5" : size === "md" ? "w-3 h-3" : "w-3.5 h-3.5"} text-slate-400`} />
          )}
        </span>
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && <p className="text-sm font-medium text-slate-900">{label}</p>}
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      )}
    </div>
  )
}

export default SmartToggle
