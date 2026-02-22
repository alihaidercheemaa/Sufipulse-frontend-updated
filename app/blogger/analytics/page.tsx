"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
} from "lucide-react"
import { getMyBlogSubmissions } from "@/services/blogger"
import { AnalyticsChart, PieChartWidget, MetricCard, DataGrid, LoadingState, BlogCard } from "@/components/ui"

interface BlogSubmission {
  id: number
  title: string
  excerpt: string
  category: string
  tags: string[]
  language: string
  status: string
  created_at: string
  published_at: string | null
  view_count?: number
  like_count?: number
  comment_count?: number
}

interface DailyStats {
  date: string
  views: number
  likes: number
  comments: number
}

export default function BloggerAnalyticsPage() {
  const [blogs, setBlogs] = useState<BlogSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await getMyBlogSubmissions()
      if (response.status === 200) {
        setBlogs(response.data.blogs || [])
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics
  const metrics = {
    totalViews: blogs.reduce((sum, b) => sum + (b.view_count || 0), 0),
    totalLikes: blogs.reduce((sum, b) => sum + (b.like_count || 0), 0),
    totalComments: blogs.reduce((sum, b) => sum + (b.comment_count || 0), 0),
    publishedBlogs: blogs.filter((b) => b.published_at).length,
  }

  // Generate mock daily data for chart (in production, this would come from API)
  const dailyData: DailyStats[] = Array.from({ length: timeRange === "7d" ? 7 : timeRange === "30d" ? 15 : 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90) + i)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: Math.floor(Math.random() * 500) + 100,
      likes: Math.floor(Math.random() * 50) + 10,
      comments: Math.floor(Math.random() * 20) + 2,
    }
  })

  // Category distribution
  const categoryData = Object.entries(
    blogs.reduce((acc, blog) => {
      acc[blog.category || "Uncategorized"] = (acc[blog.category || "Uncategorized"] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([label, value]) => ({ label, value }))

  // Top performing blogs
  const topBlogs = [...blogs]
    .filter((b) => b.published_at)
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5)

  if (loading) {
    return <LoadingState message="Loading analytics..." size="lg" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Blog Analytics</h1>
              </div>
              <p className="text-emerald-100 text-sm sm:text-base">
                Track your blog performance and engagement
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="7d" className="text-slate-900">Last 7 Days</option>
                <option value="30d" className="text-slate-900">Last 30 Days</option>
                <option value="90d" className="text-slate-900">Last 90 Days</option>
                <option value="all" className="text-slate-900">All Time</option>
              </select>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Metrics */}
        <DataGrid columns={4}>
          <MetricCard
            title="Total Views"
            value={metrics.totalViews.toLocaleString()}
            icon={<Eye className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            trend={{ value: 12.5, direction: "up" }}
          />
          <MetricCard
            title="Total Likes"
            value={metrics.totalLikes.toLocaleString()}
            icon={<Heart className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-pink-500 to-pink-700"
            trend={{ value: 8.2, direction: "up" }}
          />
          <MetricCard
            title="Total Comments"
            value={metrics.totalComments.toLocaleString()}
            icon={<MessageCircle className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-purple-700"
            trend={{ value: 5.1, direction: "up" }}
          />
          <MetricCard
            title="Published Blogs"
            value={metrics.publishedBlogs}
            icon={<TrendingUp className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-emerald-500 to-emerald-700"
            trend={{ value: 2, direction: "up" }}
          />
        </DataGrid>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <AnalyticsChart
              title="Views Trend"
              description="Daily page views over time"
              data={dailyData.map((d) => ({ label: d.date, value: d.views }))}
              type="area"
              color="#3b82f6"
              height={250}
            />
          </div>

          {/* Engagement Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <AnalyticsChart
              title="Engagement Trend"
              description="Likes and comments over time"
              data={dailyData.map((d) => ({ label: d.date, value: d.likes + d.comments * 2 }))}
              type="bar"
              color="#10b981"
              height={250}
            />
          </div>
        </div>

        {/* Category Distribution & Top Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <PieChartWidget
              title="Content by Category"
              description="Distribution of blogs across categories"
              data={categoryData.length > 0 ? categoryData : [{ label: "No Data", value: 1 }]}
              type="donut"
              size={180}
              showPercentage
            />
          </div>

          {/* Top Performing Blogs */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Top Performing Blogs</h3>
              <Link
                href="/blogger/my-blogs"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {topBlogs.length > 0 ? (
                topBlogs.map((blog, i) => (
                  <div
                    key={blog.id}
                    className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 truncate">{blog.title}</h4>
                      <p className="text-sm text-slate-500">{blog.category}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Eye className="w-4 h-4" />
                        {blog.view_count?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1 text-pink-600">
                        <Heart className="w-4 h-4" />
                        {blog.like_count?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">No published blogs yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Content by Language</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {Object.entries(
              blogs.reduce((acc, blog) => {
                acc[blog.language || "Other"] = (acc[blog.language || "Other"] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            ).map(([lang, count]) => (
              <div
                key={lang}
                className="text-center p-4 bg-slate-50 rounded-xl"
              >
                <p className="text-2xl font-bold text-slate-900">{count}</p>
                <p className="text-sm text-slate-500">{lang}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
