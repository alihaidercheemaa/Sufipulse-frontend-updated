"use client"

import React from "react"
import { User, Mail, MapPin, Calendar, Globe, Phone } from "lucide-react"

export interface ProfileCardProps {
  name: string
  email: string
  avatarUrl?: string
  location?: { city?: string; country?: string }
  joinedDate?: string
  bio?: string
  website?: string
  phone?: string
  role?: string
  status?: "active" | "pending" | "inactive"
  stats?: { label: string; value: string | number }[]
  className?: string
  children?: React.ReactNode
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  avatarUrl,
  location,
  joinedDate,
  bio,
  website,
  phone,
  role,
  status = "active",
  stats,
  className = "",
  children,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "inactive":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header Banner */}
      <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-800" />
      
      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-4xl font-bold text-white">
              {getInitials(name)}
            </div>
          )}
          <div className={`
            absolute bottom-1 right-1 px-2 py-1 rounded-full text-xs font-medium
            ${getStatusColor(status)}
          `}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>

        {/* Name and Role */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">{name}</h2>
          {role && (
            <p className="text-slate-600 font-medium">{role}</p>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-slate-600 mb-4 line-clamp-3">{bio}</p>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{email}</span>
          </div>
          {location && (location.city || location.country) && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>
                {[location.city, location.country].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
          {joinedDate && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Joined {formatDate(joinedDate)}</span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Globe className="w-4 h-4 text-slate-400" />
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                {website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{phone}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Additional Content */}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )
}

export default ProfileCard
