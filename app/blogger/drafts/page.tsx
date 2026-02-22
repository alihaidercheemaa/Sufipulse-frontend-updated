"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, Plus, Search, Filter, Grid, List, Edit, Trash2, Eye, Clock } from "lucide-react"
import { getMyBlogSubmissions } from "@/services/blogger"
import { BlogCard, EmptyState, LoadingState } from "@/components/ui"

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

export default function DraftsPage() {
  const [blogs, setBlogs] = useState<BlogSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchDrafts()
  }, [])

  const fetchDrafts = async () => {
    try {
      const response = await getMyBlogSubmissions()
      if (response.status === 200) {
        const allBlogs: BlogSubmission[] = response.data.blogs || []
        const drafts = allBlogs.filter(
          (b) => b.status === "draft" || !b.status || b.status === ""
        )
        setBlogs(drafts)
      }
    } catch (error) {
      console.error("Error fetching drafts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <LoadingState message="Loading your drafts..." size="lg" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Drafts</h1>
              </div>
              <p className="text-amber-100 text-sm sm:text-base">
                Unpublished blog posts saved for later
              </p>
            </div>
            <Link
              href="/blogger/write"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl"
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
              <div className="p-2 bg-amber-100 rounded-lg">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{blogs.length}</p>
                <p className="text-xs text-slate-500">Total Drafts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Edit className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {blogs.filter((b) => new Date(b.updated_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
                </p>
                <p className="text-xs text-slate-500">Updated This Week</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {blogs.filter((b) => b.excerpt && b.excerpt.length > 100).length}
                </p>
                <p className="text-xs text-slate-500">Ready to Publish</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search drafts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-white shadow text-amber-600" : "text-slate-500 hover:text-slate-700"
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-white shadow text-amber-600" : "text-slate-500 hover:text-slate-700"
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Drafts Grid/List */}
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
                status={blog.status || "draft"}
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
            icon={<FileText className="w-16 h-16" />}
            title={searchQuery ? "No drafts found" : "No drafts yet"}
            description={
              searchQuery
                ? "Try adjusting your search"
                : "Start writing your first blog post and save it as a draft"
            }
            action={
              !searchQuery && (
                <Link
                  href="/blogger/write"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Write Your First Draft
                </Link>
              )
            }
          />
        )}
      </div>
    </div>
  )
}
