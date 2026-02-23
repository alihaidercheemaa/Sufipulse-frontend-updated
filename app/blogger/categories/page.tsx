"use client"

import { useState, useEffect } from "react"
import { Tag, Plus, Edit, Trash2, Search } from "lucide-react"
import { SmartField, Alert, LoadingState } from "@/components/ui"
import { getMyBlogSubmissions } from "@/services/blogger"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  count: number
  color: string
}

interface Tag {
  id: number
  name: string
  slug: string
  count: number
}

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "tags">("categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Category | Tag | null>(null)
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  // Fetch blogs and extract categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyBlogSubmissions()
        if (response.status === 200) {
          const blogs = response.data.blogs || []
          
          // Extract unique categories with counts
          const categoryMap = new Map<string, number>()
          const tagMap = new Map<string, number>()
          const colors = ["emerald", "blue", "purple", "pink", "amber", "indigo", "cyan", "orange"]
          
          blogs.forEach((blog: any, index: number) => {
            // Count categories
            if (blog.category) {
              categoryMap.set(blog.category, (categoryMap.get(blog.category) || 0) + 1)
            }
            
            // Count tags
            if (blog.tags && Array.isArray(blog.tags)) {
              blog.tags.forEach((tag: string) => {
                tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
              })
            }
          })
          
          // Convert to Category array
          const categoriesData: Category[] = Array.from(categoryMap.entries()).map(([name, count], index) => ({
            id: index + 1,
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            description: `${name} blog posts`,
            count,
            color: colors[index % colors.length],
          }))
          
          // Convert to Tag array
          const tagsData: Tag[] = Array.from(tagMap.entries()).map(([name, count], index) => ({
            id: index + 1,
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            count,
          }))
          
          setCategories(categoriesData)
          setTags(tagsData)
        }
      } catch (error) {
        console.error("Error fetching categories and tags:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const filteredCategories = categories.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTags = tags.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDeleteCategory = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id))
      setSuccess("Category deleted successfully")
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const handleDeleteTag = (id: number) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      setTags(tags.filter((t) => t.id !== id))
      setSuccess("Tag deleted successfully")
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  if (loading) {
    return <LoadingState message="Loading categories and tags..." size="lg" />
  }

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      pink: "bg-pink-100 text-pink-700 border-pink-200",
      amber: "bg-amber-100 text-amber-700 border-amber-200",
    }
    return colors[color] || colors.emerald
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Categories & Tags</h1>
                <p className="text-indigo-100 text-sm">Organize your blog content</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Alerts */}
        {success && (
          <Alert type="success" title="Success" message={success} onClose={() => setSuccess("")} />
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "categories"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab("tags")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "tags"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tags ({tags.length})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Categories */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`bg-white rounded-xl shadow-sm border p-6 ${getColorClass(category.color)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm opacity-75">{category.count} posts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem(category)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm opacity-75">{category.description}</p>
                <p className="text-xs mt-3 opacity-60">/{category.slug}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {activeTab === "tags" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-wrap gap-3">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full hover:bg-indigo-100 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-700">#{tag.name}</span>
                  <span className="text-xs text-slate-500">{tag.count}</span>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="ml-1 p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {((activeTab === "categories" && filteredCategories.length === 0) ||
          (activeTab === "tags" && filteredTags.length === 0)) && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <Tag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">No {activeTab} found</p>
          </div>
        )}
      </div>
    </div>
  )
}
