"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Trophy, Plus, Trash2, X, Award, Star, Medal } from "lucide-react"
import {
  getAllSpecialRecognitions,
  deleteSpecialRecognition,
  createSpecialRecognition,
} from "@/services/recognition"
import { SectionHeader, GridCard, EmptyState, LoadingState } from "@/components/ui"

interface SpecialRecognition {
  id: number
  title: string
  subtitle: string
  description: string
  achievement: string
}

interface RecognitionFormData {
  title: string
  subtitle: string
  description: string
  achievement: string
}

export default function SpecialRecognitionsPage() {
  const [recognitions, setRecognitions] = useState<SpecialRecognition[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [getLoading, setGetLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [formData, setFormData] = useState<RecognitionFormData>({
    title: "",
    subtitle: "",
    description: "",
    achievement: "",
  })

  useEffect(() => {
    const fetchRecognitions = async () => {
      setGetLoading(true)
      try {
        const response = await getAllSpecialRecognitions()
        setRecognitions(response.data)
      } catch (error) {
        console.error("Failed to fetch special recognitions:", error)
      } finally {
        setGetLoading(false)
      }
    }

    fetchRecognitions()
  }, [])

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      achievement: "",
    })
  }

  const handleAddNew = () => {
    resetForm()
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    resetForm()
  }

  const handleDelete = async (recognitionId: number) => {
    setGetLoading(true)
    try {
      await deleteSpecialRecognition(recognitionId)
      setRecognitions(recognitions.filter((recognition) => recognition.id !== recognitionId))
    } catch (error) {
      console.error("Failed to delete recognition:", error)
    } finally {
      setGetLoading(false)
    }

    setShowDeleteConfirm(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await createSpecialRecognition(formData)
      setRecognitions([...recognitions, response.data])
    } catch (err: any) {
      console.log(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }

    setShowAddForm(false)
    resetForm()
  }

  const recognitionIcons = [Award, Star, Medal, Trophy]

  if (getLoading) {
    return <LoadingState message="Loading recognitions..." />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <SectionHeader
        title="Special Recognitions"
        description={`Manage ${recognitions.length} special recognition entries`}
        icon={<Trophy className="w-6 h-6" />}
        action={
          !showAddForm && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Recognition
            </button>
          )
        }
      />

      {/* Stats Cards */}
      {!showAddForm && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <GridCard hover={false} className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700">Total</p>
                <p className="text-2xl font-bold text-amber-900">{recognitions.length}</p>
              </div>
            </div>
          </GridCard>
          <GridCard hover={false} className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Awards</p>
                <p className="text-2xl font-bold text-purple-900">{recognitions.length}</p>
              </div>
            </div>
          </GridCard>
          <GridCard hover={false} className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Featured</p>
                <p className="text-2xl font-bold text-blue-900">{recognitions.length}</p>
              </div>
            </div>
          </GridCard>
          <GridCard hover={false} className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Medal className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700">Active</p>
                <p className="text-2xl font-bold text-emerald-900">{recognitions.length}</p>
              </div>
            </div>
          </GridCard>
        </div>
      )}

      {showAddForm && (
        <GridCard hover={false}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-6 h-6 text-emerald-600" />
              Add New Recognition
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter recognition title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter subtitle"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Enter description"
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Achievement</label>
                <textarea
                  required
                  value={formData.achievement}
                  onChange={(e) => setFormData((prev) => ({ ...prev, achievement: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Enter achievement details"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Recognition"}
              </button>
            </div>
          </form>
        </GridCard>
      )}

      {!showAddForm && (
        <>
          {recognitions.length === 0 ? (
            <GridCard hover={false}>
              <EmptyState
                icon={<Trophy className="w-8 h-8" />}
                title="No Special Recognitions"
                description="Add your first special recognition to get started"
                action={
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Recognition
                  </button>
                }
              />
            </GridCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recognitions.map((recognition, index) => {
                const Icon = recognitionIcons[index % recognitionIcons.length]
                return (
                  <GridCard key={recognition.id} hover={false} className="group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">
                            {recognition.title}
                          </h3>
                          <p className="text-sm text-slate-600">{recognition.subtitle}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(recognition.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Description
                        </p>
                        <p className="text-sm text-slate-700 mt-1">{recognition.description}</p>
                      </div>
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                        <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">
                          Achievement
                        </p>
                        <p className="text-sm text-amber-900 font-medium">{recognition.achievement}</p>
                      </div>
                    </div>
                  </GridCard>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Delete Recognition
            </h3>
            <p className="text-sm text-slate-600 text-center mb-6">
              Are you sure you want to delete this special recognition? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
