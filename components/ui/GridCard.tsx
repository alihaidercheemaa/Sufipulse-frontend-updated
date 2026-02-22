"use client"

import type React from "react"

interface GridCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function GridCard({ children, className = "", hover = true, onClick }: GridCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-slate-200 p-6
        ${hover ? "hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
