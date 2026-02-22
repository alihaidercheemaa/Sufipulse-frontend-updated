"use client"

import { useState } from "react"
import type React from "react"
import Link from "next/link"
import {
  PenTool,
  ArrowLeft,
  BookOpen,
  Globe,
  Target,
  FileText,
  Sparkles,
  Music,
  MessageSquare,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { createKalam } from "@/services/writer"
import {
  SmartField,
  SmartTextArea,
  SmartSelect,
  FieldGroup,
  Alert,
  CharacterCounter,
} from "@/components/ui"

interface KalamFormData {
  title: string
  language: string
  theme: string
  kalam_text: string
  description: string
  sufi_influence: string
  musical_preference: string
  writer_comments: string
}

const LANGUAGE_OPTIONS = [
  { value: "", label: "Select Language" },
  { value: "Urdu", label: "Urdu" },
  { value: "English", label: "English" },
  { value: "Arabic", label: "Arabic" },
  { value: "Persian", label: "Persian" },
  { value: "Turkish", label: "Turkish" },
  { value: "Kashmiri", label: "Kashmiri" },
  { value: "Multilingual", label: "Multilingual" },
  { value: "Other", label: "Other" },
]

const THEME_OPTIONS = [
  { value: "", label: "Select Theme" },
  { value: "Divine Love", label: "Divine Love" },
  { value: "Unity", label: "Unity" },
  { value: "Spiritual Journey", label: "Spiritual Journey" },
  { value: "Repentance", label: "Repentance" },
  { value: "Remembrance", label: "Remembrance" },
  { value: "Spiritual Awakening", label: "Spiritual Awakening" },
  { value: "Other", label: "Other" },
]

const MUSICAL_PREFERENCE_OPTIONS = [
  { value: "", label: "Open to Direction" },
  { value: "Qawwali", label: "Qawwali" },
  { value: "Sacred Chant", label: "Sacred Chant" },
  { value: "Spiritual Anthem", label: "Spiritual Anthem" },
  { value: "Whisper Kalam", label: "Whisper Kalam" },
  { value: "Soft Instrumental", label: "Soft Instrumental" },
]

export default function SubmitKalam() {
  const [formData, setFormData] = useState<KalamFormData>({
    title: "",
    language: "",
    theme: "",
    kalam_text: "",
    description: "",
    sufi_influence: "",
    musical_preference: "",
    writer_comments: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be under 100 characters"
    }
    if (!formData.language) {
      newErrors.language = "Language is required"
    }
    if (!formData.theme) {
      newErrors.theme = "Theme is required"
    }
    if (!formData.kalam_text.trim()) {
      newErrors.kalam_text = "Kalam text is required"
    } else if (formData.kalam_text.length > 5000) {
      newErrors.kalam_text = "Kalam text must be under 5000 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      await createKalam(formData)
      setSuccess(true)
      setFormData({
        title: "",
        language: "",
        theme: "",
        kalam_text: "",
        description: "",
        sufi_influence: "",
        musical_preference: "",
        writer_comments: "",
      })
      setTimeout(() => setSuccess(false), 5000)
    } catch (error: any) {
      console.error("Error submitting kalam:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/writer/kalams"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Submit New Kalam</h1>
              <p className="text-emerald-100 text-sm">Share your sacred poetry with the world</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Alert */}
        {success && (
          <div className="mb-6">
            <Alert
              type="success"
              title="Kalam Submitted Successfully!"
              message="Your sacred poetry has been submitted for review. You will be notified once it's approved."
              onClose={() => setSuccess(false)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Classification */}
          <FieldGroup
            title="Content Classification"
            description="Define the basic details of your kalam"
            icon={BookOpen}
          >
            <SmartField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter kalam title"
              required
              error={errors.title}
              maxLength={100}
              icon={PenTool}
              className="md:col-span-2"
            />

            <SmartSelect
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              options={LANGUAGE_OPTIONS}
              required
              error={errors.language}
              icon={Globe}
            />

            <SmartSelect
              label="Theme"
              name="theme"
              value={formData.theme}
              onChange={handleInputChange}
              options={THEME_OPTIONS}
              required
              error={errors.theme}
              icon={Target}
            />
          </FieldGroup>

          {/* Kalam Text */}
          <FieldGroup
            title="Sacred Poetry"
            description="Write your kalam with spiritual expression"
            icon={FileText}
            className="md:col-span-2"
          >
            <div className="md:col-span-2 space-y-2">
              <SmartTextArea
                label="Kalam Text"
                name="kalam_text"
                value={formData.kalam_text}
                onChange={handleInputChange}
                placeholder="Enter your sacred poetry here..."
                required
                error={errors.kalam_text}
                rows={12}
                maxLength={5000}
              />
              <CharacterCounter value={formData.kalam_text} maxLength={5000} />
            </div>
          </FieldGroup>

          {/* Additional Details */}
          <FieldGroup
            title="Additional Details"
            description="Provide context and preferences for your kalam"
            icon={Sparkles}
          >
            <SmartTextArea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the inspiration or meaning behind your kalam..."
              rows={4}
              className="md:col-span-2"
            />

            <SmartField
              label="Sufi Influence"
              name="sufi_influence"
              value={formData.sufi_influence}
              onChange={handleInputChange}
              placeholder="e.g., Rumi, Bulleh Shah, Hazrat Inayat Khan"
              icon={Sparkles}
            />

            <SmartSelect
              label="Musical Preference"
              name="musical_preference"
              value={formData.musical_preference}
              onChange={handleInputChange}
              options={MUSICAL_PREFERENCE_OPTIONS}
              icon={Music}
            />
          </FieldGroup>

          {/* Writer Comments */}
          <FieldGroup
            title="Additional Notes"
            description="Share any additional comments or requests"
            icon={MessageSquare}
            className="md:col-span-2"
          >
            <div className="md:col-span-2">
              <SmartTextArea
                label="Writer Comments"
                name="writer_comments"
                value={formData.writer_comments}
                onChange={handleInputChange}
                placeholder="Any specific requests or notes for the vocalists and producers..."
                rows={4}
              />
            </div>
          </FieldGroup>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
            <Link
              href="/writer/kalams"
              className="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`
                inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700
                text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800
                transition-all shadow-lg hover:shadow-xl
                ${loading ? "opacity-70 cursor-not-allowed" : ""}
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Submit Kalam
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
