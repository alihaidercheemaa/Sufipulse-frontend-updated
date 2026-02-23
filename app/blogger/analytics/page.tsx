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

interface BlogWithDailyStats extends BlogSubmission {
  dailyViews?: number
  dailyLikes?: number
  dailyComments?: number
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
        const blogsData: BlogSubmission[] = response.data.blogs || []
        setBlogs(blogsData)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics from real blog data
  const metrics = {
    totalViews: blogs.reduce((sum, b) => sum + (b.view_count || 0), 0),
    totalLikes: blogs.reduce((sum, b) => sum + (b.like_count || 0), 0),
    totalComments: blogs.reduce((sum, b) => sum + (b.comment_count || 0), 0),
    publishedBlogs: blogs.filter((b) => b.published_at).length,
  }

  // Generate daily stats from real blog data (distribute total views across days since publication)
  const dailyData: DailyStats[] = (() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 15 : 30
    const now = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Initialize daily accumulators
    const dailyAccum: Record<string, { views: number; likes: number; comments: number }> = {}
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      dailyAccum[dateKey] = { views: 0, likes: 0, comments: 0 }
    }

    // If no blogs, return empty data structure for charts
    if (blogs.length === 0) {
      return Object.entries(dailyAccum).map(([date, stats]) => ({
        date,
        views: 0,
        likes: 0,
        comments: 0,
      }))
    }

    // Distribute each blog's views across days since publication
    blogs.forEach((blog) => {
      // Use created_at as fallback if published_at is not available
      const publishDate = blog.published_at || blog.created_at
      const views = blog.view_count || 0
      const likes = blog.like_count || 0
      const comments = blog.comment_count || 0

      if (!publishDate) return

      const blogDate = new Date(publishDate)
      const daysSincePublication = Math.floor((now.getTime() - blogDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSincePublication <= 0) {
        // Published today - all views today
        const todayKey = now.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        if (dailyAccum[todayKey]) {
          dailyAccum[todayKey].views += views
          dailyAccum[todayKey].likes += likes
          dailyAccum[todayKey].comments += comments
        }
      } else {
        // Distribute views across days (exponential decay - more recent days get more views)
        const dailyViewsRate = views / daysSincePublication
        const dailyLikesRate = likes / daysSincePublication
        const dailyCommentsRate = comments / daysSincePublication

        for (let i = 0; i < Math.min(daysSincePublication, days); i++) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          const dateKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

          if (dailyAccum[dateKey]) {
            // Exponential decay factor (more recent = higher)
            const decayFactor = 1 / (i + 1)
            dailyAccum[dateKey].views += Math.round(dailyViewsRate * decayFactor)
            dailyAccum[dateKey].likes += Math.round(dailyLikesRate * decayFactor)
            dailyAccum[dateKey].comments += Math.round(dailyCommentsRate * decayFactor)
          }
        }
      }
    })

    // Convert to array format for charts
    return Object.entries(dailyAccum).map(([date, stats]) => ({
      date,
      views: stats.views,
      likes: stats.likes,
      comments: stats.comments,
    }))
  })()

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

  // Calculate trends by comparing first half vs second half of time range
  const calculateTrend = (metric: 'views' | 'likes' | 'comments') => {
    const midpoint = Math.floor(dailyData.length / 2)
    const firstHalf = dailyData.slice(0, midpoint)
    const secondHalf = dailyData.slice(midpoint)

    const firstHalfSum = firstHalf.reduce((sum, d) => sum + d[metric], 0)
    const secondHalfSum = secondHalf.reduce((sum, d) => sum + d[metric], 0)

    if (firstHalfSum === 0) return { value: secondHalfSum > 0 ? 100 : 0, direction: secondHalfSum > 0 ? 'up' as 'up' | 'down' : 'down' as 'up' | 'down' }

    const percentChange = ((secondHalfSum - firstHalfSum) / firstHalfSum) * 100
    return {
      value: Math.abs(Math.round(percentChange)),
      direction: percentChange >= 0 ? 'up' as 'up' | 'down' : 'down' as 'up' | 'down'
    }
  }

  const viewsTrend = calculateTrend('views')
  const likesTrend = calculateTrend('likes')
  const commentsTrend = calculateTrend('comments')

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
            trend={viewsTrend}
          />
          <MetricCard
            title="Total Likes"
            value={metrics.totalLikes.toLocaleString()}
            icon={<Heart className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-pink-500 to-pink-700"
            trend={likesTrend}
          />
          <MetricCard
            title="Total Comments"
            value={metrics.totalComments.toLocaleString()}
            icon={<MessageCircle className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-purple-700"
            trend={commentsTrend}
          />
          <MetricCard
            title="Published Blogs"
            value={metrics.publishedBlogs}
            icon={<TrendingUp className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-emerald-500 to-emerald-700"
            trend={{ value: 0, direction: 'up' as const }}
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
          {blogs.length > 0 ? (
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
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No blogs available to show language distribution</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
