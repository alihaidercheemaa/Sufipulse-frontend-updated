"use client"

import { useEffect, useState } from "react"
import { getAllPartnershipProposals } from "@/services/admin"
import { SectionHeader, SearchBar, EmptyState, LoadingState, GridCard, StatusBadge } from "@/components/ui"
import {
  Handshake,
  Building,
  Mail,
  Globe,
  Calendar,
  ChevronDown,
  ChevronUp,
  Users,
  Target,
  Clock,
  FileText,
} from "lucide-react"

interface PartnershipProposal {
  id: number
  full_name: string
  email: string
  organization_name: string
  organization_type: string
  role_title: string
  partnership_type: string
  website: string
  proposal_text: string
  proposed_timeline: string
  resources: string
  goals: string
  sacred_alignment: boolean
  created_at: string
  updated_at?: string
  status?: string
}

export default function PartnershipProposalsPage() {
  const [proposals, setProposals] = useState<PartnershipProposal[]>([])
  const [filteredProposals, setFilteredProposals] = useState<PartnershipProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await getAllPartnershipProposals()
        const data = Array.isArray(response.data) ? response.data : []

        const withStatus = data.map((p: PartnershipProposal) => ({
          ...p,
          status: p.status || "pending",
        }))

        setProposals(withStatus)
        setFilteredProposals(withStatus)
      } catch (error) {
        console.error("Error fetching partnership proposals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [])

  useEffect(() => {
    const filtered = proposals.filter(
      (proposal) =>
        proposal.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.partnership_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proposal.proposal_text &&
          proposal.proposal_text.toLowerCase().includes(searchQuery.toLowerCase())) ||
        proposal.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredProposals(filtered)
  }, [searchQuery, proposals])

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  if (loading) {
    return <LoadingState message="Loading partnership proposals..." />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader
        title="Partnership Proposals"
        description={`Manage all ${proposals.length} partnership proposals`}
        icon={<Handshake className="w-6 h-6" />}
        action={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
              <Handshake className="w-4 h-4 mr-1.5" />
              {proposals.length} Total
            </span>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <GridCard hover={false} className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Handshake className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700">Total Proposals</p>
              <p className="text-2xl font-bold text-emerald-900">{proposals.length}</p>
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
                {proposals.filter((p) => p.status === "pending").length}
              </p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Organizations</p>
              <p className="text-2xl font-bold text-blue-900">
                {new Set(proposals.map((p) => p.organization_name)).size}
              </p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700">Partnership Types</p>
              <p className="text-2xl font-bold text-purple-900">
                {new Set(proposals.map((p) => p.partnership_type)).size}
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
          placeholder="Search by organization, email, partnership type, or name..."
          className="max-w-md"
        />
      </div>

      {/* Proposals List */}
      {filteredProposals.length > 0 ? (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <GridCard key={proposal.id} hover={false}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleRow(proposal.id)}
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Organization</p>
                    <p className="text-sm sm:text-base text-slate-900 font-semibold">
                      {proposal.organization_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Partnership Type</p>
                    <p className="text-sm sm:text-base text-slate-700">{proposal.partnership_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Contact</p>
                    <p className="text-sm sm:text-base text-slate-700">{proposal.full_name}</p>
                  </div>
                </div>
                <button className="ml-4 p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                  {expandedRows.includes(proposal.id) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {expandedRows.includes(proposal.id) && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-600" />
                        Contact Information
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Name</p>
                            <p className="text-sm font-medium text-slate-900">{proposal.full_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Email</p>
                            <p className="text-sm font-medium text-slate-900">{proposal.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Building className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Organization</p>
                            <p className="text-sm font-medium text-slate-900">
                              {proposal.organization_name} ({proposal.organization_type})
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Role</p>
                            <p className="text-sm font-medium text-slate-900">{proposal.role_title}</p>
                          </div>
                        </div>
                        {proposal.website && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                              <Globe className="w-4 h-4 text-teal-600" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Website</p>
                              <a
                                href={proposal.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                              >
                                {proposal.website}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Proposal Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        Proposal Details
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Partnership Type</p>
                          <p className="text-sm font-medium text-slate-900">{proposal.partnership_type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Timeline</p>
                          <p className="text-sm font-medium text-slate-900">{proposal.proposed_timeline}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Resources</p>
                          <p className="text-sm text-slate-700">{proposal.resources}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Goals</p>
                          <p className="text-sm text-slate-700">{proposal.goals}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Sacred Alignment</p>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              proposal.sacred_alignment
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {proposal.sacred_alignment ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proposal Text */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-slate-900 mb-3">Proposal</h4>
                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-100">
                      <p className="text-slate-700">{proposal.proposal_text}</p>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {new Date(proposal.created_at).toLocaleString()}</span>
                    </div>
                    {proposal.updated_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Updated: {new Date(proposal.updated_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </GridCard>
          ))}
        </div>
      ) : (
        <GridCard hover={false}>
          <EmptyState
            icon={<Handshake className="w-8 h-8" />}
            title={searchQuery ? "No partnership proposals found" : "No partnership proposals yet"}
            description={
              searchQuery
                ? "Try adjusting your search terms"
                : "Partnership proposals will appear here"
            }
          />
        </GridCard>
      )}

      {/* Summary */}
      {filteredProposals.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <p>
            Showing {filteredProposals.length} of {proposals.length} partnership proposals
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
    </div>
  )
}
