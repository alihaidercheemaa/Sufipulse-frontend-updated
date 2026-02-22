"use client"

import React from "react"
import { X } from "lucide-react"

export interface TagCloudProps {
  tags: string[]
  onRemove?: (tag: string) => void
  onTagClick?: (tag: string) => void
  className?: string
  tagClassName?: string
  variant?: "default" | "outlined" | "filled"
  size?: "sm" | "md" | "lg"
  color?: "emerald" | "blue" | "purple" | "slate"
  interactive?: boolean
  emptyMessage?: string
}

export const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  onRemove,
  onTagClick,
  className = "",
  tagClassName = "",
  variant = "default",
  size = "md",
  color = "emerald",
  interactive = false,
  emptyMessage = "No tags",
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  }

  const colorClasses = {
    emerald: {
      default: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      outlined: "border border-emerald-300 text-emerald-700 hover:bg-emerald-50",
      filled: "bg-emerald-600 text-white hover:bg-emerald-700",
    },
    blue: {
      default: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      outlined: "border border-blue-300 text-blue-700 hover:bg-blue-50",
      filled: "bg-blue-600 text-white hover:bg-blue-700",
    },
    purple: {
      default: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      outlined: "border border-purple-300 text-purple-700 hover:bg-purple-50",
      filled: "bg-purple-600 text-white hover:bg-purple-700",
    },
    slate: {
      default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
      outlined: "border border-slate-300 text-slate-700 hover:bg-slate-50",
      filled: "bg-slate-600 text-white hover:bg-slate-700",
    },
  }

  if (tags.length === 0) {
    return (
      <div className={`text-sm text-slate-500 italic ${className}`}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <span
          key={index}
          onClick={() => onTagClick?.(tag)}
          className={`
            inline-flex items-center gap-1.5 rounded-full font-medium
            transition-all duration-200
            ${sizeClasses[size]}
            ${colorClasses[color][variant]}
            ${interactive ? "cursor-pointer" : ""}
            ${tagClassName}
          `}
        >
          <span>#{tag}</span>
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(tag)
              }}
              className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  )
}

export default TagCloud
