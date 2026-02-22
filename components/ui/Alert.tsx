"use client"

import React from "react"
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react"

export interface AlertProps {
  type?: "info" | "success" | "warning" | "error"
  title?: string
  message: string | React.ReactNode
  onClose?: () => void
  className?: string
}

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  title,
  message,
  onClose,
  className = "",
}) => {
  const config = {
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      titleColor: "text-blue-900",
    },
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-800",
      titleColor: "text-emerald-900",
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-800",
      titleColor: "text-amber-900",
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      titleColor: "text-red-900",
    },
  }

  const { icon, bgColor, borderColor, textColor, titleColor } = config[type]

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${bgColor} ${borderColor} ${className}`}>
      <div className={`flex-shrink-0 ${textColor}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        {title && <p className={`font-semibold mb-1 ${titleColor}`}>{title}</p>}
        <div className={`text-sm ${textColor}`}>{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors ${textColor}`}
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default Alert
