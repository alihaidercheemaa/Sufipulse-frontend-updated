"use client"

import { useState } from "react"
import { Palette, Plus, Edit, Trash2, Globe, Music, Search } from "lucide-react"
import { SmartField, SmartMultiSelect, Alert } from "@/components/ui"

export default function WriterStylesPage() {
  const [activeTab, setActiveTab] = useState<"styles" | "languages">("styles")
  const [searchQuery, setSearchQuery] = useState("")
  const [success, setSuccess] = useState("")

  // Mock data - in production, this would come from API and be editable
  const [writingStyles, setWritingStyles] = useState([
    { id: 1, name: "Ghazal", count: 12, description: "Classical poetic form with rhyming couplets" },
    { id: 2, name: "Qawwali", count: 8, description: "Devotional Sufi music poetry" },
    { id: 3, name: "Nazm", count: 6, description: "Free verse poetry with unified theme" },
    { id: 4, name: "Rubaiyat", count: 4, description: "Quatrain form popularized by Omar Khayyam" },
    { id: 5, name: "Marsiya", count: 3, description: "Elegiac poetry commemorating martyrs" },
    { id: 6, name: "Naat", count: 5, description: "Poetry praising Prophet Muhammad" },
  ])

  const [languages, setLanguages] = useState([
    { id: 1, name: "Urdu", count: 18, native: "اردو" },
    { id: 2, name: "English", count: 10, native: "English" },
    { id: 3, name: "Arabic", count: 5, native: "العربية" },
    { id: 4, name: "Persian", count: 4, native: "فارسی" },
    { id: 5, name: "Turkish", count: 2, native: "Türkçe" },
    { id: 6, name: "Kashmiri", count: 3, native: "कॉशुर" },
  ])

  const filteredStyles = writingStyles.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLanguages = languages.filter(
    (l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.native.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteStyle = (id: number) => {
    if (confirm("Are you sure you want to remove this style?")) {
      setWritingStyles(writingStyles.filter((s) => s.id !== id))
      setSuccess("Style removed successfully")
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const handleDeleteLanguage = (id: number) => {
    if (confirm("Are you sure you want to remove this language?")) {
      setLanguages(languages.filter((l) => l.id !== id))
      setSuccess("Language removed successfully")
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Writing Styles & Languages</h1>
                <p className="text-emerald-100 text-sm">Manage your creative preferences</p>
              </div>
            </div>
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
              onClick={() => setActiveTab("styles")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "styles"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Music className="w-4 h-4" />
              Writing Styles ({writingStyles.length})
            </button>
            <button
              onClick={() => setActiveTab("languages")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "languages"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Globe className="w-4 h-4" />
              Languages ({languages.length})
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
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Writing Styles */}
        {activeTab === "styles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStyles.map((style) => (
              <div
                key={style.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{style.name}</h3>
                      <p className="text-xs text-slate-500">{style.count} kalams</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStyle(style.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{style.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {activeTab === "languages" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLanguages.map((lang) => (
              <div
                key={lang.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{lang.name}</h3>
                      <p className="text-xs text-slate-500">{lang.count} kalams</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLanguage(lang.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-lg text-slate-700 font-medium">{lang.native}</p>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === "styles" && filteredStyles.length === 0) ||
          (activeTab === "languages" && filteredLanguages.length === 0)) && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
            {activeTab === "styles" ? (
              <Music className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            ) : (
              <Globe className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            )}
            <p className="text-slate-500">No {activeTab} found</p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-2">About Writing Styles</h3>
          <p className="text-sm text-slate-600 mb-4">
            Writing styles define the poetic form and structure of your kalam. Each style has its own
            rhythm, rhyme scheme, and traditional usage in Sufi poetry.
          </p>
          <h3 className="font-semibold text-slate-900 mb-2">About Languages</h3>
          <p className="text-sm text-slate-600">
            Select the languages you write in. This helps vocalists find kalams that match their
            linguistic abilities and preferences.
          </p>
        </div>
      </div>
    </div>
  )
}
