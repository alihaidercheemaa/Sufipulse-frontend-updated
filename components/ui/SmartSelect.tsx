"use client"

import React from "react"
import { ChevronDown, Check } from "lucide-react"

export interface SmartSelectProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  helpText?: string
  className?: string
  labelClassName?: string
  selectClassName?: string
  searchable?: boolean
}

export const SmartSelect: React.FC<SmartSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  error,
  disabled = false,
  helpText,
  className = "",
  labelClassName = "",
  selectClassName = "",
  searchable = false,
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
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-300 
            bg-white text-slate-900
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
            transition-all duration-200 appearance-none cursor-pointer
            ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
            ${selectClassName}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="w-5 h-5" />
        </div>
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

export default SmartSelect
