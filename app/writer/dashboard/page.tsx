"use client"

import { useEffect, useState } from "react"
import {
  PenTool,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  FileText,
  Zap,
  Calendar,
  BarChart3,
  MapPin,
  Globe,
  Award,
  Bell,
  ChevronRight,
  Sparkles,
  Target,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { getKalamsByWriter } from "@/services/writer"
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

interface DashboardStats {
  totalKalams: number
  pendingReview: number
  approved: number
  published: number
}

export default function WriterDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalKalams: 0,
    pendingReview: 0,
    approved: 0,
    published: 0,
  })
  const [recentKalams, setRecentKalams] = useState<KalamWithSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getKalamsByWriter()
        if (response.status === 200) {
          const kalams: KalamWithSubmission[] = response.data.kalams || []
          setRecentKalams(kalams.slice(0, 5))

          const total = kalams.length
          const pending = kalams.filter(
            (k) => k.submission?.status === "pending" || k.submission?.status === "under_review"
          ).length
          const approved = kalams.filter(
            (k) =>
              k.submission?.status === "admin_approved" ||
              k.submission?.status === "final_approved" ||
              k.submission?.status === "complete_approved"
          ).length
          const published = kalams.filter((k) => k.kalam.published_at !== null).length

          setStats({
            totalKalams: total,
            pendingReview: pending,
            approved: approved,
            published: published,
          })
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingState message="Loading Your Sacred Dashboard..." size="lg" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "under_review":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "admin_approved":
      case "final_approved":
      case "complete_approved":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "admin_rejected":
        return "text-red-700 bg-red-50 border-red-200"
      case "changes_requested":
        return "text-orange-700 bg-orange-50 border-orange-200"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <PenTool className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Writer Dashboard</h1>
              </div>
              <p className="text-emerald-100 text-sm sm:text-base">
                Manage your sacred poetry and track submissions
              </p>
            </div>
            <Link
              href="/writer/submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              <PenTool className="w-5 h-5" />
              Submit New Kalam
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <DataGrid columns={4}>
          <MetricCard
            title="Total Kalams"
            value={stats.totalKalams}
            icon={<FileText className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            description="All your submissions"
          />
          <MetricCard
            title="Pending Review"
            value={stats.pendingReview}
            icon={<Clock className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-amber-500 to-amber-700"
            description="Awaiting approval"
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
            color="bg-gradient-to-br from-purple-500 to-purple-700"
            description="Live on platform"
          />
        </DataGrid>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Kalams - Takes 2 columns */}
          <DashboardCard
            title="Recent Kalams"
            description="Your latest sacred poetry submissions"
            icon={<BookOpen className="w-5 h-5 text-white" />}
            hover={false}
            className="lg:col-span-2"
            action={
              <Link href="/writer/kalams" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            }
          >
            {recentKalams.length > 0 ? (
              <div className="space-y-3">
                {recentKalams.map((item) => (
                  <Link
                    key={item.kalam.id}
                    href={`/writer/kalams/${item.kalam.id}`}
                    className="block p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-all border border-slate-100 hover:border-emerald-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{item.kalam.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {item.kalam.language}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Target className="w-3 h-3" /> {item.kalam.theme}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(item.kalam.created_at)}
                          </span>
                        </div>
                      </div>
                      {item.submission && (
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium border whitespace-nowrap ${getStatusColor(item.submission.status)}`}
                        >
                          {formatStatus(item.submission.status)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BookOpen className="w-10 h-10" />}
                title="No Kalams Yet"
                description="Start your sacred journey by submitting your first poetry"
                action={
                  <Link
                    href="/writer/submit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    <PenTool className="w-4 h-4" />
                    Submit Kalam
                  </Link>
                }
              />
            )}
          </DashboardCard>

          {/* Status Overview */}
          <DashboardCard title="Status Overview" icon={<BarChart3 className="w-5 h-5 text-white" />} hover={false}>
            <div className="space-y-4">
              <StatusCard
                status="pending"
                title="Pending Review"
                count={stats.pendingReview}
                icon={<Clock className="w-5 h-5 text-slate-600" />}
                description="Awaiting admin approval"
              />
              <StatusCard
                status="success"
                title="Approved"
                count={stats.approved}
                icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
                description="Ready for vocalist assignment"
              />
              <StatusCard
                status="info"
                title="Published"
                count={stats.published}
                icon={<Eye className="w-5 h-5 text-blue-600" />}
                description="Live on the platform"
              />
            </div>

            {/* Progress Ring */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * stats.approved) / Math.max(stats.totalKalams, 1)}
                      className="text-emerald-500 transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-900">
                      {stats.totalKalams > 0 ? Math.round((stats.approved / stats.totalKalams) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-2">Approval Rate</p>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions" icon={<Zap className="w-5 h-5 text-white" />} hover={false}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/writer/submit"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:shadow-md transition-all group"
            >
              <PenTool className="w-8 h-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Submit Kalam</span>
            </Link>
            <Link
              href="/writer/kalams"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all group"
            >
              <BookOpen className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">My Kalams</span>
            </Link>
            <Link
              href="/writer/profile"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all group"
            >
              <Award className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Profile</span>
            </Link>
            <Link
              href="/writer/blog"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:shadow-md transition-all group"
            >
              <FileText className="w-8 h-8 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Blogs</span>
            </Link>
            <Link
              href="/writer/notification"
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

        {/* Writing Tips */}
        <DashboardCard
          title="Writing Tips"
          description="Guidelines for submitting your sacred poetry"
          icon={<Sparkles className="w-5 h-5 text-white" />}
          hover={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-emerald-700" />
              </div>
              <h4 className="font-semibold text-emerald-800 mb-2">Authentic Voice</h4>
              <p className="text-sm text-emerald-700">
                Write from the heart with genuine spiritual expression
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-blue-700" />
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Musical Flow</h4>
              <p className="text-sm text-blue-700">
                Consider rhythm and flow for vocal adaptation
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center mb-3">
                <Globe className="w-5 h-5 text-purple-700" />
              </div>
              <h4 className="font-semibold text-purple-800 mb-2">Universal Themes</h4>
              <p className="text-sm text-purple-700">
                Explore themes of love, unity, and spiritual journey
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-100">
              <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-amber-700" />
              </div>
              <h4 className="font-semibold text-amber-800 mb-2">Clarity</h4>
              <p className="text-sm text-amber-700">
                Ensure your message is clear and accessible
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
