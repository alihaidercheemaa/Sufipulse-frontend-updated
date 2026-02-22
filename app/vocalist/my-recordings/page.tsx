"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mic, Play, Calendar, CheckCircle, Clock, Building2, Wifi, Search, Filter, Music } from "lucide-react"
import { getKalamsByVocalist } from "@/services/vocalist"
import { getStudioVisitRequestsByVocalist, getRemoteRecordingRequestsByVocalist } from "@/services/requests"
import { EmptyState, LoadingState, StatusBadge } from "@/components/ui"

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
  published_at: string | null
  created_at: string
  vocalist_approval_status: string
  status: string
}

interface RecordingRequest {
  id: number
  kalam_id: number
  kalam_title?: string
  status: string
  created_at: string
  preferred_date?: string
  preferred_time?: string
  recording_environment?: string
}

export default function MyRecordingsPage() {
  const [kalams, setKalams] = useState<Kalam[]>([])
  const [studioRequests, setStudioRequests] = useState<RecordingRequest[]>([])
  const [remoteRequests, setRemoteRequests] = useState<RecordingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<"all" | "studio" | "remote" | "published">("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchRecordings()
  }, [])

  const fetchRecordings = async () => {
    try {
      const [kalamsRes, studioRes, remoteRes] = await Promise.all([
        getKalamsByVocalist().catch(() => ({ data: { kalams: [] } })),
        getStudioVisitRequestsByVocalist().catch(() => ({ data: [] })),
        getRemoteRecordingRequestsByVocalist().catch(() => ({ data: [] })),
      ])

      setKalams(kalamsRes.data.kalams || [])
      setStudioRequests(studioRes.data || [])
      setRemoteRequests(remoteRes.data || [])
    } catch (error) {
      console.error("Error fetching recordings:", error)
    } finally {
      setLoading(false)
    }
  }

  const allRecordings = [
    ...studioRequests.map((r) => ({ ...r, type: "studio" as const })),
    ...remoteRequests.map((r) => ({ ...r, type: "remote" as const })),
    ...kalams
      .filter((k) => k.status === "posted" && k.youtube_link)
      .map((k) => ({ ...k, type: "published" as const })),
  ]

  const filteredRecordings = allRecordings.filter((rec) => {
    if (filterType === "studio" && rec.type !== "studio") return false
    if (filterType === "remote" && rec.type !== "remote") return false
    if (filterType === "published" && rec.type !== "published") return false
    if (searchQuery && rec.kalam_title && !rec.kalam_title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const stats = {
    total: allRecordings.length,
    studio: studioRequests.length,
    remote: remoteRequests.length,
    published: kalams.filter((k) => k.status === "posted" && k.youtube_link).length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "pending_review":
      case "under_review":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "approved":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200"
      case "completed":
        return "text-blue-700 bg-blue-50 border-blue-200"
      default:
        return "text-slate-700 bg-slate-50 border-slate-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return <LoadingState message="Loading recordings..." size="lg" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Mic className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">My Recordings</h1>
              </div>
              <p className="text-purple-100 text-sm sm:text-base">
                Track all your recording sessions and published works
              </p>
            </div>
            <Link
              href="/vocalist/kalam"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
            >
              <Music className="w-5 h-5" />
              Browse Kalams
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mic className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">Total Recordings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.studio}</p>
                <p className="text-xs text-slate-500">Studio Sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Wifi className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.remote}</p>
                <p className="text-xs text-slate-500">Remote Sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Play className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.published}</p>
                <p className="text-xs text-slate-500">Published</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filterType === "all"
                  ? "bg-purple-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilterType("studio")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                filterType === "studio"
                  ? "bg-purple-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Studio ({stats.studio})
            </button>
            <button
              onClick={() => setFilterType("remote")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                filterType === "remote"
                  ? "bg-purple-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Wifi className="w-4 h-4" />
              Remote ({stats.remote})
            </button>
            <button
              onClick={() => setFilterType("published")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                filterType === "published"
                  ? "bg-purple-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Play className="w-4 h-4" />
              Published ({stats.published})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Recordings List */}
        {filteredRecordings.length > 0 ? (
          <div className="space-y-4">
            {filteredRecordings.map((rec: any) => (
              <div
                key={rec.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {rec.type === "studio" ? (
                          <Building2 className="w-5 h-5 text-purple-600" />
                        ) : rec.type === "remote" ? (
                          <Wifi className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Play className="w-5 h-5 text-pink-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {rec.kalam_title || rec.title || "Recording Session"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            {rec.type === "studio" ? (
                              <Building2 className="w-3 h-3" />
                            ) : rec.type === "remote" ? (
                              <Wifi className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                            {rec.type === "studio"
                              ? "Studio Session"
                              : rec.type === "remote"
                              ? "Remote Recording"
                              : "Published"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(rec.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {rec.recording_environment && (
                      <p className="text-sm text-slate-600 mb-2">
                        Environment: {rec.recording_environment}
                      </p>
                    )}
                    {rec.youtube_link && (
                      <a
                        href={rec.youtube_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <Play className="w-4 h-4" />
                        Watch on YouTube
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(rec.status)}`}
                    >
                      {rec.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Mic className="w-16 h-16" />}
            title={searchQuery ? "No recordings found" : "No recordings yet"}
            description={
              searchQuery
                ? "Try adjusting your search or filters"
                : "Start by browsing kalams and requesting recording sessions"
            }
            action={
              !searchQuery && (
                <Link
                  href="/vocalist/kalam"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <Music className="w-5 h-5" />
                  Browse Kalams
                </Link>
              )
            }
          />
        )}
      </div>
    </div>
  )
}
