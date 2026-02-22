"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  PenTool,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Grid3X3,
  List,
  Globe,
  Target,
  Calendar,
  Sparkles,
} from "lucide-react"
import { getKalamsByWriter } from "@/services/writer"
import {
  ContentCard,
  EmptyState,
  LoadingState,
  StatusBadge,
  TagCloud,
} from "@/components/ui"

interface Kalam {
  id: number
  title: string
  language: string
  theme: string
  kalam_text: string
  description: string
  sufi_influence: string
  musical_preference: string
  youtube_link: string | null
  writer_id: number
  vocalist_id: number | null
  published_at: string | null
  created_at: string
  updated_at: string
}

interface Submission {
  id: number
  kalam_id: number
  status: string
  user_approval_status: string
  admin_comments: string
  writer_comments: string
  created_at: string
  updated_at: string
  vocalist_approval_status: string
}

interface KalamWithSubmission {
  kalam: Kalam
  submission?: Submission
}

type ViewMode = "grid" | "list"
type FilterStatus = "all" | "pending" | "approved" | "rejected" | "published"

export default function MyKalams() {
  const [kalams, setKalams] = useState<KalamWithSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")

  useEffect(() => {
    fetchKalams()
  }, [])

  const fetchKalams = async () => {
    try {
      const response = await getKalamsByWriter()
      if (response.status === 200) {
        setKalams(response.data.kalams || [])
      }
    } catch (error) {
      console.error("Failed to fetch kalams:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeConfig = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      pending: { color: "amber", label: "Pending" },
      under_review: { color: "amber", label: "Under Review" },
      admin_approved: { color: "emerald", label: "Admin Approved" },
      final_approved: { color: "emerald", label: "Final Approved" },
      complete_approved: { color: "emerald", label: "Complete Approved" },
      admin_rejected: { color: "red", label: "Rejected" },
      changes_requested: { color: "orange", label: "Changes Requested" },
      posted: { color: "blue", label: "Published" },
    }
    return config[status] || { color: "slate", label: status }
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const filteredKalams = kalams.filter((item) => {
    const matchesSearch =
      item.kalam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kalam.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kalam.theme.toLowerCase().includes(searchQuery.toLowerCase())

    const submissionStatus = item.submission?.status || "draft"
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && ["pending", "under_review"].includes(submissionStatus)) ||
      (filterStatus === "approved" && ["admin_approved", "final_approved", "complete_approved"].includes(submissionStatus)) ||
      (filterStatus === "rejected" && ["admin_rejected", "changes_requested"].includes(submissionStatus)) ||
      (filterStatus === "published" && item.kalam.published_at !== null)

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <LoadingState message="Loading Your Kalams..." size="lg" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">My Kalams</h1>
              <p className="text-emerald-100 text-sm">Manage and track your sacred poetry</p>
            </div>
            <Link
              href="/writer/submit"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
            >
              <PenTool className="w-4 h-4" />
              Submit New
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search kalams by title, description, or theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="appearance-none pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="published">Published</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kalams Grid/List */}
        {filteredKalams.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title={searchQuery ? "No kalams found" : "No kalams yet"}
            description={
              searchQuery
                ? "Try adjusting your search or filters"
                : "Start your sacred journey by submitting your first poetry"
            }
            action={
              !searchQuery && (
                <Link
                  href="/writer/submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <PenTool className="w-4 h-4" />
                  Submit Kalam
                </Link>
              )
            }
          />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKalams.map((item) => (
              <ContentCard
                key={item.kalam.id}
                id={item.kalam.id}
                title={item.kalam.title}
                excerpt={item.kalam.description || item.kalam.kalam_text.substring(0, 100) + "..."}
                status={item.submission?.status as any || "draft"}
                category={item.kalam.theme}
                language={item.kalam.language}
                tags={[item.kalam.sufi_influence, item.kalam.musical_preference].filter(Boolean)}
                createdAt={item.kalam.created_at}
                updatedAt={item.kalam.updated_at}
                publishedAt={item.kalam.published_at || undefined}
                onView={() => window.location.href = `/writer/kalams/${item.kalam.id}`}
                onEdit={() => window.location.href = `/writer/kalams/${item.kalam.id}/edit`}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredKalams.map((item) => (
              <div
                key={item.kalam.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 truncate">
                        {item.kalam.title}
                      </h3>
                      {item.submission && (
                        <StatusBadge
                          status={item.submission.status}
                          customConfig={{
                            [item.submission.status]: {
                              color: getStatusBadgeConfig(item.submission.status).color === "emerald"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : getStatusBadgeConfig(item.submission.status).color === "amber"
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : getStatusBadgeConfig(item.submission.status).color === "red"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : getStatusBadgeConfig(item.submission.status).color === "orange"
                                ? "bg-orange-100 text-orange-700 border-orange-200"
                                : "bg-blue-100 text-blue-700 border-blue-200",
                              label: formatStatus(item.submission.status),
                            },
                          }}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-4 flex-wrap mb-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                        <Globe className="w-4 h-4" /> {item.kalam.language}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                        <Target className="w-4 h-4" /> {item.kalam.theme}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" /> {formatDate(item.kalam.created_at)}
                      </span>
                      {item.kalam.sufi_influence && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                          <Sparkles className="w-4 h-4" /> {item.kalam.sufi_influence}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-2">
                      {item.kalam.description || item.kalam.kalam_text}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/writer/kalams/${item.kalam.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    {item.submission &&
                      !["final_approved", "complete_approved", "posted"].includes(item.submission.status) && (
                        <Link
                          href={`/writer/kalams/${item.kalam.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredKalams.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-500">
            Showing {filteredKalams.length} of {kalams.length} kalam{kalams.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  )
}
