"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  TrendingUp,
  FileText,
  CheckCircle,
  Eye,
  Heart,
  Music,
  ArrowUpRight,
  Download,
  Calendar,
} from "lucide-react"
import { getKalamsByWriter } from "@/services/writer"
import { AnalyticsChart, PieChartWidget, MetricCard, DataGrid, LoadingState } from "@/components/ui"

interface Kalam {
  id: number
  title: string
  language: string
  theme: string
  kalam_text: string
  description: string
  sufi_influence: string
  musical_preference: string
  published_at: string | null
  created_at: string
  updated_at: string
}

interface Submission {
  id: number
  kalam_id: number
  status: string
  vocalist_approval_status: string
}

interface KalamWithSubmission {
  kalam: Kalam
  submission?: Submission
}

export default function WriterAnalyticsPage() {
  const [kalams, setKalams] = useState<KalamWithSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "all">("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await getKalamsByWriter()
      if (response.status === 200) {
        setKalams(response.data.kalams || [])
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics
  const metrics = {
    totalKalams: kalams.length,
    approved: kalams.filter(
      (k) =>
        k.submission?.status === "admin_approved" ||
        k.submission?.status === "final_approved" ||
        k.submission?.status === "complete_approved"
    ).length,
    pending: kalams.filter(
      (k) => k.submission?.status === "pending" || k.submission?.status === "under_review"
    ).length,
    published: kalams.filter((k) => k.kalam.published_at !== null).length,
  }

  // Generate real trend data from kalam submissions
  const trendData = (() => {
    const days = timeRange === "30d" ? 15 : 30
    const now = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Initialize daily accumulators
    const dailyAccum: Record<string, number> = {}
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      dailyAccum[dateKey] = 0
    }

    // Count kalams submitted on each day
    kalams.forEach((item) => {
      const kalamDate = new Date(item.kalam.created_at)
      const dateKey = kalamDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      
      if (dailyAccum[dateKey] !== undefined) {
        dailyAccum[dateKey]++
      }
    })

    // Convert to array format for charts
    return Object.entries(dailyAccum).map(([date, count]) => ({
      label: date,
      value: count,
    }))
  })()

  // Theme distribution
  const themeData = Object.entries(
    kalams.reduce((acc, item) => {
      acc[item.kalam.theme] = (acc[item.kalam.theme] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([label, value]) => ({ label, value }))

  // Language distribution
  const languageData = Object.entries(
    kalams.reduce((acc, item) => {
      acc[item.kalam.language] = (acc[item.kalam.language] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  )

  // Top performing kalams
  const topKalams = [...kalams]
    .filter((k) => k.kalam.published_at)
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
                <h1 className="text-2xl sm:text-3xl font-bold">Kalam Analytics</h1>
              </div>
              <p className="text-emerald-100 text-sm sm:text-base">
                Track your poetry performance and approvals
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
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
            title="Total Kalams"
            value={metrics.totalKalams}
            icon={<FileText className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
          />
          <MetricCard
            title="Approved"
            value={metrics.approved}
            icon={<CheckCircle className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-emerald-500 to-emerald-700"
            trend={{ value: metrics.approved > 0 ? 15 : 0, direction: "up" }}
          />
          <MetricCard
            title="Pending Review"
            value={metrics.pending}
            icon={<Calendar className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-amber-500 to-amber-700"
          />
          <MetricCard
            title="Published"
            value={metrics.published}
            icon={<Eye className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-purple-700"
          />
        </DataGrid>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <AnalyticsChart
              title="Submissions Trend"
              description="Kalams submitted over time"
              data={trendData}
              type="area"
              color="#10b981"
              height={250}
            />
          </div>

          {/* Theme Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <PieChartWidget
              title="Content by Theme"
              description="Distribution across spiritual themes"
              data={themeData.length > 0 ? themeData : [{ label: "No Data", value: 1 }]}
              type="donut"
              size={180}
              showPercentage
            />
          </div>
        </div>

        {/* Language & Top Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Content by Language</h3>
            <div className="space-y-3">
              {languageData.length > 0 ? (
                languageData.map(([lang, count], i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold text-sm">{count}</span>
                      </div>
                      <span className="font-medium text-slate-700">{lang}</span>
                    </div>
                    <div className="w-32 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${(count / metrics.totalKalams) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">No data available</p>
              )}
            </div>
          </div>

          {/* Published Kalams */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Published Kalams</h3>
              <Link
                href="/writer/kalams"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {topKalams.length > 0 ? (
                topKalams.map((item, i) => (
                  <div
                    key={item.kalam.id}
                    className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 truncate">{item.kalam.title}</h4>
                      <p className="text-sm text-slate-500">{item.kalam.language} • {item.kalam.theme}</p>
                    </div>
                    <Music className="w-4 h-4 text-slate-400" />
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">No published kalams yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Approval Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Approval Funnel</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-slate-700">Total Submitted</div>
              <div className="flex-1 bg-slate-100 rounded-full h-8">
                <div
                  className="bg-blue-500 h-8 rounded-full flex items-center justify-end px-3 text-white text-sm font-medium"
                  style={{ width: "100%" }}
                >
                  {metrics.totalKalams}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-slate-700">Under Review</div>
              <div className="flex-1 bg-slate-100 rounded-full h-8">
                <div
                  className="bg-amber-500 h-8 rounded-full flex items-center justify-end px-3 text-white text-sm font-medium"
                  style={{ width: `${metrics.totalKalams > 0 ? (metrics.pending / metrics.totalKalams) * 100 : 0}%` }}
                >
                  {metrics.pending}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-slate-700">Approved</div>
              <div className="flex-1 bg-slate-100 rounded-full h-8">
                <div
                  className="bg-emerald-500 h-8 rounded-full flex items-center justify-end px-3 text-white text-sm font-medium"
                  style={{ width: `${metrics.totalKalams > 0 ? (metrics.approved / metrics.totalKalams) * 100 : 0}%` }}
                >
                  {metrics.approved}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-slate-700">Published</div>
              <div className="flex-1 bg-slate-100 rounded-full h-8">
                <div
                  className="bg-purple-500 h-8 rounded-full flex items-center justify-end px-3 text-white text-sm font-medium"
                  style={{ width: `${metrics.totalKalams > 0 ? (metrics.published / metrics.totalKalams) * 100 : 0}%` }}
                >
                  {metrics.published}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
