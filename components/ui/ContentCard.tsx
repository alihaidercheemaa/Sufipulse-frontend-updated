"use client"

import React from "react"
import { BookOpen, Calendar, Clock, Eye, Edit, Trash2, ExternalLink } from "lucide-react"

export interface ContentCardProps {
  id?: number
  title: string
  excerpt?: string
  content?: string
  status?: "draft" | "pending" | "review" | "approved" | "published" | "rejected" | "revision"
  category?: string
  tags?: string[]
  language?: string
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  author?: string
  imageUrl?: string
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  className?: string
  children?: React.ReactNode
}

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  title,
  excerpt,
  content,
  status = "draft",
  category,
  tags,
  language,
  createdAt,
  updatedAt,
  publishedAt,
  author,
  imageUrl,
  onView,
  onEdit,
  onDelete,
  className = "",
  children,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "pending":
      case "review":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "draft":
        return "bg-slate-100 text-slate-700 border-slate-200"
      case "revision":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 ${className}`}>
      {/* Image */}
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {title}
            </h3>
            {(category || language) && (
              <div className="flex items-center gap-2 mt-1">
                {category && (
                  <span className="text-xs text-slate-500">{category}</span>
                )}
                {category && language && (
                  <span className="text-slate-300">•</span>
                )}
                {language && (
                  <span className="text-xs text-slate-500">{language}</span>
                )}
              </div>
            )}
          </div>
          {status && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
            </span>
          )}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="px-2 py-0.5 text-slate-400 text-xs">
                +{tags.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          {author && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{author}</span>
            </div>
          )}
          {publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published {formatDate(publishedAt)}</span>
            </div>
          )}
          {updatedAt && !publishedAt && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated {formatDate(updatedAt)}</span>
            </div>
          )}
          {createdAt && !updatedAt && !publishedAt && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Created {formatDate(createdAt)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {(onView || onEdit || onDelete) && (
          <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
            {onView && (
              <button
                onClick={onView}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}

        {/* Additional Content */}
        {children && <div className="mt-4 pt-4 border-t border-slate-100">{children}</div>}
      </div>
    </div>
  )
}

export default ContentCard
