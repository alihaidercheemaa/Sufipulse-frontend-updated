"use client"

interface StatusBadgeProps {
  status: string
  customConfig?: Record<
    string,
    {
      color: string
      label?: string
    }
  >
}

export default function StatusBadge({ status, customConfig }: StatusBadgeProps) {
  const defaultConfig: Record<string, { color: string; label?: string }> = {
    // General statuses
    active: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Active" },
    inactive: { color: "bg-slate-100 text-slate-700 border-slate-200", label: "Inactive" },
    pending: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Pending" },
    approved: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Approved" },
    rejected: { color: "bg-red-100 text-red-700 border-red-200", label: "Rejected" },
    completed: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Completed" },

    // Blog statuses
    submitted: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Submitted" },
    review: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Under Review" },
    revision: { color: "bg-orange-100 text-orange-700 border-orange-200", label: "Needs Revision" },
    posted: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Posted" },

    // Recording request statuses
    pending_review: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Pending Review" },
    under_review: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Under Review" },
  }

  const config = customConfig?.[status] || defaultConfig[status] || defaultConfig.pending

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      {config.label || status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </span>
  )
}
