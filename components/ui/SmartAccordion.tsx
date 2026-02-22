"use client"

import React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export interface SmartAccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export const SmartAccordion: React.FC<SmartAccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  icon,
  className = "",
  headerClassName = "",
  contentClassName = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={`border border-slate-200 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 flex items-center justify-between
          bg-slate-50 hover:bg-slate-100 transition-colors
          ${headerClassName}
        `}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-slate-500">{icon}</span>}
          <span className="font-medium text-slate-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className={`p-4 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  )
}

export default SmartAccordion
