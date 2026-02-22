"use client"

import { useEffect, useState } from "react"
import {
  Mic,
  Music,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  Building2,
  Zap,
  Calendar,
  BarChart3,
  Wifi,
  Play,
  Heart,
  Award,
  Bell,
  ChevronRight,
  Sparkles,
  Globe,
  Target,
} from "lucide-react"
import Link from "next/link"
import { getKalamsByVocalist } from "@/services/vocalist"
import {
  getStudioVisitRequestsByVocalist,
  getRemoteRecordingRequestsByVocalist,
} from "@/services/requests"
import {
  MetricCard,
  DashboardCard,
  DataGrid,
  StatusCard,
  EmptyState,
  LoadingState,
  ContentCard,
  StatBox,
  Alert,
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
  vocalist_id: number
  published_at: string | null
  created_at: string
  updated_at: string
  vocalist_approval_status: string
  status: string
}

interface RecordingRequest {
  id: number
  kalam_id: number
  vocalist_id: number
  status: string
  created_at: string
  preferred_date?: string
  preferred_time?: string
}

interface DashboardStats {
  totalCollaborations: number
  pendingApproval: number
  approved: number
  published: number
  studioRequests: number
  remoteRequests: number
}

export default function VocalistDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCollaborations: 0,
    pendingApproval: 0,
    approved: 0,
    published: 0,
    studioRequests: 0,
    remoteRequests: 0,
  })
  const [recentKalams, setRecentKalams] = useState<Kalam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kalamsRes, studioRes, remoteRes] = await Promise.all([
          getKalamsByVocalist(),
          getStudioVisitRequestsByVocalist(),
          getRemoteRecordingRequestsByVocalist(),
        ])

        const kalams: Kalam[] = kalamsRes.data.kalams || []
        const studioRequests: RecordingRequest[] = studioRes.data || []
        const remoteRequests: RecordingRequest[] = remoteRes.data || []

        setRecentKalams(kalams.slice(0, 5))

        const total = kalams.length
        const pending = kalams.filter((k) => k.vocalist_approval_status === "pending").length
        const approved = kalams.filter(
          (k) => k.vocalist_approval_status === "approved" || k.vocalist_approval_status === "accepted"
        ).length
        const published = kalams.filter((k) => k.status === "posted" || k.published_at !== null).length

        setStats({
          totalCollaborations: total,
          pendingApproval: pending,
          approved: approved,
          published: published,
          studioRequests: studioRequests.length,
          remoteRequests: remoteRequests.length,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingState message="Loading Your Vocalist Dashboard..." size="lg" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "approved":
      case "accepted":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200"
      case "posted":
        return "text-blue-700 bg-blue-50 border-blue-200"
      default:
        return "text-slate-700 bg-slate-50 border-slate-200"
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Mic className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Vocalist Dashboard</h1>
              </div>
              <p className="text-purple-100 text-sm sm:text-base">
                Manage your sacred vocal collaborations
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <DataGrid columns={4}>
          <MetricCard
            title="Total Collaborations"
            value={stats.totalCollaborations}
            icon={<Mic className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-purple-700"
            description="All your projects"
          />
          <MetricCard
            title="Pending Approval"
            value={stats.pendingApproval}
            icon={<Clock className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-amber-500 to-amber-700"
            description="Awaiting your review"
          />
          <MetricCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircle className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-emerald-500 to-emerald-700"
            description="Ready for recording"
          />
          <MetricCard
            title="Published"
            value={stats.published}
            icon={<Eye className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            description="Live on platform"
          />
        </DataGrid>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Collaborations - Takes 2 columns */}
          <DashboardCard
            title="Recent Collaborations"
            description="Your latest kalam projects"
            icon={<Music className="w-5 h-5 text-white" />}
            hover={false}
            className="lg:col-span-2"
            action={
              <Link href="/vocalist/kalam" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            }
          >
            {recentKalams.length > 0 ? (
              <div className="space-y-3">
                {recentKalams.map((kalam) => (
                  <Link
                    key={kalam.id}
                    href={`/vocalist/kalam`}
                    className="block p-4 bg-slate-50 rounded-xl hover:bg-purple-50 transition-all border border-slate-100 hover:border-purple-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{kalam.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {kalam.language}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Target className="w-3 h-3" /> {kalam.theme}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(kalam.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium border whitespace-nowrap ${getStatusColor(kalam.vocalist_approval_status)}`}
                        >
                          {formatStatus(kalam.vocalist_approval_status)}
                        </span>
                        {kalam.status === "posted" && kalam.youtube_link && (
                          <a
                            href={kalam.youtube_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Play className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Music className="w-10 h-10" />}
                title="No Collaborations Yet"
                description="Browse kalams to start your sacred vocal journey"
                action={
                  <Link
                    href="/vocalist/kalam"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Music className="w-4 h-4" />
                    Browse Kalams
                  </Link>
                }
              />
            )}
          </DashboardCard>

          {/* Recording Requests */}
          <DashboardCard
            title="Recording Requests"
            description="Your session bookings"
            icon={<Building2 className="w-5 h-5 text-white" />}
            hover={false}
          >
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <Building2 className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-900">{stats.studioRequests}</p>
                      <p className="text-sm text-blue-700">Studio Requests</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-200 rounded-lg">
                      <Wifi className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-900">{stats.remoteRequests}</p>
                      <p className="text-sm text-emerald-700">Remote Requests</p>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/vocalist/recording-requests/studio"
                className="block w-full py-2.5 px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-center text-sm font-medium transition-colors"
              >
                Manage Requests →
              </Link>
            </div>
          </DashboardCard>
        </div>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions" icon={<Zap className="w-5 h-5 text-white" />} hover={false}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/vocalist/kalam"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all group"
            >
              <Music className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Browse Kalams</span>
            </Link>
            <Link
              href="/vocalist/recording-requests/studio"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all group"
            >
              <Building2 className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Studio Requests</span>
            </Link>
            <Link
              href="/vocalist/recording-requests/remote"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:shadow-md transition-all group"
            >
              <Wifi className="w-8 h-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Remote Requests</span>
            </Link>
            <Link
              href="/vocalist/profile"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:shadow-md transition-all group"
            >
              <Award className="w-8 h-8 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Profile</span>
            </Link>
            <Link
              href="/vocalist/notification"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-md transition-all group"
            >
              <Bell className="w-8 h-8 text-pink-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Notifications</span>
            </Link>
            <Link
              href="/gallery"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl hover:shadow-md transition-all group"
            >
              <Eye className="w-8 h-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Gallery</span>
            </Link>
          </div>
        </DashboardCard>

        {/* Vocal Tips */}
        <DashboardCard
          title="Vocal Tips"
          description="Guidelines for sacred vocal expression"
          icon={<Sparkles className="w-5 h-5 text-white" />}
          hover={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-purple-700" />
              </div>
              <h4 className="font-semibold text-purple-800 mb-2">Authentic Expression</h4>
              <p className="text-sm text-purple-700">
                Connect deeply with the spiritual meaning of each kalam
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center mb-3">
                <Mic className="w-5 h-5 text-blue-700" />
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Technical Quality</h4>
              <p className="text-sm text-blue-700">
                Ensure clear audio quality for recording sessions
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center mb-3">
                <Music className="w-5 h-5 text-emerald-700" />
              </div>
              <h4 className="font-semibold text-emerald-800 mb-2">Style Adaptation</h4>
              <p className="text-sm text-emerald-700">
                Respect traditional styles while adding your voice
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-100">
              <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-amber-700" />
              </div>
              <h4 className="font-semibold text-amber-800 mb-2">Emotional Connection</h4>
              <p className="text-sm text-amber-700">
                Convey the divine love and longing in each verse
              </p>
            </div>
          </div>
        </DashboardCard>

        {/* Platform Overview */}
        <DashboardCard
          title="Your Sacred Journey"
          description="Track your impact on the global community"
          icon={<Heart className="w-5 h-5 text-white" />}
          hover={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100">
              <Mic className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-purple-800">{stats.totalCollaborations}</p>
              <p className="text-sm text-purple-600 mt-1">Total Collaborations</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
              <Eye className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-blue-800">{stats.published}</p>
              <p className="text-sm text-blue-600 mt-1">Published Works</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-emerald-800">{stats.approved}</p>
              <p className="text-sm text-emerald-600 mt-1">In Progress</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
