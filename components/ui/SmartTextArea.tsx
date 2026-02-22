"use client"

import React from "react"
import { LucideIcon } from "lucide-react"

export interface SmartTextAreaProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  icon?: LucideIcon
  helpText?: string
  rows?: number
  maxLength?: number
  showCharacterCount?: boolean
  className?: string
  labelClassName?: string
  textareaClassName?: string
  autoResize?: boolean
}

export const SmartTextArea: React.FC<SmartTextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  icon: Icon,
  helpText,
  rows = 4,
  maxLength,
  showCharacterCount = false,
  className = "",
  labelClassName = "",
  textareaClassName = "",
  autoResize = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const characterCount = value.length
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0

  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value, autoResize])

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
          <div className="absolute left-3 top-3 text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
          className={`
            w-full px-4 py-2.5 rounded-lg border border-slate-300 
            bg-white text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
            transition-all duration-200 resize-y
            ${Icon ? "pl-10" : ""}
            ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
            ${textareaClassName}
          `}
        />
      </div>
      {(helpText || showCharacterCount || maxLength) && (
        <div className="flex items-center justify-between">
          {helpText && !error && (
            <p className="text-xs text-slate-500">{helpText}</p>
          )}
          {error && (
            <p className="text-xs text-red-600 font-medium">{error}</p>
          )}
          {showCharacterCount && (
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{characterCount} {maxLength ? `/ ${maxLength}` : ""} chars</span>
              <span>•</span>
              <span>{wordCount} words</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SmartTextArea
