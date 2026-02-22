"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Plus, Search, Clock, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react"
import { getMyBlogSubmissions } from "@/services/blogger"
import { EmptyState, LoadingState, StatusBadge } from "@/components/ui"

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
}

export default function ScheduledPostsPage() {
  const [blogs, setBlogs] = useState<BlogSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchScheduledPosts()
  }, [])

  const fetchScheduledPosts = async () => {
    try {
      const response = await getMyBlogSubmissions()
      if (response.status === 200) {
        const allBlogs: BlogSubmission[] = response.data.blogs || []
        const scheduled = allBlogs.filter(
          (b) => b.scheduled_publish_date !== null && b.scheduled_publish_date !== ""
        )
        setBlogs(scheduled)
      }
    } catch (error) {
      console.error("Error fetching scheduled posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString).getTime() > Date.now()
  }

  const getTimeUntil = (dateString: string) => {
    const diff = new Date(dateString).getTime() - Date.now()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `In ${days} day${days > 1 ? "s" : ""}`
    if (hours > 0) return `In ${hours} hour${hours > 1 ? "s" : ""}`
    return "Soon"
  }

  if (loading) {
    return <LoadingState message="Loading scheduled posts..." size="lg" />
  }

  const upcoming = blogs.filter((b) => b.scheduled_publish_date && isUpcoming(b.scheduled_publish_date))
  const past = blogs.filter((b) => b.scheduled_publish_date && !isUpcoming(b.scheduled_publish_date))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Scheduled Posts</h1>
              </div>
              <p className="text-blue-100 text-sm sm:text-base">
                Blog posts scheduled for future publication
              </p>
            </div>
            <Link
              href="/blogger/write"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Write New Blog
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{blogs.length}</p>
                <p className="text-xs text-slate-500">Total Scheduled</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{upcoming.length}</p>
                <p className="text-xs text-slate-500">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{past.length}</p>
                <p className="text-xs text-slate-500">Published</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search scheduled posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Upcoming Posts */}
        {upcoming.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Upcoming Posts
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredBlogs.filter((b) => upcoming.includes(b)).map((blog) => (
                <div
                  key={blog.id}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                          {blog.title}
                        </h3>
                        <StatusBadge status="scheduled" />
                      </div>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(blog.scheduled_publish_date!)}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Clock className="w-4 h-4" />
                          {getTimeUntil(blog.scheduled_publish_date!)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          {blog.language}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blogger/blog/${blog.id}`}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="View"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Scheduled Posts */}
        {past.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-slate-600" />
                Published Posts
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {past.map((blog) => (
                <div
                  key={blog.id}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                          {blog.title}
                        </h3>
                        <StatusBadge status="posted" />
                      </div>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Was scheduled: {formatDate(blog.scheduled_publish_date!)}
                        </span>
                        {blog.published_at && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                            Published: {formatDate(blog.published_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blogger/blog/${blog.id}`}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="View"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {blogs.length === 0 && (
          <EmptyState
            icon={<Calendar className="w-16 h-16" />}
            title={searchQuery ? "No scheduled posts found" : "No scheduled posts"}
            description={
              searchQuery
                ? "Try adjusting your search"
                : "Schedule blog posts for automatic publication at a future date"
            }
            action={
              !searchQuery && (
                <Link
                  href="/blogger/write"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Write and Schedule
                </Link>
              )
            }
          />
        )}
      </div>
    </div>
  )
}
