"use client"

import { useState, useEffect } from "react"
import { getAllBlogSubmissions } from "@/services/admin"
import { approveOrRejectBlog } from "@/services/blogger"
import { SectionHeader, SearchBar, EmptyState, LoadingState, GridCard, StatusBadge } from "@/components/ui"
import { FileText, CheckCircle, XCircle, Clock, Eye, MessageSquare, PenTool, Calendar } from "lucide-react"
import toast from "react-hot-toast"

interface Blog {
  id: number
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  language: string
  user_id: number
  user_name: string
  user_email: string
  status: string
  admin_comments: string
  editor_notes: string
  scheduled_publish_date: string
  seo_meta_title: string
  seo_meta_description: string
  created_at: string
  updated_at: string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [adminComment, setAdminComment] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    const filtered = blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.status.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || blog.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
    setFilteredBlogs(filtered)
  }, [searchQuery, blogs, statusFilter])

  const fetchBlogs = async () => {
    try {
      const response = await getAllBlogSubmissions()
      if (response.status === 200) {
        const data = response.data
        setBlogs(data.blogs || [])
        setFilteredBlogs(data.blogs || [])
      } else {
        toast.error("Failed to fetch blog submissions")
      }
    } catch (error) {
      console.error("Error fetching blog submissions:", error)
      toast.error("An error occurred while fetching blog submissions")
    } finally {
      setLoading(false)
    }
  }

  const handleSetStatus = (blog: Blog) => {
    setSelectedBlog(blog)
    setNewStatus(blog.status)
    setAdminComment("")
    setStatusModalOpen(true)
  }

  const submitStatusChange = async () => {
    if (!selectedBlog || !newStatus) return

    try {
      const response = await approveOrRejectBlog(selectedBlog.id, {
        status: newStatus,
        admin_comments: adminComment,
      })

      if (response.status === 200) {
        toast.success(`Blog status updated to ${newStatus}`)
        setStatusModalOpen(false)
        fetchBlogs()
      } else {
        const errorData = response.data
        toast.error(errorData.message || "Failed to update blog status")
      }
    } catch (error) {
      console.error("Error updating blog status:", error)
      toast.error("An error occurred while updating the blog status")
    }
  }

  const getStatusCounts = () => {
    const counts: Record<string, number> = {}
    blogs.forEach((blog) => {
      counts[blog.status] = (counts[blog.status] || 0) + 1
    })
    return counts
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return <LoadingState message="Loading blog submissions..." />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader
        title="Blog Submissions"
        description={`Manage all ${blogs.length} blog submissions from bloggers`}
        icon={<FileText className="w-6 h-6" />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <GridCard hover={false} className="bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-500 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Total</p>
              <p className="text-xl font-bold text-slate-900">{blogs.length}</p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-600">Pending</p>
              <p className="text-xl font-bold text-amber-900">{statusCounts["submitted"] || 0}</p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600">Review</p>
              <p className="text-xl font-bold text-blue-900">{statusCounts["review"] || 0}</p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-600">Approved</p>
              <p className="text-xl font-bold text-emerald-900">{statusCounts["approved"] || 0}</p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-orange-600">Revision</p>
              <p className="text-xl font-bold text-orange-900">{statusCounts["revision"] || 0}</p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-green-600">Posted</p>
              <p className="text-xl font-bold text-green-900">{statusCounts["posted"] || 0}</p>
            </div>
          </div>
        </GridCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, author, category, or status..."
          className="flex-1 max-w-md"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
        >
          <option value="all">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="revision">Needs Revision</option>
          <option value="rejected">Rejected</option>
          <option value="posted">Posted</option>
        </select>
      </div>

      {/* Blogs Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBlogs.map((blog) => (
            <GridCard key={blog.id} className="group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{blog.excerpt}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <StatusBadge status={blog.status} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                  <FileText className="w-3 h-3 mr-1" />
                  {blog.category || "Uncategorized"}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                  <PenTool className="w-3 h-3 mr-1" />
                  {blog.language || "N/A"}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {blog.user_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{blog.user_name}</p>
                  <p className="text-xs text-slate-500 truncate">{blog.user_email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSetStatus(blog)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Set Status
                </button>
                <button
                  onClick={() => {
                    setSelectedBlog(blog)
                    setStatusModalOpen(true)
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>
            </GridCard>
          ))}
        </div>
      ) : (
        <GridCard hover={false}>
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title={searchQuery ? "No blog submissions found" : "No blog submissions yet"}
            description={
              searchQuery
                ? "Try adjusting your search terms or filters"
                : "Blog submissions from bloggers will appear here"
            }
          />
        </GridCard>
      )}

      {/* Summary */}
      {filteredBlogs.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <p>
            Showing {filteredBlogs.length} of {blogs.length} blog submissions
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <div className="flex gap-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear search
                </button>
              )}
              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Status Modal */}
      {statusModalOpen && selectedBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Set Blog Status: {selectedBlog.title}
                </h3>
                <button
                  onClick={() => setStatusModalOpen(false)}
                  className="text-slate-400 hover:text-slate-500 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                <h4 className="font-semibold text-slate-900 mb-3">Blog Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">Author:</span>
                    <p className="font-medium text-slate-900">{selectedBlog.user_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Category:</span>
                    <p className="font-medium text-slate-900">{selectedBlog.category || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Language:</span>
                    <p className="font-medium text-slate-900">{selectedBlog.language || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <StatusBadge status={selectedBlog.status} />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="newStatus" className="block text-sm font-semibold text-slate-700 mb-2">
                  Set Status
                </label>
                <select
                  id="newStatus"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="submitted">Submitted</option>
                  <option value="review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="revision">Needs Revision</option>
                  <option value="rejected">Rejected</option>
                  <option value="posted">Posted</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="adminComment" className="block text-sm font-semibold text-slate-700 mb-2">
                  Admin Comment (Optional)
                </label>
                <textarea
                  id="adminComment"
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Add any comments or feedback for the blogger..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitStatusChange}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
