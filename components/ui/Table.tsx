"use client"

import type React from "react"

interface TableProps {
  children: React.ReactNode
  className?: string
}

interface TableHeaderProps {
  children: React.ReactNode
  className?: string
}

interface TableBodyProps {
  children: React.ReactNode
  className?: string
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  header?: boolean
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className={`overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      <table className="w-full">{children}</table>
    </div>
  )
}

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return (
    <thead className={`bg-slate-50 border-b border-slate-200 ${className}`}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = "" }: TableBodyProps) {
  return <tbody className={`divide-y divide-slate-100 ${className}`}>{children}</tbody>
}

export function TableRow({ children, className = "", onClick, hover = true }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`${hover ? "hover:bg-slate-50 transition-colors" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </tr>
  )
}

export function TableCell({ children, className = "", header = false }: TableCellProps) {
  if (header) {
    return (
      <th className={`px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${className}`}>
        {children}
      </th>
    )
  }
  return <td className={`px-6 py-4 text-sm text-slate-700 ${className}`}>{children}</td>
}

Table.Header = TableHeader
Table.Body = TableBody
Table.Row = TableRow
Table.Cell = TableCell
