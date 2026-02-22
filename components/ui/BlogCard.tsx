"use client"

import Link from "next/link"
import { Calendar, Globe, Target, Edit, Eye, MessageCircle, Share2, Heart, ChevronRight } from "lucide-react"
import EngagementMetrics from "./EngagementMetrics"

interface BlogCardProps {
  id: number
  title: string
  excerpt?: string
  category: string
  language: string
  status: string
  tags?: string[]
  featured_image_url?: string | null
  created_at: string
  updated_at: string
  published_at?: string | null
  view_count?: number
  comment_count?: number
  like_count?: number
  share_count?: number
  showActions?: boolean
  showMetrics?: boolean
  layout?: "horizontal" | "vertical"
}

/**
 * Enhanced blog card with engagement metrics
 */
export default function BlogCard({
  id,
  title,
  excerpt,
  category,
  language,
  status,
  tags = [],
  featured_image_url,
  created_at,
  view_count = 0,
  comment_count = 0,
  like_count = 0,
  share_count = 0,
  showActions = true,
  showMetrics = true,
  layout = "vertical",
}: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "review":
      case "under_review":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "approved":
      case "posted":
      case "published":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "revision":
      case "changes_requested":
        return "text-orange-700 bg-orange-50 border-orange-200"
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-slate-700 bg-slate-50 border-slate-200"
    }
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (layout === "horizontal") {
    return (
      <Link
        href={`/blogger/blog/${id}`}
        className="block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Featured Image */}
          {featured_image_url && (
            <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
              <img
                src={featured_image_url}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600"
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 hover:text-emerald-600 transition-colors">
                {title}
              </h3>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium border whitespace-nowrap ${getStatusColor(status)}`}
              >
                {formatStatus(status)}
              </span>
            </div>

            {excerpt && (
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{excerpt}</p>
            )}

            <div className="flex items-center gap-3 flex-wrap mb-3">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Target className="w-3 h-3" /> {category}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Globe className="w-3 h-3" /> {language}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatDate(created_at)}
              </span>
            </div>

            {showMetrics && (
              <EngagementMetrics
                views={view_count}
                comments={comment_count}
                likes={like_count}
                shares={share_count}
                size="sm"
                showLabels={false}
              />
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Vertical layout
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group">
      {/* Featured Image */}
      {featured_image_url && (
        <Link href={`/blogger/blog/${id}`} className="block overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img
              src={featured_image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600"
              }}
            />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusColor(status)}`}
          >
            {formatStatus(status)}
          </span>
          {showActions && (
            <Link
              href={`/blogger/write?id=${id}`}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Edit blog"
            >
              <Edit className="w-4 h-4" />
            </Link>
          )}
        </div>

        <Link href={`/blogger/blog/${id}`}>
          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
            {title}
          </h3>
        </Link>

        {excerpt && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-4">{excerpt}</p>
        )}

        <div className="flex items-center gap-3 flex-wrap mb-4">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Target className="w-3 h-3" /> {category}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Globe className="w-3 h-3" /> {language}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formatDate(created_at)}
          </span>
        </div>

        {showMetrics && (
          <div className="pt-4 border-t border-slate-100">
            <EngagementMetrics
              views={view_count}
              comments={comment_count}
              likes={like_count}
              shares={share_count}
              size="sm"
            />
          </div>
        )}

        {showActions && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href={`/blogger/blog/${id}`}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Link>
            {tags && tags.length > 0 && (
              <div className="flex gap-1">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-xs text-slate-400">+{tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
