"use client"

import React from "react"
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"

export interface StatusTrackerProps {
  currentStatus: string
  steps?: {
    value: string
    label: string
    icon?: React.ReactNode
  }[]
  className?: string
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  currentStatus,
  steps = [
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "published", label: "Published" },
  ],
  className = "",
}) => {
  const getStatusIndex = (status: string) => {
    return steps.findIndex((step) => step.value === status)
  }

  const currentIndex = getStatusIndex(currentStatus)

  const getStepStatus = (index: number) => {
    if (index < currentIndex) return "completed"
    if (index === currentIndex) return "current"
    return "pending"
  }

  const getStepIcon = (status: string, index: number) => {
    if (status === "completed") {
      return <CheckCircle className="w-4 h-4 text-white" />
    }
    if (status === "current") {
      return (
        <div className="w-2 h-2 rounded-full bg-white" />
      )
    }
    return null
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ 
              width: `${currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0}%` 
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(index)
            
            return (
              <div 
                key={step.value}
                className="flex flex-col items-center"
              >
                {/* Step Circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${stepStatus === "completed" 
                      ? "bg-emerald-500" 
                      : stepStatus === "current"
                        ? "bg-emerald-500 ring-4 ring-emerald-100"
                        : "bg-slate-200"}
                  `}
                >
                  {getStepIcon(stepStatus, index)}
                </div>

                {/* Step Label */}
                <span
                  className={`
                    mt-2 text-xs font-medium text-center max-w-[80px]
                    ${stepStatus === "completed" || stepStatus === "current"
                      ? "text-emerald-700"
                      : "text-slate-400"}
                  `}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StatusTracker
