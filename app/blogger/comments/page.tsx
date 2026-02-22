"use client"

import { useState, useEffect } from "react"
import { MessageCircle, CheckCircle, XCircle, Trash2, Search, Filter, Eye } from "lucide-react"
import { getMyBlogComments, approveBlogComment, rejectBlogComment, deleteBlogComment } from "@/services/blogger"
import { EmptyState, LoadingState, Alert } from "@/components/ui"

interface Comment {
  id: number
  blog_id: number
  blog_title?: string
  commenter_name: string
  commenter_email: string
  comment_text: string
  is_approved: boolean
  created_at: string
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending" | "rejected">("all")
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await getMyBlogComments()
      if (response.status === 200) {
        setComments(response.data.comments || [])
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (commentId: number) => {
    setActionLoading(commentId)
    try {
      await approveBlogComment(commentId)
      setSuccess("Comment approved successfully")
      fetchComments()
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError("Failed to approve comment")
      setTimeout(() => setError(""), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (commentId: number) => {
    setActionLoading(commentId)
    try {
      await rejectBlogComment(commentId)
      setSuccess("Comment rejected")
      fetchComments()
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError("Failed to reject comment")
      setTimeout(() => setError(""), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return
    setActionLoading(commentId)
    try {
      await deleteBlogComment(commentId)
      setSuccess("Comment deleted successfully")
      fetchComments()
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError("Failed to delete comment")
      setTimeout(() => setError(""), 3000)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.comment_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.commenter_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "approved" && comment.is_approved) ||
      (filterStatus === "pending" && !comment.is_approved)
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: comments.length,
    approved: comments.filter((c) => c.is_approved).length,
    pending: comments.filter((c) => !c.is_approved).length,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return <LoadingState message="Loading comments..." size="lg" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Comments Management</h1>
              <p className="text-purple-100 text-sm">Moderate and respond to reader comments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Alerts */}
        {success && (
          <Alert type="success" title="Success" message={success} onClose={() => setSuccess("")} />
        )}
        {error && (
          <Alert type="error" title="Error" message={error} onClose={() => setError("")} />
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">Total Comments</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.approved}</p>
                <p className="text-xs text-slate-500">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Filter className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                <p className="text-xs text-slate-500">Pending Review</p>
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
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Comments ({stats.total})</option>
              <option value="approved">Approved ({stats.approved})</option>
              <option value="pending">Pending ({stats.pending})</option>
            </select>
          </div>
        </div>

        {/* Comments List */}
        {filteredComments.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-6 hover:bg-slate-50 transition-colors ${
                    !comment.is_approved ? "bg-amber-50/30" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-700 font-semibold text-sm">
                            {comment.commenter_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{comment.commenter_name}</p>
                          <p className="text-sm text-slate-500">{comment.commenter_email}</p>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            comment.is_approved
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          }`}
                        >
                          {comment.is_approved ? "Approved" : "Pending"}
                        </span>
                      </div>
                      <p className="text-slate-700 mb-3">{comment.comment_text}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!comment.is_approved ? (
                        <>
                          <button
                            onClick={() => handleApprove(comment.id)}
                            disabled={actionLoading === comment.id}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(comment.id)}
                            disabled={actionLoading === comment.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      ) : null}
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={actionLoading === comment.id}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<MessageCircle className="w-16 h-16" />}
            title={searchQuery ? "No comments found" : "No comments yet"}
            description={
              searchQuery
                ? "Try adjusting your search or filters"
                : "Comments from readers will appear here for moderation"
            }
          />
        )}
      </div>
    </div>
  )
}
