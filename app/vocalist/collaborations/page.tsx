"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Music, Calendar, CheckCircle, Clock, TrendingUp, Search } from "lucide-react"
import { getKalamsByVocalist } from "@/services/vocalist"
import { EmptyState, LoadingState } from "@/components/ui"

interface Kalam {
  id: number
  title: string
  language: string
  theme: string
  writer_id: number
  vocalist_id: number
  published_at: string | null
  created_at: string
  vocalist_approval_status: string
  status: string
}

interface Writer {
  id: number
  name: string
}

export default function CollaborationsPage() {
  const [kalams, setKalams] = useState<Kalam[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all")

  useEffect(() => {
    fetchCollaborations()
  }, [])

  const fetchCollaborations = async () => {
    try {
      const response = await getKalamsByVocalist()
      if (response.status === 200) {
        setKalams(response.data.kalams || [])
      }
    } catch (error) {
      console.error("Error fetching collaborations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredKalams = kalams.filter((kalam) => {
    const matchesSearch = kalam.title.toLowerCase().includes(searchQuery.toLowerCase())
    const isActive = kalam.vocalist_approval_status === "approved" || kalam.vocalist_approval_status === "accepted" || kalam.vocalist_approval_status === "pending"
    const isCompleted = kalam.status === "posted" || kalam.published_at !== null
    
    if (filterStatus === "active") return matchesSearch && isActive
    if (filterStatus === "completed") return matchesSearch && isCompleted
    return matchesSearch
  })

  const stats = {
    total: kalams.length,
    active: kalams.filter((k) => 
      k.vocalist_approval_status === "approved" || 
      k.vocalist_approval_status === "accepted" || 
      k.vocalist_approval_status === "pending"
    ).length,
    completed: kalams.filter((k) => k.status === "posted" || k.published_at !== null).length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "approved":
      case "accepted":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "posted":
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
    return <LoadingState message="Loading collaborations..." size="lg" />
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
                  <Users className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Collaboration History</h1>
              </div>
              <p className="text-purple-100 text-sm sm:text-base">
                Track your collaborations with writers
              </p>
            </div>
            <Link
              href="/vocalist/kalam"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
            >
              <Music className="w-5 h-5" />
              Find New Kalams
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">Total Collaborations</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
                <p className="text-xs text-slate-500">Active Projects</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search collaborations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Collaborations ({stats.total})</option>
              <option value="active">Active ({stats.active})</option>
              <option value="completed">Completed ({stats.completed})</option>
            </select>
          </div>
        </div>

        {/* Collaborations Timeline */}
        {filteredKalams.length > 0 ? (
          <div className="space-y-4">
            {filteredKalams.map((kalam, index) => (
              <div
                key={kalam.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Music className="w-5 h-5 text-purple-600" />
                    </div>
                    {index < filteredKalams.length - 1 && (
                      <div className="w-0.5 h-full bg-slate-200 my-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{kalam.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(kalam.created_at)}
                          </span>
                          <span>•</span>
                          <span>{kalam.language}</span>
                          <span>•</span>
                          <span>{kalam.theme}</span>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium border whitespace-nowrap ${getStatusColor(kalam.vocalist_approval_status)}`}
                      >
                        {kalam.vocalist_approval_status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {kalam.description || kalam.kalam_text?.substring(0, 200)}...
                    </p>

                    <div className="flex items-center gap-4">
                      {kalam.status === "posted" && kalam.youtube_link ? (
                        <a
                          href={kalam.youtube_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          View on YouTube
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-slate-500">
                          <TrendingUp className="w-4 h-4" />
                          {kalam.vocalist_approval_status === "approved" || kalam.vocalist_approval_status === "accepted"
                            ? "In Progress"
                            : "Pending Approval"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="w-16 h-16" />}
            title={searchQuery ? "No collaborations found" : "No collaborations yet"}
            description={
              searchQuery
                ? "Try adjusting your search or filters"
                : "Start collaborating by browsing available kalams"
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
