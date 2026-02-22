"use client"

import type React from "react"

interface DataGridProps {
  children: React.ReactNode
  columns?: number
  className?: string
}

export default function DataGrid({ children, columns = 1, className = "" }: DataGridProps) {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  return (
    <div className={`grid ${columnClasses[columns as keyof typeof columnClasses]} gap-4 sm:gap-6 ${className}`}>
      {children}
    </div>
  )
}
