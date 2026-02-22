"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAllKalams } from "@/services/admin"
import { SectionHeader, SearchBar, EmptyState, LoadingState, GridCard } from "@/components/ui"
import { Music, Languages, Tag, ChevronRight, BookOpen } from "lucide-react"

interface Kalam {
  id: number
  title: string
  language: string
  theme: string
  sufi_influence: string
  musical_preference: string
}

export default function KalamsPage() {
  const [kalams, setKalams] = useState<Kalam[]>([])
  const [filteredKalams, setFilteredKalams] = useState<Kalam[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchKalams = async () => {
      try {
        const response = await getAllKalams()
        setKalams(response.data?.kalams || [])
        setFilteredKalams(response.data?.kalams || [])
      } catch (error) {
        console.error("Error fetching kalams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchKalams()
  }, [])

  useEffect(() => {
    const filtered = kalams.filter(
      (kalam) =>
        kalam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kalam.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kalam.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kalam.sufi_influence.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kalam.musical_preference.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredKalams(filtered)
  }, [searchQuery, kalams])

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      urdu: "bg-blue-100 text-blue-800 border-blue-200",
      punjabi: "bg-green-100 text-green-800 border-green-200",
      arabic: "bg-purple-100 text-purple-800 border-purple-200",
      persian: "bg-pink-100 text-pink-800 border-pink-200",
    }
    return colors[language.toLowerCase()] || "bg-emerald-100 text-emerald-800 border-emerald-200"
  }

  const getThemeColor = (theme: string) => {
    const colors: Record<string, string> = {
      devotional: "bg-red-100 text-red-800 border-red-200",
      mystical: "bg-indigo-100 text-indigo-800 border-indigo-200",
      praise: "bg-amber-100 text-amber-800 border-amber-200",
      spiritual: "bg-violet-100 text-violet-800 border-violet-200",
    }
    return colors[theme.toLowerCase()] || "bg-slate-100 text-slate-800 border-slate-200"
  }

  if (loading) {
    return <LoadingState message="Loading kalams..." />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader
        title="Kalams"
        description={`Manage all ${kalams.length} kalams in the system`}
        icon={<Music className="w-6 h-6" />}
        action={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
              <BookOpen className="w-4 h-4 mr-1.5" />
              {kalams.length} Total
            </span>
          </div>
        }
      />

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, language, theme, or musical preference..."
          className="max-w-md"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <GridCard hover={false} className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-700">Total Kalams</p>
              <p className="text-2xl font-bold text-orange-900">{kalams.length}</p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Languages</p>
              <p className="text-2xl font-bold text-blue-900">
                {new Set(kalams.map((k) => k.language.toLowerCase())).size}
              </p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700">Themes</p>
              <p className="text-2xl font-bold text-purple-900">
                {new Set(kalams.map((k) => k.theme.toLowerCase())).size}
              </p>
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700">Active</p>
              <p className="text-2xl font-bold text-emerald-900">{kalams.length}</p>
            </div>
          </div>
        </GridCard>
      </div>

      {/* Kalams Grid */}
      {filteredKalams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKalams.map((kalam) => (
            <GridCard key={kalam.id} className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {kalam.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getLanguageColor(kalam.language)}`}
                >
                  <Languages className="w-3 h-3 mr-1" />
                  {kalam.language}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getThemeColor(kalam.theme)}`}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {kalam.theme}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-slate-600">
                  <Music className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{kalam.musical_preference}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{kalam.sufi_influence}</span>
                </div>
              </div>

              <Link
                href={`/admin/kalams/${kalam.id}`}
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
            icon={<Music className="w-8 h-8" />}
            title={searchQuery ? "No kalams found" : "No kalams yet"}
            description={
              searchQuery ? "Try adjusting your search terms" : "Submitted kalams will appear here"
            }
          />
        </GridCard>
      )}

      {/* Summary */}
      {filteredKalams.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <p>
            Showing {filteredKalams.length} of {kalams.length} kalams
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
