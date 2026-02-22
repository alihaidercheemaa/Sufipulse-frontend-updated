"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, Edit, Eye, Plus, Music, Globe, Target, Sparkles } from "lucide-react"
import { getKalamsByWriter } from "@/services/writer"
import { EmptyState, LoadingState, StatusBadge } from "@/components/ui"

interface Kalam {
  id: number
  title: string
  language: string
  theme: string
  kalam_text: string
  description: string
  sufi_influence: string
  musical_preference: string
  published_at: string | null
  created_at: string
}

interface Submission {
  status: string
}

interface KalamWithSubmission {
  kalam: Kalam
  submission?: Submission
}

export default function WriterPortfolioPage() {
  const [kalams, setKalams] = useState<KalamWithSubmission[]>([])
  const [featuredIds, setFeaturedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<"all" | "featured" | "published">("all")

  useEffect(() => {
    fetchKalams()
  }, [])

  const fetchKalams = async () => {
    try {
      const response = await getKalamsByWriter()
      if (response.status === 200) {
        setKalams(response.data.kalams || [])
        // Load featured IDs from localStorage
        const saved = localStorage.getItem("featured_kalams")
        if (saved) {
          setFeaturedIds(JSON.parse(saved))
        }
      }
    } catch (error) {
      console.error("Error fetching kalams:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = (id: number) => {
    const newFeatured = featuredIds.includes(id)
      ? featuredIds.filter((fid) => fid !== id)
      : [...featuredIds, id]
    setFeaturedIds(newFeatured)
    localStorage.setItem("featured_kalams", JSON.stringify(newFeatured))
  }

  const filteredKalams = kalams.filter((item) => {
    if (filterType === "featured") return featuredIds.includes(item.kalam.id)
    if (filterType === "published") return item.kalam.published_at !== null
    return true
  })

  const featuredKalams = kalams.filter((item) => featuredIds.includes(item.kalam.id))

  if (loading) {
    return <LoadingState message="Loading portfolio..." size="lg" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Star className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">My Portfolio</h1>
              </div>
              <p className="text-purple-100 text-sm sm:text-base">
                Showcase your best sacred poetry
              </p>
            </div>
            <Link
              href="/writer/submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Submit New Kalam
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{featuredIds.length}</p>
                <p className="text-xs text-slate-500">Featured Works</p>
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
                  {kalams.filter((k) => k.kalam.published_at).length}
                </p>
                <p className="text-xs text-slate-500">Published</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Music className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{kalams.length}</p>
                <p className="text-xs text-slate-500">Total Kalams</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(kalams.map((k) => k.kalam.theme)).size}
                </p>
                <p className="text-xs text-slate-500">Themes Explored</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "all"
                  ? "bg-purple-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Works ({kalams.length})
            </button>
            <button
              onClick={() => setFilterType("featured")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "featured"
                  ? "bg-purple-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Featured ({featuredIds.length})
            </button>
            <button
              onClick={() => setFilterType("published")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "published"
                  ? "bg-purple-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Published ({kalams.filter((k) => k.kalam.published_at).length})
            </button>
          </div>
        </div>

        {/* Featured Section */}
        {featuredKalams.length > 0 && filterType !== "published" && (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-amber-900">Featured Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredKalams.map((item) => (
                <div
                  key={item.kalam.id}
                  className="bg-white rounded-xl p-4 border border-amber-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{item.kalam.title}</h3>
                    <button
                      onClick={() => toggleFeatured(item.kalam.id)}
                      className="text-amber-500 hover:text-amber-600"
                      title="Remove from featured"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Globe className="w-3 h-3" />
                    {item.kalam.language}
                    <span className="mx-1">•</span>
                    <Target className="w-3 h-3" />
                    {item.kalam.theme}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{item.kalam.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKalams.map((item) => (
            <div
              key={item.kalam.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">{item.kalam.title}</h3>
                  <button
                    onClick={() => toggleFeatured(item.kalam.id)}
                    className={`p-1 rounded transition-colors ${
                      featuredIds.includes(item.kalam.id)
                        ? "text-amber-500 hover:text-amber-600"
                        : "text-slate-300 hover:text-amber-500"
                    }`}
                    title={featuredIds.includes(item.kalam.id) ? "Remove from featured" : "Add to featured"}
                  >
                    <Star className={`w-5 h-5 ${featuredIds.includes(item.kalam.id) ? "fill-current" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <Globe className="w-4 h-4" />
                    {item.kalam.language}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <Target className="w-4 h-4" />
                    {item.kalam.theme}
                  </span>
                  {item.kalam.sufi_influence && (
                    <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                      <Sparkles className="w-4 h-4" />
                      {item.kalam.sufi_influence}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                  {item.kalam.description || item.kalam.kalam_text.substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between">
                  {item.submission && (
                    <StatusBadge
                      status={item.submission.status}
                      customConfig={{
                        [item.submission.status]: {
                          color:
                            item.submission.status === "admin_approved" ||
                            item.submission.status === "final_approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.submission.status === "pending" ||
                                item.submission.status === "under_review"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700",
                          label: item.submission.status.replace(/_/g, " "),
                        },
                      }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/writer/kalams/${item.kalam.id}`}
                      className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/writer/kalams/${item.kalam.id}/edit`}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredKalams.length === 0 && (
          <EmptyState
            icon={<Star className="w-16 h-16" />}
            title={
              filterType === "featured"
                ? "No featured works"
                : filterType === "published"
                ? "No published works"
                : "No works yet"
            }
            description={
              filterType === "featured"
                ? "Star your best kalams to feature them in your portfolio"
                : filterType === "published"
                ? "Your published kalams will appear here"
                : "Start your sacred journey by submitting your first poetry"
            }
            action={
              <Link
                href="/writer/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Submit Kalam
              </Link>
            }
          />
        )}
      </div>
    </div>
  )
}
