"use client"

import { useEffect, useState } from "react"
import {
  Users,
  FileText,
  Mic2,
  Music,
  Radio,
  TrendingUp,
  Activity,
  BarChart3,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Calendar,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import { getAllVocalists, getAllWriters, getAllBloggers, getAllKalams, getAllBlogSubmissions } from "@/services/admin"
import { getAllRemoteRecordingRequests, getAllStudioVisitRequests } from "@/services/requests"
import { getAllStudioRequests, getAllRemoteRequests } from "@/services/adminRecordingRequests"
import { StatCard, DataGrid, SectionHeader, SearchBar, EmptyState, LoadingState, GridCard } from "@/components/ui"

interface DashboardStats {
  totalVocalists: number
  totalWriters: number
  totalBloggers: number
  totalKalams: number
  totalBlogs: number
  totalStudioRequests: number
  totalRemoteRequests: number
  pendingStudioRequests: number
  pendingRemoteRequests: number
}

interface RecentActivity {
  id: number
  type: "vocalist" | "writer" | "blogger" | "kalam" | "blog" | "request"
  action: string
  time: string
  icon: string
}

interface RecordingRequestItem {
  id: number
  lyric_title: string
  status: string
  created_at: string
  preferred_session_date?: string
  preferred_time_block?: string
  target_submission_date?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVocalists: 0,
    totalWriters: 0,
    totalBloggers: 0,
    totalKalams: 0,
    totalBlogs: 0,
    totalStudioRequests: 0,
    totalRemoteRequests: 0,
    pendingStudioRequests: 0,
    pendingRemoteRequests: 0,
  })

  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [recordingRequests, setRecordingRequests] = useState<{ studio: RecordingRequestItem[]; remote: RecordingRequestItem[] }>({
    studio: [],
    remote: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          vocalistsRes,
          writersRes,
          bloggersRes,
          kalamsRes,
          blogsRes,
          studioRes,
          remoteRes,
          studioRecordingRes,
          remoteRecordingRes,
        ] = await Promise.all([
          getAllVocalists(),
          getAllWriters(),
          getAllBloggers(),
          getAllKalams(),
          getAllBlogSubmissions(),
          getAllStudioVisitRequests(),
          getAllRemoteRecordingRequests(),
          getAllStudioRequests(),
          getAllRemoteRequests(),
        ])

        const vocalistsCount = vocalistsRes.data?.vocalists?.length || 0
        const writersCount = writersRes.data?.writers?.length || 0
        const bloggersCount = bloggersRes.data?.bloggers?.length || 0
        const kalamsCount = kalamsRes.data?.kalams?.length || 0
        const blogsCount = blogsRes.data?.blogs?.length || 0
        const studioCount = Array.isArray(studioRes.data) ? studioRes.data.length : 0
        const remoteCount = Array.isArray(remoteRes.data) ? remoteRes.data.length : 0

        const studioRecordingRequests = studioRecordingRes.data?.requests || []
        const remoteRecordingRequests = remoteRecordingRes.data?.requests || []
        const studioRecordingCount = studioRecordingRequests.length
        const remoteRecordingCount = remoteRecordingRequests.length
        const pendingStudioCount = studioRecordingRequests.filter(
          (r: any) => r.status === "pending_review"
        ).length
        const pendingRemoteCount = remoteRecordingRequests.filter(
          (r: any) => r.status === "under_review"
        ).length

        setStats({
          totalVocalists: vocalistsCount,
          totalWriters: writersCount,
          totalBloggers: bloggersCount,
          totalKalams: kalamsCount,
          totalBlogs: blogsCount,
          totalStudioRequests: studioCount + studioRecordingCount,
          totalRemoteRequests: remoteCount + remoteRecordingCount,
          pendingStudioRequests: pendingStudioCount,
          pendingRemoteRequests: pendingRemoteCount,
        })

        setRecordingRequests({
          studio: studioRecordingRequests.slice(0, 5),
          remote: remoteRecordingRequests.slice(0, 5),
        })

        // Generate recent activity from actual data
        const activities: RecentActivity[] = []

        vocalistsRes.data?.vocalists?.slice(0, 2).forEach((v: any, i: number) => {
          activities.push({
            id: i,
            type: "vocalist",
            action: `New vocalist registered: ${v.name}`,
            time: "Recently",
            icon: "🎤",
          })
        })

        kalamsRes.data?.kalams?.slice(0, 2).forEach((k: any, i: number) => {
          activities.push({
            id: i + 10,
            type: "kalam",
            action: `New kalam submitted: ${k.title}`,
            time: "Recently",
            icon: "📝",
          })
        })

        blogsRes.data?.blogs?.slice(0, 2).forEach((b: any, i: number) => {
          if (b.status === "submitted" || b.status === "pending") {
            activities.push({
              id: i + 20,
              type: "blog",
              action: `Blog pending review: ${b.title}`,
              time: "Recently",
              icon: "📄",
            })
          }
        })

        setRecentActivity(activities.slice(0, 6))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingState message="Loading Dashboard..." size="lg" />
  }

  const statCards = [
    {
      title: "Total Vocalists",
      value: stats.totalVocalists,
      icon: <Mic2 className="w-7 h-7 text-white" />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
      link: "/admin/vocalists",
      trend: { value: 12, isPositive: true } as const,
    },
    {
      title: "Total Writers",
      value: stats.totalWriters,
      icon: <FileText className="w-7 h-7 text-white" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      link: "/admin/writers",
      trend: { value: 8, isPositive: true } as const,
    },
    {
      title: "Total Bloggers",
      value: stats.totalBloggers,
      icon: <Users className="w-7 h-7 text-white" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-700",
      link: "/admin/bloggers",
      trend: { value: 15, isPositive: true } as const,
    },
    {
      title: "Total Kalams",
      value: stats.totalKalams,
      icon: <Music className="w-7 h-7 text-white" />,
      color: "bg-gradient-to-br from-orange-500 to-orange-700",
      link: "/admin/kalams",
      trend: { value: 20, isPositive: true } as const,
    },
    {
      title: "Total Blogs",
      value: stats.totalBlogs,
      icon: <Eye className="w-7 h-7 text-white" />,
      color: "bg-gradient-to-br from-pink-500 to-pink-700",
      link: "/admin/blogs",
      trend: { value: 10, isPositive: true } as const,
    },
    {
      title: "Studio Requests",
      value: stats.totalStudioRequests,
      icon: <CheckCircle className="w-7 h-7 text-white" />,
      color: "bg-gradient-to-br from-teal-500 to-teal-700",
      link: "/admin/recording-requests/studio",
      trend: { value: 5, isPositive: false } as const,
    },
    {
      title: "Remote Requests",
      value: stats.totalRemoteRequests,
      icon: <Radio className="w-7 h-7 text-white" />,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      link: "/admin/recording-requests/remote",
      trend: { value: 18, isPositive: true } as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <SectionHeader
          title="Admin Dashboard"
          description="Overview of your platform statistics and activity"
          icon={<BarChart3 className="w-6 h-6" />}
          action={
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          }
        />

        {/* Stats Grid */}
        <DataGrid columns={4}>
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </DataGrid>

        {/* Quick Actions */}
        <GridCard hover={false} className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6" />
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <Link
              href="/admin/cms"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-all group"
            >
              <FileText className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">CMS Pages</span>
            </Link>
            <Link
              href="/admin/notifications"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-all group"
            >
              <MessageSquare className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Notifications</span>
            </Link>
            <Link
              href="/admin/blogs"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-all group"
            >
              <CheckCircle className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Review Blogs</span>
            </Link>
            <Link
              href="/admin/kalams"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-all group"
            >
              <Music className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Kalams</span>
            </Link>
            <Link
              href="/admin/partnership"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-all group"
            >
              <Users className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Partnerships</span>
            </Link>
            <Link
              href="/admin/other-admins"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center transition-all group"
            >
              <Users className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Sub Admins</span>
            </Link>
          </div>
        </GridCard>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <GridCard className="lg:col-span-1" hover={false}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              </div>
              <Link href="/admin/notifications" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xl">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{activity.action}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Activity className="w-8 h-8" />}
                  title="No Recent Activity"
                  description="Activity will appear here as users interact with the platform"
                />
              )}
            </div>
          </GridCard>

          {/* Studio Recording Requests */}
          <GridCard className="lg:col-span-2" hover={false}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                  <Mic2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Studio Recording Requests</h2>
                  <p className="text-sm text-slate-600">
                    {stats.pendingStudioRequests > 0 && (
                      <span className="text-amber-600 font-semibold">{stats.pendingStudioRequests} pending</span>
                    )}
                  </p>
                </div>
              </div>
              <Link
                href="/admin/recording-requests/studio"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recordingRequests.studio.length > 0 ? (
                recordingRequests.studio.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{request.lyric_title}</p>
                      <p className="text-xs text-slate-600">
                        {request.preferred_session_date &&
                          `${new Date(request.preferred_session_date).toLocaleDateString()}`}
                        {request.preferred_time_block && ` • ${request.preferred_time_block}`}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        request.status === "pending_review"
                          ? "bg-amber-100 text-amber-700"
                          : request.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : request.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {request.status.replace("_", " ")}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Mic2 className="w-8 h-8" />}
                  title="No Studio Requests"
                  description="Studio recording requests will appear here"
                />
              )}
            </div>
          </GridCard>
        </div>

        {/* Remote Recording Requests */}
        <GridCard hover={false}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Remote Recording Requests</h2>
                <p className="text-sm text-slate-600">
                  {stats.pendingRemoteRequests > 0 && (
                    <span className="text-amber-600 font-semibold">{stats.pendingRemoteRequests} pending</span>
                  )}
                </p>
              </div>
            </div>
            <Link
              href="/admin/recording-requests/remote"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recordingRequests.remote.length > 0 ? (
              recordingRequests.remote.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{request.lyric_title}</p>
                    <p className="text-xs text-slate-600">
                      Target:{" "}
                      {request.target_submission_date
                        ? new Date(request.target_submission_date).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      request.status === "under_review"
                        ? "bg-amber-100 text-amber-700"
                        : request.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : request.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {request.status.replace("_", " ")}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<Radio className="w-8 h-8" />}
                title="No Remote Requests"
                description="Remote recording requests will appear here"
              />
            )}
          </div>
        </GridCard>

        {/* Platform Overview Chart Placeholder */}
        <GridCard hover={false}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Platform Overview</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                <span className="text-sm text-slate-600">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-sm text-slate-600">Pending</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-200">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Chart visualization can be integrated here</p>
              <p className="text-slate-400 text-xs mt-1">Using libraries like Recharts or Chart.js</p>
            </div>
          </div>
        </GridCard>
      </div>
    </div>
  )
}
