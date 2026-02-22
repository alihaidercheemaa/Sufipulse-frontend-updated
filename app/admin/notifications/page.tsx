"use client"

import { getAllVocalists, getAllWriters, getAllBloggers } from "@/services/admin"
import { createNotification } from "@/services/notifications"
import type React from "react"
import { useState, useEffect } from "react"
import { SectionHeader, GridCard, EmptyState, LoadingState } from "@/components/ui"
import { Bell, Users, Mic2, PenTool, FileText, Send, CheckCircle, XCircle } from "lucide-react"
import toast from "react-hot-toast"

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface NotificationData {
  title: string
  message: string
  target_type: "all" | "vocalists" | "writers" | "bloggers" | "specific"
  target_user_ids: number[]
}

export default function NotificationsPage() {
  const [formData, setFormData] = useState<NotificationData>({
    title: "",
    message: "",
    target_type: "all",
    target_user_ids: [],
  })

  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  // Fetch users (vocalists, writers, and bloggers) from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [vocalistsResponse, writersResponse, bloggersResponse] = await Promise.all([
          getAllVocalists(),
          getAllWriters(),
          getAllBloggers(),
        ])

        const vocalists = (vocalistsResponse.data?.vocalists || []).map((v: any) => ({
          ...v,
          role: "vocalist",
        }))

        const writers = (writersResponse.data?.writers || []).map((w: any) => ({
          ...w,
          role: "writer",
        }))

        const bloggers = (bloggersResponse.data?.bloggers || []).map((b: any) => ({
          ...b,
          role: "blogger",
        }))

        const allUsers = [...vocalists, ...writers, ...bloggers]
        setUsers(allUsers)
        setFilteredUsers(allUsers)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setFetchLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const handleTargetTypeChange = (
    targetType: "all" | "vocalists" | "writers" | "bloggers" | "specific"
  ) => {
    if (targetType === "specific") {
      setFormData((prev) => ({ ...prev, target_type: "all", target_user_ids: [] }))
      setShowUserSearch(true)
    } else {
      setFormData((prev) => ({ ...prev, target_type: targetType, target_user_ids: [] }))
      setShowUserSearch(false)
      setSelectedUser(null)
    }
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setFormData((prev) => ({ ...prev, target_user_ids: [user.id], target_type: "specific" }))
    setShowUserSearch(false)
    setSearchTerm("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await createNotification(formData)
      toast.success("Notification sent successfully!")
      setFormData({
        title: "",
        message: "",
        target_type: "all",
        target_user_ids: [],
      })
      setSelectedUser(null)
    } catch (error) {
      console.error("Error sending notification:", error)
      toast.error("Failed to send notification")
    } finally {
      setLoading(false)
    }
  }

  const targetOptions = [
    { value: "all", label: "All Users", icon: Users, color: "bg-emerald-500", count: users.length },
    { value: "vocalists", label: "Vocalists Only", icon: Mic2, color: "bg-purple-500", count: users.filter(u => u.role === "vocalist").length },
    { value: "writers", label: "Writers Only", icon: PenTool, color: "bg-blue-500", count: users.filter(u => u.role === "writer").length },
    { value: "bloggers", label: "Bloggers Only", icon: FileText, color: "bg-orange-500", count: users.filter(u => u.role === "blogger").length },
    { value: "specific", label: "Specific User", icon: Users, color: "bg-pink-500", count: 1 },
  ]

  if (fetchLoading) {
    return <LoadingState message="Loading notification options..." />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <SectionHeader
        title="Send Notifications"
        description="Send notifications to users across the platform"
        icon={<Bell className="w-6 h-6" />}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Target Audience Selection */}
        <GridCard hover={false}>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Target Audience</h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {targetOptions.map((option) => {
              const Icon = option.icon
              const isSelected =
                (formData.target_type === option.value && !selectedUser) ||
                (option.value === "specific" && selectedUser)

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTargetTypeChange(option.value as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-medium text-slate-700 text-center">{option.label}</p>
                  <p className="text-xs text-slate-500 text-center mt-1">{option.count}</p>
                </button>
              )
            })}
          </div>
        </GridCard>

        {/* User Search (for specific user selection) */}
        {showUserSearch && (
          <GridCard hover={false}>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Search User</h3>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Search by name or email..."
            />
            {filteredUsers.length > 0 && searchTerm && (
              <div className="mt-3 max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="p-3 hover:bg-emerald-50 cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{user.name}</p>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full capitalize">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GridCard>
        )}

        {/* Selected User Display */}
        {selectedUser && (
          <GridCard hover={false} className="bg-emerald-50 border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700">Selected User</p>
                  <p className="font-semibold text-slate-900">{selectedUser.name}</p>
                  <p className="text-sm text-slate-600">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null)
                  setFormData((prev) => ({ ...prev, target_user_ids: [], target_type: "all" }))
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </GridCard>
        )}

        {/* Title Field */}
        <GridCard hover={false}>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
            Notification Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter notification title..."
            required
          />
        </GridCard>

        {/* Message Field */}
        <GridCard hover={false}>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={5}
            placeholder="Enter your notification message..."
            required
          />
          <p className="text-xs text-slate-500 mt-2">
            {formData.message.length} characters
          </p>
        </GridCard>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading ||
            !formData.title.trim() ||
            !formData.message.trim()
          }
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 px-6 rounded-xl font-semibold transition-all disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Notification
            </>
          )}
        </button>
      </form>
    </div>
  )
}
