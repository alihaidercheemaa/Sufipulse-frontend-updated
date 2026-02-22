"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAllBloggers } from "@/services/admin"
import { SectionHeader, SearchBar, EmptyState, LoadingState, GridCard } from "@/components/ui"
import { Users, Mail, MapPin, ChevronRight, UserPlus, PenTool } from "lucide-react"

interface Blogger {
  id: number
  email: string
  name: string
  role: string
  country: string
  city: string
}

export default function BloggersPage() {
  const [bloggers, setBloggers] = useState<Blogger[]>([])
  const [filteredBloggers, setFilteredBloggers] = useState<Blogger[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchBloggers = async () => {
      try {
        const response = await getAllBloggers()
        setBloggers(response.data?.bloggers || [])
        setFilteredBloggers(response.data?.bloggers || [])
      } catch (error) {
        console.error("Error fetching bloggers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBloggers()
  }, [])

  useEffect(() => {
    const filtered = bloggers.filter(
      (blogger) =>
        blogger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blogger.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blogger.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blogger.city && blogger.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blogger.country && blogger.country.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredBloggers(filtered)
  }, [searchQuery, bloggers])

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "blogger":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "editor":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  if (loading) {
    return <LoadingState message="Loading bloggers..." />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader
        title="Bloggers"
        description={`Manage all ${bloggers.length} registered bloggers`}
        icon={<PenTool className="w-6 h-6" />}
        action={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
              <Users className="w-4 h-4 mr-1.5" />
              {bloggers.length} Total
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
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700">Total Bloggers</p>
              <p className="text-2xl font-bold text-purple-900">{bloggers.length}</p>
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
                {bloggers.filter((b) => b.role.toLowerCase() === "admin").length}
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
                {bloggers.filter((b) => b.role.toLowerCase() !== "admin").length}
              </p>
            </div>
          </div>
        </GridCard>
      </div>

      {/* Bloggers Grid */}
      {filteredBloggers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBloggers.map((blogger) => (
            <GridCard key={blogger.id} className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {blogger.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                      {blogger.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(blogger.role)}`}
                    >
                      {blogger.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{blogger.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>
                    {blogger.city && blogger.country
                      ? `${blogger.city}, ${blogger.country}`
                      : "Location not specified"}
                  </span>
                </div>
              </div>

              <Link
                href={`/admin/bloggers/${blogger.id}`}
                className="mt-4 flex items-center justify-center w-full py-2.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-lg text-sm font-medium transition-all group-hover:bg-purple-600 group-hover:text-white"
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
            icon={<PenTool className="w-8 h-8" />}
            title={searchQuery ? "No bloggers found" : "No bloggers yet"}
            description={
              searchQuery ? "Try adjusting your search terms" : "Registered bloggers will appear here"
            }
          />
        </GridCard>
      )}

      {/* Summary */}
      {filteredBloggers.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <p>
            Showing {filteredBloggers.length} of {bloggers.length} bloggers
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
