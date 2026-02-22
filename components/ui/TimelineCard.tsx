"use client"

import React from "react"
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export interface TimelineItem {
  date: string
  title: string
  description?: string
  status?: "pending" | "completed" | "rejected" | "info"
  icon?: React.ReactNode
}

export interface TimelineCardProps {
  title?: string
  items: TimelineItem[]
  className?: string
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  title,
  items,
  className = "",
}) => {
  const getStatusIcon = (status?: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-blue-600" />
    }
  }

  const getStatusColor = (status?: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "border-emerald-200 bg-emerald-50"
      case "rejected":
        return "border-red-200 bg-red-50"
      case "pending":
        return "border-amber-200 bg-amber-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
          
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
                  bg-white z-10
                  ${item.status === "completed" ? "border-emerald-500" : 
                    item.status === "rejected" ? "border-red-500" :
                    item.status === "pending" ? "border-amber-500" : "border-blue-500"}
                `}>
                  {item.icon || getStatusIcon(item.status)}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className={`
                    rounded-lg p-4 border
                    ${getStatusColor(item.status)}
                  `}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-500">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-slate-600 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineCard
