"use client"

import React, { useState } from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"

export interface SmartMultiSelectProps {
  options: { value: string; label: string }[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  maxSelected?: number
  searchable?: boolean
}

export const SmartMultiSelect: React.FC<SmartMultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options",
  label,
  description,
  disabled = false,
  className = "",
  maxSelected,
  searchable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleToggle = (optionValue: string) => {
    if (disabled) return

    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      if (maxSelected && value.length >= maxSelected) return
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full min-h-[44px] px-4 py-2 text-left
            bg-white border border-slate-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            disabled:bg-slate-100 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
        >
          <div className="flex flex-wrap gap-2">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                >
                  {opt.label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, opt.value)}
                      className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )}
          </div>
        </button>
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleToggle(opt.value)}
                  className={`
                    w-full px-4 py-2.5 text-left flex items-center justify-between
                    hover:bg-slate-50 transition-colors
                    ${value.includes(opt.value) ? "bg-emerald-50" : ""}
                  `}
                >
                  <span className="text-sm text-slate-900">{opt.label}</span>
                  {value.includes(opt.value) && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No options found
              </div>
            )}
          </div>
          {maxSelected && (
            <div className="px-4 py-2 border-t border-slate-100 text-xs text-slate-500">
              Selected: {value.length} / {maxSelected}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SmartMultiSelect
