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
  Edit,
  AlertCircle,
  Sparkles,
  Target,
  Globe,
  Award,
  Bell,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { getMyBlogSubmissions } from "@/services/blogger"
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
  EngagementMetrics,
  BlogCard,
} from "@/components/ui"

interface BlogSubmission {
  id: number
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  language: string
  status: string
  editor_notes: string | null
  scheduled_publish_date: string | null
  seo_meta_title: string | null
  seo_meta_description: string | null
  featured_image_url: string | null
  created_at: string
  updated_at: string
  published_at: string | null
  blogger_id: number
  view_count?: number
  like_count?: number
  comment_count?: number
}

interface DashboardStats {
  totalBlogs: number
  published: number
  pending: number
  revision: number
  totalViews: number
  totalLikes: number
  totalComments: number
}

export default function BloggerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    published: 0,
    pending: 0,
    revision: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  })
  const [recentBlogs, setRecentBlogs] = useState<BlogSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getMyBlogSubmissions()
        if (response.status === 200) {
          const blogs: BlogSubmission[] = response.data.blogs || []
          setRecentBlogs(blogs.slice(0, 5))

          const total = blogs.length
          const published = blogs.filter(
            (b) => b.status === "posted" || b.status === "approved" || b.status === "published"
          ).length
          const pending = blogs.filter(
            (b) => b.status === "pending" || b.status === "review" || b.status === "under_review"
          ).length
          const revision = blogs.filter(
            (b) => b.status === "revision" || b.status === "changes_requested"
          ).length

          // Calculate total engagement
          const totalViews = blogs.reduce((sum, b) => sum + (b.view_count || 0), 0)
          const totalLikes = blogs.reduce((sum, b) => sum + (b.like_count || 0), 0)
          const totalComments = blogs.reduce((sum, b) => sum + (b.comment_count || 0), 0)

          setStats({
            totalBlogs: total,
            published: published,
            pending: pending,
            revision: revision,
            totalViews,
            totalLikes,
            totalComments,
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
    return <LoadingState message="Loading Your Blogger Dashboard..." size="lg" />
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
                <h1 className="text-2xl sm:text-3xl font-bold">Blogger Dashboard</h1>
              </div>
              <p className="text-emerald-100 text-sm sm:text-base">
                Create and manage your blog content
              </p>
            </div>
            <Link
              href="/blogger/write"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              <PenTool className="w-5 h-5" />
              Write New Blog
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <DataGrid columns={4}>
          <MetricCard
            title="Total Blogs"
            value={stats.totalBlogs}
            icon={<FileText className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            description="All your articles"
          />
          <MetricCard
            title="Published"
            value={stats.published}
            icon={<CheckCircle className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-emerald-500 to-emerald-700"
            description="Live on platform"
          />
          <MetricCard
            title="Pending Review"
            value={stats.pending}
            icon={<Clock className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-amber-500 to-amber-700"
            description="Awaiting approval"
          />
          <MetricCard
            title="Needs Revision"
            value={stats.revision}
            icon={<AlertCircle className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-orange-500 to-orange-700"
            description="Editor feedback"
          />
        </DataGrid>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Blogs - Takes 2 columns */}
          <DashboardCard
            title="Recent Blogs"
            description="Your latest articles"
            icon={<BookOpen className="w-5 h-5 text-white" />}
            hover={false}
            className="lg:col-span-2"
            action={
              <Link href="/blogger/my-blogs" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            }
          >
            {recentBlogs.length > 0 ? (
              <div className="space-y-3">
                {recentBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    excerpt={blog.excerpt}
                    category={blog.category}
                    language={blog.language}
                    status={blog.status}
                    tags={blog.tags}
                    featured_image_url={blog.featured_image_url}
                    created_at={blog.created_at}
                    updated_at={blog.updated_at}
                    published_at={blog.published_at}
                    view_count={blog.view_count || 0}
                    comment_count={blog.comment_count || 0}
                    like_count={blog.like_count || 0}
                    share_count={0}
                    showActions={true}
                    showMetrics={true}
                    layout="horizontal"
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BookOpen className="w-10 h-10" />}
                title="No Blogs Yet"
                description="Start sharing your thoughts by writing your first article"
                action={
                  <Link
                    href="/blogger/write"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    <PenTool className="w-4 h-4" />
                    Write Blog
                  </Link>
                }
              />
            )}
          </DashboardCard>

          {/* Status Overview */}
          <DashboardCard title="Status Overview" icon={<BarChart3 className="w-5 h-5 text-white" />} hover={false}>
            <div className="space-y-4">
              <StatusCard
                status="success"
                title="Published"
                count={stats.published}
                icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
                description="Live articles"
              />
              <StatusCard
                status="pending"
                title="Pending Review"
                count={stats.pending}
                icon={<Clock className="w-5 h-5 text-amber-600" />}
                description="Awaiting editor review"
              />
              <StatusCard
                status="warning"
                title="Needs Revision"
                count={stats.revision}
                icon={<AlertCircle className="w-5 h-5 text-orange-600" />}
                description="Editor feedback pending"
              />
            </div>

            {/* Engagement Stats */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Total Engagement</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <Eye className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-slate-900">{stats.totalViews >= 1000 ? `${(stats.totalViews / 1000).toFixed(1)}K` : stats.totalViews}</p>
                  <p className="text-xs text-slate-500">Views</p>
                </div>
                <div className="text-center p-2 bg-pink-50 rounded-lg">
                  <Heart className="w-4 h-4 text-pink-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-slate-900">{stats.totalLikes >= 1000 ? `${(stats.totalLikes / 1000).toFixed(1)}K` : stats.totalLikes}</p>
                  <p className="text-xs text-slate-500">Likes</p>
                </div>
                <div className="text-center p-2 bg-emerald-50 rounded-lg">
                  <MessageCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-slate-900">{stats.totalComments >= 1000 ? `${(stats.totalComments / 1000).toFixed(1)}K` : stats.totalComments}</p>
                  <p className="text-xs text-slate-500">Comments</p>
                </div>
              </div>
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
                      strokeDashoffset={251.2 - (251.2 * stats.published) / Math.max(stats.totalBlogs, 1)}
                      className="text-emerald-500 transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-900">
                      {stats.totalBlogs > 0 ? Math.round((stats.published / stats.totalBlogs) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-2">Publication Rate</p>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions" icon={<Zap className="w-5 h-5 text-white" />} hover={false}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/blogger/write"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:shadow-md transition-all group"
            >
              <PenTool className="w-8 h-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Write Blog</span>
            </Link>
            <Link
              href="/blogger/my-blogs"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all group"
            >
              <BookOpen className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">My Blogs</span>
            </Link>
            <Link
              href="/blogger/profile"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all group"
            >
              <Award className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Profile</span>
            </Link>
            <Link
              href="/gallery"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl hover:shadow-md transition-all group"
            >
              <Eye className="w-8 h-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Gallery</span>
            </Link>
            <Link
              href="/"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-md transition-all group"
            >
              <Heart className="w-8 h-8 text-pink-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Home</span>
            </Link>
            <Link
              href="/blogger/dashboard"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:shadow-md transition-all group"
            >
              <BarChart3 className="w-8 h-8 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-700 text-center">Dashboard</span>
            </Link>
          </div>
        </DashboardCard>

        {/* Blogging Tips */}
        <DashboardCard
          title="Blogging Tips"
          description="Guidelines for creating engaging content"
          icon={<Sparkles className="w-5 h-5 text-white" />}
          hover={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center mb-3">
                <PenTool className="w-5 h-5 text-emerald-700" />
              </div>
              <h4 className="font-semibold text-emerald-800 mb-2">Compelling Title</h4>
              <p className="text-sm text-emerald-700">
                Create titles that capture attention (max 120 chars)
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-blue-700" />
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Strong Excerpt</h4>
              <p className="text-sm text-blue-700">
                Write 150-300 word summaries for blog previews
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-100">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-purple-700" />
              </div>
              <h4 className="font-semibold text-purple-800 mb-2">SEO Tags</h4>
              <p className="text-sm text-purple-700">
                Use relevant tags for better discoverability
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-100">
              <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center mb-3">
                <Eye className="w-5 h-5 text-amber-700" />
              </div>
              <h4 className="font-semibold text-amber-800 mb-2">Featured Image</h4>
              <p className="text-sm text-amber-700">
                Add 1200×630 images for blog cards
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
