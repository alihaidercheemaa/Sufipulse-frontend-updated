"use client"

import { Eye, MessageCircle, Share2, Heart } from "lucide-react"

interface EngagementMetricsProps {
  views?: number
  comments?: number
  shares?: number
  likes?: number
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Displays blog engagement metrics (views, comments, shares, likes)
 * with icons and optional labels
 */
export default function EngagementMetrics({
  views = 0,
  comments = 0,
  shares = 0,
  likes = 0,
  showLabels = true,
  size = "md",
  className = "",
}: EngagementMetricsProps) {
  const sizeClasses = {
    sm: {
      icon: "w-3 h-3",
      value: "text-sm",
      label: "text-xs",
      container: "gap-3",
    },
    md: {
      icon: "w-4 h-4",
      value: "text-base",
      label: "text-xs",
      container: "gap-4",
    },
    lg: {
      icon: "w-5 h-5",
      value: "text-lg",
      label: "text-sm",
      container: "gap-6",
    },
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const metrics = [
    {
      icon: Eye,
      value: views,
      label: "Views",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: MessageCircle,
      value: comments,
      label: "Comments",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Heart,
      value: likes,
      label: "Likes",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      icon: Share2,
      value: shares,
      label: "Shares",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className={`flex items-center ${sizeClasses[size].container} ${className}`}>
      {metrics.map((metric) => {
        const Icon = metric.icon
        const hasValue = metric.value > 0
        return (
          <div
            key={metric.label}
            className={`flex items-center ${showLabels ? "gap-2" : "gap-1.5"} ${metric.bgColor} px-2 py-1 rounded-full`}
          >
            <Icon className={`${sizeClasses[size].icon} ${metric.color}`} />
            {hasValue && (
              <>
                <span className={`${sizeClasses[size].value} font-semibold text-slate-700`}>
                  {formatNumber(metric.value)}
                </span>
                {showLabels && (
                  <span className={`${sizeClasses[size].label} text-slate-500 hidden sm:inline`}>
                    {metric.label}
                  </span>
                )}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
