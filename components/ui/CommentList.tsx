"use client"

import { formatDistanceToNow } from "date-fns"
import { User, CheckCircle, Clock, XCircle, Trash2, Flag } from "lucide-react"

interface Comment {
  id: number
  blog_id: number
  user_id: number | null
  commenter_name: string
  commenter_email: string
  comment_text: string
  parent_id: number | null
  is_approved: boolean
  created_at: string
  updated_at: string
}

interface CommentCardProps {
  comment: Comment
  onApprove?: (commentId: number) => void
  onReject?: (commentId: number) => void
  onDelete?: (commentId: number) => void
  showActions?: boolean
}

/**
 * Displays a single blog comment with author info and status
 */
export function CommentCard({
  comment,
  onApprove,
  onReject,
  onDelete,
  showActions = false,
}: CommentCardProps) {
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-emerald-200 transition-colors">
      {/* Comment Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{comment.commenter_name}</p>
            <p className="text-xs text-slate-500">{comment.commenter_email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {comment.is_approved ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              Approved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              <Clock className="w-3 h-3" />
              Pending
            </span>
          )}
          <span className="text-xs text-slate-400">{timeAgo}</span>
        </div>
      </div>

      {/* Comment Content */}
      <div className="mb-3">
        <p className="text-slate-700 leading-relaxed">{truncateText(comment.comment_text)}</p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
          {!comment.is_approved && onApprove && (
            <button
              onClick={() => onApprove(comment.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <CheckCircle className="w-3 h-3" />
              Approve
            </button>
          )}
          {comment.is_approved && onReject && (
            <button
              onClick={() => onReject(comment.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Clock className="w-3 h-3" />
              Unapprove
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          )}
          <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors">
            <Flag className="w-3 h-3" />
            Report
          </button>
        </div>
      )}
    </div>
  )
}

interface CommentListProps {
  comments: Comment[]
  title?: string
  emptyMessage?: string
  onApprove?: (commentId: number) => void
  onReject?: (commentId: number) => void
  onDelete?: (commentId: number) => void
  showActions?: boolean
  limit?: number
}

/**
 * Displays a list of blog comments with optional actions
 */
export default function CommentList({
  comments,
  title = "Comments",
  emptyMessage = "No comments yet",
  onApprove,
  onReject,
  onDelete,
  showActions = false,
  limit,
}: CommentListProps) {
  const displayComments = limit ? comments.slice(0, limit) : comments

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            {title}
            <span className="text-sm font-normal text-slate-500">({comments.length})</span>
          </h3>
        </div>
      )}
      <div className="space-y-3">
        {displayComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
            showActions={showActions}
          />
        ))}
      </div>
      {limit && comments.length > limit && (
        <p className="text-center text-sm text-slate-500 mt-4">
          Showing {limit} of {comments.length} comments
        </p>
      )}
    </div>
  )
}

// Import for the MessageCircle icon used in empty state
import { MessageCircle } from "lucide-react"
