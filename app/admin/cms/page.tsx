"use client"

import { useEffect, useState } from "react"
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  BarChart3,
  Users,
  Quote,
  Clock,
  MapPin,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { adminGetAllPages, adminDeletePage, getPageData } from "@/services/cms"
import { SectionHeader, SearchBar, EmptyState, LoadingState, GridCard, StatusBadge } from "@/components/ui"

interface CMSPage {
  id: number
  page_name: string
  page_title: string
  page_slug: string
  is_active: boolean
  updated_at: string
}

export default function CMSPagesPage() {
  const [pages, setPages] = useState<CMSPage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null)
  const [pageStats, setPageStats] = useState<any>(null)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const response = await adminGetAllPages()
      setPages(response.data?.data || [])
    } catch (error) {
      console.error("Error fetching pages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pageId: number) => {
    if (!confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      return
    }

    try {
      await adminDeletePage(pageId)
      setPages(pages.filter((p) => p.id !== pageId))
      alert("Page deleted successfully")
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to delete page")
    }
  }

  const handleViewPage = async (pageSlug: string) => {
    try {
      const response = await getPageData(pageSlug)
      setPageStats(response.data?.data)
      alert("Page data fetched! Check console for details.")
      console.log("Page Data:", response.data?.data)
    } catch (error) {
      console.error("Error fetching page data:", error)
    }
  }

  const filteredPages = pages.filter(
    (page) =>
      page.page_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.page_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.page_slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <LoadingState message="Loading CMS pages..." />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader
        title="CMS Pages Management"
        description="Manage website page content, stats, values, team members, and more"
        icon={<FileText className="w-6 h-6" />}
        action={
          <Link
            href="/admin/cms/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Page
          </Link>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <GridCard hover={false} className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Total Pages</p>
              <p className="text-3xl font-bold text-emerald-900 mt-1">{pages.length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Active Pages</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {pages.filter((p) => p.is_active).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Inactive Pages</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {pages.filter((p) => !p.is_active).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </GridCard>
        <GridCard hover={false} className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Content Types</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">7</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </GridCard>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search pages by name, title, or slug..."
          className="max-w-md"
        />
      </div>

      {/* Pages Grid */}
      {filteredPages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPages.map((page) => (
            <GridCard key={page.id} className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {page.page_name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        page.is_active
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {page.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-slate-500 font-medium">Title:</span>
                  <span className="truncate">{page.page_title}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="text-slate-500 font-medium">Slug:</span>
                  <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">/{page.page_slug}</code>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Updated: {new Date(page.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewPage(page.page_slug)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Data
                </button>
                <Link
                  href={`/admin/cms/edit/${page.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GridCard>
          ))}
        </div>
      ) : (
        <GridCard hover={false}>
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title={searchQuery ? "No pages found" : "No CMS pages yet"}
            description={
              searchQuery
                ? "Try adjusting your search terms"
                : "Create your first page to get started"
            }
            action={
              <Link
                href="/admin/cms/new"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Page
              </Link>
            }
          />
        </GridCard>
      )}

      {/* Content Types Info */}
      <GridCard hover={false} className="mt-6 bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Manage Page Content Types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <BarChart3 className="w-6 h-6 text-emerald-600 mb-2" />
            <p className="text-sm font-semibold text-slate-800">Statistics</p>
            <p className="text-xs text-slate-500 mt-1">Numbers & metrics</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-semibold text-slate-800">Values</p>
            <p className="text-xs text-slate-500 mt-1">Core principles</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-sm font-semibold text-slate-800">Team</p>
            <p className="text-xs text-slate-500 mt-1">Members & bios</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <Clock className="w-6 h-6 text-orange-600 mb-2" />
            <p className="text-sm font-semibold text-slate-800">Timeline</p>
            <p className="text-xs text-slate-500 mt-1">Milestones</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <Quote className="w-6 h-6 text-pink-600 mb-2" />
            <p className="text-sm font-semibold text-slate-800">Testimonials</p>
            <p className="text-xs text-slate-500 mt-1">Quotes & reviews</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <MapPin className="w-6 h-6 text-teal-600 mb-2" />
            <p className="text-sm font-semibold text-slate-800">Hubs</p>
            <p className="text-xs text-slate-500 mt-1">Locations</p>
          </div>
        </div>
      </GridCard>
    </div>
  )
}
