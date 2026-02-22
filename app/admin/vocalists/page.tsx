"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAllVocalists } from "@/services/admin"
import { SectionHeader, SearchBar, EmptyState, LoadingState, GridCard, StatusBadge } from "@/components/ui"
import { Mic2, Users, Search, Mail, MapPin, ChevronRight, UserPlus } from "lucide-react"

interface Vocalist {
  id: number
  email: string
  name: string
  role: string
  country: string
  city: string
}

export default function VocalistsPage() {
  const [vocalists, setVocalists] = useState<Vocalist[]>([])
  const [filteredVocalists, setFilteredVocalists] = useState<Vocalist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchVocalists = async () => {
      try {
        const response = await getAllVocalists()
        setVocalists(response.data?.vocalists || [])
        setFilteredVocalists(response.data?.vocalists || [])
      } catch (error) {
        console.error("Error fetching vocalists:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVocalists()
  }, [])

  useEffect(() => {
    const filtered = vocalists.filter(
      (vocalist) =>
        vocalist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vocalist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vocalist.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vocalist.city && vocalist.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (vocalist.country && vocalist.country.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredVocalists(filtered)
  }, [searchQuery, vocalists])

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "vocalist":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "producer":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  if (loading) {
    return <LoadingState message="Loading vocalists..." />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader
        title="Vocalists"
        description={`Manage all ${vocalists.length} registered vocalists`}
        icon={<Mic2 className="w-6 h-6" />}
        action={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
              <Users className="w-4 h-4 mr-1.5" />
              {vocalists.length} Total
            </span>
          </div>
        }
      />

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, role, or location..."
          className="max-w-md"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <GridCard hover={false} className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Mic2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700">Total Vocalists</p>
              <p className="text-2xl font-bold text-purple-900">{vocalists.length}</p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Admins</p>
              <p className="text-2xl font-bold text-blue-900">
                {vocalists.filter((v) => v.role.toLowerCase() === "admin").length}
              </p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700">Active</p>
              <p className="text-2xl font-bold text-emerald-900">
                {vocalists.filter((v) => v.role.toLowerCase() !== "admin").length}
              </p>
            </div>
          </div>
        </GridCard>
      </div>

      {/* Vocalists Grid */}
      {filteredVocalists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocalists.map((vocalist) => (
            <GridCard key={vocalist.id} className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {vocalist.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {vocalist.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(vocalist.role)}`}
                    >
                      {vocalist.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{vocalist.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>
                    {vocalist.city && vocalist.country
                      ? `${vocalist.city}, ${vocalist.country}`
                      : "Location not specified"}
                  </span>
                </div>
              </div>

              <Link
                href={`/admin/vocalists/${vocalist.id}`}
                className="mt-4 flex items-center justify-center w-full py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-sm font-medium transition-all group-hover:bg-emerald-600 group-hover:text-white"
              >
                View Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </GridCard>
          ))}
        </div>
      ) : (
        <GridCard hover={false}>
          <EmptyState
            icon={<Mic2 className="w-8 h-8" />}
            title={searchQuery ? "No vocalists found" : "No vocalists yet"}
            description={
              searchQuery
                ? "Try adjusting your search terms"
                : "Registered vocalists will appear here"
            }
          />
        </GridCard>
      )}

      {/* Summary */}
      {filteredVocalists.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <p>
            Showing {filteredVocalists.length} of {vocalists.length} vocalists
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
