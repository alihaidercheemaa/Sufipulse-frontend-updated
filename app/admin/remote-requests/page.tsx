"use client"

import { useEffect, useState } from "react"
import { getAllRemoteRecordingRequests, updateRemoteRecordingRequestStatus } from "@/services/requests"
import { SectionHeader, SearchBar, EmptyState, LoadingState, GridCard, StatusBadge } from "@/components/ui"
import {
  Wifi,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  Laptop,
  Globe,
} from "lucide-react"

interface RemoteRequest {
  id: number
  vocalist_id: number
  kalam_id: number
  name: string
  email: string
  city: string
  country: string
  time_zone: string
  role: string
  project_type: string
  recording_equipment: string
  internet_speed: string
  preferred_software: string
  availability: string
  recording_experience: string
  technical_setup: string
  additional_details: string
  status: string
  admin_comments: string
  created_at: string
  updated_at: string
}

export default function RemoteRequestsPage() {
  const [requests, setRequests] = useState<RemoteRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RemoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [adminComments, setAdminComments] = useState("")
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<RemoteRequest | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getAllRemoteRecordingRequests()
        setRequests(Array.isArray(response.data) ? response.data : [])
        setFilteredRequests(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error("Error fetching remote requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  useEffect(() => {
    const filtered = requests.filter(
      (request) =>
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.time_zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.project_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.recording_equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.internet_speed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.preferred_software.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.availability.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.recording_experience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.technical_setup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.additional_details &&
          request.additional_details.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredRequests(filtered)
  }, [searchQuery, requests])

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    setUpdatingId(requestId)
    try {
      await updateRemoteRecordingRequestStatus(requestId, newStatus, adminComments)
      const response = await getAllRemoteRecordingRequests()
      setRequests(Array.isArray(response.data) ? response.data : [])
      setFilteredRequests(Array.isArray(response.data) ? response.data : [])
      setAdminComments("")
      setShowCommentModal(false)
      setSelectedRequest(null)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const openStatusModal = (request: RemoteRequest) => {
    setSelectedRequest(request)
    setAdminComments("")
    setShowCommentModal(true)
  }

  if (loading) {
    return <LoadingState message="Loading remote recording requests..." />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader
        title="Remote Recording Requests"
        description={`Manage all ${requests.length} remote recording requests`}
        icon={<Wifi className="w-6 h-6" />}
        action={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
              <Clock className="w-4 h-4 mr-1.5" />
              {requests.filter((r) => r.status === "pending").length} Pending
            </span>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <GridCard hover={false} className="bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Total Requests</p>
              <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-700">Pending</p>
              <p className="text-2xl font-bold text-amber-900">
                {requests.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700">Approved</p>
              <p className="text-2xl font-bold text-emerald-900">
                {requests.filter((r) => r.status === "approved").length}
              </p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-700">Rejected</p>
              <p className="text-2xl font-bold text-red-900">
                {requests.filter((r) => r.status === "rejected").length}
              </p>
            </div>
          </div>
        </GridCard>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, location, role, project type, or status..."
          className="max-w-md"
        />
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <GridCard key={request.id} hover={false}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleRow(request.id)}
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Name</p>
                    <p className="text-sm sm:text-base text-slate-900 font-semibold">
                      {request.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Project Type</p>
                    <p className="text-sm sm:text-base text-slate-700">{request.project_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Availability</p>
                    <p className="text-sm sm:text-base text-slate-700 truncate">
                      {request.availability}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <StatusBadge status={request.status} />
                  <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                    {expandedRows.includes(request.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {expandedRows.includes(request.id) && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  {/* Status Update Section */}
                  {request.status === "pending" && (
                    <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Update Request Status
                      </h3>
                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={() => openStatusModal(request)}
                          disabled={updatingId === request.id}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request.id, "rejected")}
                          disabled={updatingId === request.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        Contact Information
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Email</p>
                            <p className="text-sm font-medium text-slate-900">{request.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Location</p>
                            <p className="text-sm font-medium text-slate-900">
                              {request.city && request.country
                                ? `${request.city}, ${request.country}`
                                : "Not specified"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Time Zone</p>
                            <p className="text-sm font-medium text-slate-900">
                              {request.time_zone || "Not specified"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Wifi className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Role</p>
                            <p className="text-sm font-medium text-slate-900">{request.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        Project Details
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Project Type</p>
                          <p className="text-sm font-medium text-slate-900">{request.project_type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Availability</p>
                          <p className="text-sm text-slate-700">{request.availability}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Information */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-emerald-600" />
                      Technical Information
                    </h4>
                    <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Recording Equipment</p>
                        <p className="text-sm text-slate-700">
                          {request.recording_equipment || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Internet Speed</p>
                        <p className="text-sm text-slate-700">
                          {request.internet_speed || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Preferred Software</p>
                        <p className="text-sm text-slate-700">
                          {request.preferred_software || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Recording Experience</p>
                        <p className="text-sm text-slate-700">
                          {request.recording_experience || "Not specified"}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs text-slate-500 font-medium">Technical Setup</p>
                        <p className="text-sm text-slate-700">
                          {request.technical_setup || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {request.additional_details && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Additional Details</h4>
                      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-100">
                        <p className="text-slate-700">{request.additional_details}</p>
                      </div>
                    </div>
                  )}

                  {/* References & Timestamps */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">References</h4>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Vocalist ID</p>
                          <p className="text-sm font-medium text-slate-900">{request.vocalist_id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Kalam ID</p>
                          <p className="text-sm font-medium text-slate-900">{request.kalam_id}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Timestamps</h4>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Created: {new Date(request.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Updated: {new Date(request.updated_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </GridCard>
          ))}
        </div>
      ) : (
        <GridCard hover={false}>
          <EmptyState
            icon={<Wifi className="w-8 h-8" />}
            title={searchQuery ? "No remote recording requests found" : "No remote recording requests yet"}
            description={
              searchQuery
                ? "Try adjusting your search terms"
                : "Remote recording requests will appear here"
            }
          />
        </GridCard>
      )}

      {/* Summary */}
      {filteredRequests.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <p>
            Showing {filteredRequests.length} of {requests.length} remote recording requests
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add Admin Comments</h3>
            <textarea
              value={adminComments}
              onChange={(e) => setAdminComments(e.target.value)}
              placeholder="Add comments (optional)..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCommentModal(false)
                  setSelectedRequest(null)
                  setAdminComments("")
                }}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedRequest.id, "approved")}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedRequest.id, "rejected")}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
