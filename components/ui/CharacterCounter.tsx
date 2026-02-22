"use client"

import React, { useState } from "react"
import { X } from "lucide-react"

export interface CharacterCounterProps {
  value: string
  maxLength?: number
  minLength?: number
  showCount?: boolean
  className?: string
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  value,
  maxLength,
  minLength,
  showCount = true,
  className = "",
}) => {
  const currentLength = value.length
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0

  const isOverLimit = maxLength && currentLength > maxLength
  const isUnderLimit = minLength && currentLength < minLength

  const getProgressColor = () => {
    if (isOverLimit) return "text-red-600"
    if (maxLength && currentLength > maxLength * 0.9) return "text-amber-600"
    return "text-slate-500"
  }

  const getProgressBarColor = () => {
    if (isOverLimit) return "bg-red-500"
    if (maxLength && currentLength > maxLength * 0.9) return "bg-amber-500"
    return "bg-emerald-500"
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {showCount && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {currentLength} {maxLength ? `/ ${maxLength}` : ""} characters • {wordCount} words
          </span>
          {minLength && (
            <span className={isUnderLimit ? "text-amber-600" : "text-emerald-600"}>
              {isUnderLimit ? `${minLength - currentLength} more needed` : "✓ Minimum met"}
            </span>
          )}
        </div>
      )}
      {maxLength && (
        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressBarColor()} transition-all duration-300`}
            style={{ width: `${Math.min((currentLength / maxLength) * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default CharacterCounter
