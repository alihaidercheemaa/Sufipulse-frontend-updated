"use client"

import React from "react"
import { LucideIcon } from "lucide-react"

export interface SmartFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "date" | "datetime-local" | "time"
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  icon?: LucideIcon
  helpText?: string
  maxLength?: number
  minLength?: number
  min?: number
  max?: number
  step?: number
  className?: string
  labelClassName?: string
  inputClassName?: string
}

export const SmartField: React.FC<SmartFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  icon: Icon,
  helpText,
  maxLength,
  minLength,
  min,
  max,
  step,
  className = "",
  labelClassName = "",
  inputClassName = "",
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label 
        htmlFor={name} 
        className={`block text-sm font-medium text-slate-700 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          max={max}
          step={step}
          className={`
            w-full px-4 py-2.5 rounded-lg border border-slate-300 
            bg-white text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
            transition-all duration-200
            ${Icon ? "pl-10" : ""}
            ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
            ${inputClassName}
          `}
        />
      </div>
      {helpText && !error && (
        <p className="text-xs text-slate-500">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
}

export default SmartField
