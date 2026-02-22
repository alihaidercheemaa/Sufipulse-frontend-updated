"use client"

import type React from "react"
import Link from "next/link"

interface QuickActionCardProps {
  title: string
  icon: React.ReactNode
  href: string
  description?: string
  color?: string
}

export default function QuickActionCard({
  title,
  icon,
  href,
  description,
  color = "from-emerald-500 to-emerald-700",
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-900 text-center">{title}</span>
      {description && (
        <span className="text-xs text-slate-500 text-center mt-1">{description}</span>
      )}
    </Link>
  )
}
