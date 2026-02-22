"use client"

import React from "react"
import { Building2, Wifi, Calendar, Clock, Mail, Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react"

export interface RequestCardProps {
  id: number
  type: "studio" | "remote"
  kalamTitle?: string
  kalamId?: number
  status?: "pending" | "pending_review" | "approved" | "rejected" | "completed" | "under_review"
  createdAt?: string
  preferredDate?: string
  preferredTime?: string
  vocalistName?: string
  vocalistEmail?: string
  location?: { city?: string; country?: string }
  equipment?: string
  experience?: string
  additionalDetails?: string
  adminComments?: string
  onExpand?: () => void
  isExpanded?: boolean
  className?: string
}

export const RequestCard: React.FC<RequestCardProps> = ({
  id,
  type,
  kalamTitle,
  kalamId,
  status = "pending",
  createdAt,
  preferredDate,
  preferredTime,
  vocalistName,
  vocalistEmail,
  location,
  equipment,
  experience,
  additionalDetails,
  adminComments,
  onExpand,
  isExpanded = false,
  className = "",
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "pending":
      case "pending_review":
      case "under_review":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const Icon = type === "studio" ? Building2 : Wifi

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div 
        className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onExpand}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
              ${type === "studio" 
                ? "bg-blue-100 text-blue-600" 
                : "bg-emerald-100 text-emerald-600"}
            `}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  {type === "studio" ? "Studio Recording Request" : "Remote Recording Request"}
                </h3>
                {status && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {status.replace("_", " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                )}
              </div>
              {kalamTitle && (
                <p className="text-sm text-slate-600">
                  For: <span className="font-medium">{kalamTitle}</span>
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Request #{id}</span>
                </div>
                {createdAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-slate-400">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
            {/* Vocalist Info */}
            {(vocalistName || vocalistEmail) && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Vocalist Information
                </h4>
                {vocalistName && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Name:</span> {vocalistName}
                  </p>
                )}
                {vocalistEmail && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Email:</span> {vocalistEmail}
                  </p>
                )}
              </div>
            )}

            {/* Location (Remote) */}
            {type === "remote" && location && (location.city || location.country) && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Location
                </h4>
                <p className="text-sm text-slate-600">
                  {[location.city, location.country].filter(Boolean).join(", ")}
                </p>
              </div>
            )}

            {/* Preferred Date/Time (Studio) */}
            {type === "studio" && (preferredDate || preferredTime) && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Preferred Schedule
                </h4>
                {preferredDate && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Date:</span> {formatDate(preferredDate)}
                  </p>
                )}
                {preferredTime && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Time:</span> {preferredTime}
                  </p>
                )}
              </div>
            )}

            {/* Equipment (Remote) */}
            {type === "remote" && equipment && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-slate-400" />
                  Recording Equipment
                </h4>
                <p className="text-sm text-slate-600">{equipment}</p>
              </div>
            )}

            {/* Experience (Remote) */}
            {type === "remote" && experience && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Experience
                </h4>
                <p className="text-sm text-slate-600">{experience}</p>
              </div>
            )}

            {/* Additional Details */}
            {additionalDetails && (
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Additional Details</h4>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{additionalDetails}</p>
              </div>
            )}

            {/* Admin Comments */}
            {adminComments && (
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Admin Comments</h4>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800 whitespace-pre-wrap">{adminComments}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RequestCard
