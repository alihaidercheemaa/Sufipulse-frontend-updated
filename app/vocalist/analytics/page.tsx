"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  TrendingUp,
  Mic,
  Play,
  Eye,
  Heart,
  Building2,
  Wifi,
  ArrowUpRight,
  Download,
  Calendar,
} from "lucide-react"
import { getKalamsByVocalist } from "@/services/vocalist"
import { getStudioVisitRequestsByVocalist, getRemoteRecordingRequestsByVocalist } from "@/services/requests"
import { AnalyticsChart, PieChartWidget, MetricCard, DataGrid, LoadingState } from "@/components/ui"

interface Kalam {
  id: number
  title: string
  language: string
  theme: string
  youtube_link: string | null
  published_at: string | null
  created_at: string
  vocalist_approval_status: string
  status: string
}

interface RecordingRequest {
  id: number
  status: string
  created_at: string
}

export default function VocalistAnalyticsPage() {
  const [kalams, setKalams] = useState<Kalam[]>([])
  const [studioRequests, setStudioRequests] = useState<RecordingRequest[]>([])
  const [remoteRequests, setRemoteRequests] = useState<RecordingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "all">("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const [kalamsRes, studioRes, remoteRes] = await Promise.all([
        getKalamsByVocalist(),
        getStudioVisitRequestsByVocalist(),
        getRemoteRecordingRequestsByVocalist(),
      ])

      setKalams(kalamsRes.data.kalams || [])
      setStudioRequests(studioRes.data || [])
      setRemoteRequests(remoteRes.data || [])
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics
  const metrics = {
    totalCollaborations: kalams.length,
    published: kalams.filter((k) => k.status === "posted" && k.youtube_link).length,
    studioRequests: studioRequests.length,
    remoteRequests: remoteRequests.length,
    inProgress: kalams.filter(
      (k) => k.vocalist_approval_status === "approved" || k.vocalist_approval_status === "accepted"
    ).length,
  }

  // Generate mock trend data
  const trendData = Array.from({ length: timeRange === "30d" ? 15 : 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (timeRange === "30d" ? 30 : 90) + i)
    return {
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.floor(Math.random() * 5) + 1,
    }
  })

  // Recording type distribution
  const typeData = [
    { label: "Studio", value: studioRequests.length },
    { label: "Remote", value: remoteRequests.length },
  ]

  // Language distribution
  const languageData = Object.entries(
    kalams.reduce((acc, kalam) => {
      acc[kalam.language] = (acc[kalam.language] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([label, value]) => ({ label, value }))

  // Theme distribution
  const themeData = Object.entries(
    kalams.reduce((acc, kalam) => {
      acc[kalam.theme] = (acc[kalam.theme] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([label, value]) => ({ label, value }))

  if (loading) {
    return <LoadingState message="Loading analytics..." size="lg" />
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
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Recording Analytics</h1>
              </div>
              <p className="text-purple-100 text-sm sm:text-base">
                Track your vocal collaborations and performance
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
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium">
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
            title="Total Collaborations"
            value={metrics.totalCollaborations}
            icon={<Mic className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-purple-700"
          />
          <MetricCard
            title="Published Works"
            value={metrics.published}
            icon={<Play className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-pink-500 to-pink-700"
            trend={{ value: metrics.published > 0 ? 25 : 0, direction: "up" }}
          />
          <MetricCard
            title="Studio Requests"
            value={metrics.studioRequests}
            icon={<Building2 className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
          />
          <MetricCard
            title="Remote Requests"
            value={metrics.remoteRequests}
            icon={<Wifi className="w-7 h-7 text-white" />}
            color="bg-gradient-to-br from-emerald-500 to-emerald-700"
          />
        </DataGrid>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collaborations Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <AnalyticsChart
              title="Collaborations Trend"
              description="Recording sessions over time"
              data={trendData}
              type="area"
              color="#8b5cf6"
              height={250}
            />
          </div>

          {/* Recording Type Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <PieChartWidget
              title="Recording Types"
              description="Studio vs Remote sessions"
              data={typeData.some((d) => d.value > 0) ? typeData : [{ label: "No Data", value: 1 }]}
              type="donut"
              size={180}
              showPercentage
            />
          </div>
        </div>

        {/* Language & Theme Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recordings by Language</h3>
            <div className="space-y-3">
              {languageData.length > 0 ? (
                languageData.map(([lang, count], i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-700 font-semibold text-sm">{count}</span>
                      </div>
                      <span className="font-medium text-slate-700">{lang}</span>
                    </div>
                    <div className="w-32 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${metrics.totalCollaborations > 0 ? (count / metrics.totalCollaborations) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">No data available</p>
              )}
            </div>
          </div>

          {/* Theme Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recordings by Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {themeData.length > 0 ? (
                themeData.map(([theme, count], i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 truncate">{theme}</p>
                    <p className="text-lg font-bold text-purple-600">{count}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8 col-span-2">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Progress Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recording Pipeline</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-slate-700">Total Kalams</div>
              <div className="flex-1 bg-slate-100 rounded-full h-8">
                <div
                  className="bg-purple-500 h-8 rounded-full flex items-center justify-end px-3 text-white text-sm font-medium"
                  style={{ width: "100%" }}
                >
                  {metrics.totalCollaborations}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-slate-700">In Progress</div>
              <div className="flex-1 bg-slate-100 rounded-full h-8">
                <div
                  className="bg-amber-500 h-8 rounded-full flex items-center justify-end px-3 text-white text-sm font-medium"
                  style={{ width: `${metrics.totalCollaborations > 0 ? (metrics.inProgress / metrics.totalCollaborations) * 100 : 0}%` }}
                >
                  {metrics.inProgress}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-slate-700">Published</div>
              <div className="flex-1 bg-slate-100 rounded-full h-8">
                <div
                  className="bg-emerald-500 h-8 rounded-full flex items-center justify-end px-3 text-white text-sm font-medium"
                  style={{ width: `${metrics.totalCollaborations > 0 ? (metrics.published / metrics.totalCollaborations) * 100 : 0}%` }}
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
