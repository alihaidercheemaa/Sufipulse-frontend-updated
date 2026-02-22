"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Grid, List, Search, Filter, Eye, MessageCircle, Share2, Heart, PenTool, Plus } from "lucide-react"
import { getMyBlogSubmissions, getMyBlogComments } from "@/services/blogger"
import { BlogCard, EngagementMetrics, EmptyState, LoadingState, Alert } from "@/components/ui"

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

interface Comment {
  id: number
  blog_id: number
  commenter_name: string
  commenter_email: string
  comment_text: string
  is_approved: boolean
  created_at: string
}

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState<BlogSubmission[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [blogsResponse, commentsResponse] = await Promise.all([
        getMyBlogSubmissions(),
        getMyBlogComments(),
      ])

      if (blogsResponse.status === 200) {
        setBlogs(blogsResponse.data.blogs || [])
      }

      if (commentsResponse.status === 200) {
        setComments(commentsResponse.data.comments || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: blogs.length,
      published: 0,
      pending: 0,
      revision: 0,
    }

    blogs.forEach((blog) => {
      if (blog.status === "posted" || blog.status === "approved" || blog.status === "published") {
        counts.published++
      } else if (blog.status === "pending" || blog.status === "review" || blog.status === "under_review") {
        counts.pending++
      } else if (blog.status === "revision" || blog.status === "changes_requested") {
        counts.revision++
      }
    })

    return counts
  }

  const getTotalEngagement = () => {
    return blogs.reduce(
      (acc, blog) => ({
        views: acc.views + (blog.view_count || 0),
        comments: acc.comments + (blog.comment_count || 0),
        likes: acc.likes + (blog.like_count || 0),
      }),
      { views: 0, comments: 0, likes: 0 }
    )
  }

  const statusCounts = getStatusCounts()
  const totalEngagement = getTotalEngagement()

  if (loading) {
    return <LoadingState message="Loading your blogs..." size="lg" />
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
                  <BookOpen className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">My Blogs</h1>
              </div>
              <p className="text-emerald-100 text-sm sm:text-base">
                Manage and track your blog posts
              </p>
            </div>
            <Link
              href="/blogger/write"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Write New Blog
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{statusCounts.all}</p>
                <p className="text-xs text-slate-500">Total Blogs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalEngagement.views.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Total Views</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalEngagement.likes.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Total Likes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalEngagement.comments.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Total Comments</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Share2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{comments.length}</p>
                <p className="text-xs text-slate-500">Recent Comments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="posted">Published ({statusCounts.published})</option>
                <option value="pending">Pending ({statusCounts.pending})</option>
                <option value="revision">Revision ({statusCounts.revision})</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow text-emerald-600" : "text-slate-500 hover:text-slate-700"}`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow text-emerald-600" : "text-slate-500 hover:text-slate-700"}`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Blogs Grid/List */}
        {filteredBlogs.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredBlogs.map((blog) => (
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
                layout={viewMode}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="w-16 h-16" />}
            title="No blogs found"
            description={searchQuery ? "Try adjusting your search or filters" : "Start by writing your first blog post"}
            action={
              <Link
                href="/blogger/write"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <PenTool className="w-5 h-5" />
                Write Your First Blog
              </Link>
            }
          />
        )}

        {/* Recent Comments Section */}
        {comments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                Recent Comments
              </h2>
              <button
                onClick={() => setShowComments(!showComments)}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {showComments ? "Hide" : "View All"}
              </button>
            </div>
            {showComments && (
              <div className="space-y-3">
                {comments.slice(0, 5).map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{comment.commenter_name}</p>
                        <p className="text-sm text-slate-500">{comment.commenter_email}</p>
                        <p className="text-sm text-slate-700 mt-2 line-clamp-2">{comment.comment_text}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${comment.is_approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {comment.is_approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
