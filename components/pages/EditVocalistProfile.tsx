"use client"
import type React from "react"
import { useState, useEffect } from "react"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { getVocalistProfile, vocalistSubmitKalam } from "@/services/vocalist"
import Cookies from "js-cookie"
import { X } from "lucide-react"

interface VocalistProfileData {
  vocalist_id: string
  user_id: number
  vocal_range: string
  languages: string[]
  sample_title: string
  audio_sample_url: string
  sample_description: string
  experience_background: string
  portfolio: string
  availability: string
  status: string
  created_at: string
  updated_at: string
  country: string
  city: string
}

interface EditVocalistProfileProps {
  onRegistrationComplete?: () => void
  onCancel?: () => void
  isEditing?: boolean
}

const EditVocalistProfile: React.FC<EditVocalistProfileProps> = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    vocal_range: "",
    languages: "",
    sample_title: "",
    audio_sample_url: "",
    sample_description: "",
    experience_background: "",
    portfolio: "",
    availability: "",
  })
  const [loading, setLoading] = useState(true)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = parseInt(Cookies.get('user_id') || '0')
      if (!userId) {
        setFormError("User not authenticated")
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const response = await getVocalistProfile(userId)
        setFormData({
          vocal_range: response.data.vocal_range || "",
          languages: response.data.languages?.join(", ") || "",
          sample_title: response.data.sample_title || "",
          audio_sample_url: response.data.audio_sample_url || "",
          sample_description: response.data.sample_description || "",
          experience_background: response.data.experience_background || "",
          portfolio: response.data.portfolio || "",
          availability: response.data.availability || "",
        })
      } catch (err: any) {
        console.error("Error fetching vocalist profile:", err)
        setFormError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      setFormError(null)
      const data = {
        vocal_range: formData.vocal_range,
        languages: formData.languages
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        sample_title: formData.sample_title,
        audio_sample_url: formData.audio_sample_url,
        sample_description: formData.sample_description,
        experience_background: formData.experience_background,
        portfolio: formData.portfolio,
        availability: formData.availability,
      }
      await vocalistSubmitKalam(data)
      if (onRegistrationComplete) {
        onRegistrationComplete()
      } else {
        router.push("/vocalist/profile")
      }
    } catch (err: any) {
      console.error("Error submitting vocalist profile:", err)
      setFormError("Failed to update profile. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-900 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-800 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto px-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Edit Vocalist Profile</h2>
            <button
              onClick={() => {
                if (onCancel) {
                  onCancel()
                } else {
                  router.push("/vocalist/profile")
                }
              }}
              className="text-slate-800 hover:text-purple-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {formError && (
            <div className="mb-6 p-4 bg-purple-50 text-purple-900 rounded-lg">
              {formError}
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Vocal Range
              </label>
              <input
                type="text"
                name="vocal_range"
                value={formData.vocal_range}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-50 focus:border-purple-900 focus:ring focus:ring-purple-50"
                placeholder="e.g., Soprano, Alto, Tenor, Bass"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Languages (comma-separated)
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-50 focus:border-purple-900 focus:ring focus:ring-purple-50"
                placeholder="e.g., English, Urdu, Arabic"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Sample Title
              </label>
              <input
                type="text"
                name="sample_title"
                value={formData.sample_title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-50 focus:border-purple-900 focus:ring focus:ring-purple-50"
                placeholder="e.g., My First Qawwali Sample"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Audio Sample URL
              </label>
              <input
                type="text"
                name="audio_sample_url"
                value={formData.audio_sample_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-50 focus:border-purple-900 focus:ring focus:ring-purple-50"
                placeholder="e.g., https://example.com/audio.mp3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Sample Description
              </label>
              <textarea
                name="sample_description"
                value={formData.sample_description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-50 focus:border-purple-900 focus:ring focus:ring-purple-50"
                placeholder="Describe your audio sample..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Experience & Background
              </label>
              <textarea
                name="experience_background"
                value={formData.experience_background}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-50 focus:border-purple-900 focus:ring focus:ring-purple-50"
                placeholder="Tell us about your vocal training and experience..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Portfolio URL
              </label>
              <input
                type="text"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-50 focus:border-purple-900 focus:ring focus:ring-purple-50"
                placeholder="e.g., https://youtube.com/yourchannel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">
                Availability
              </label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-50 focus:border-purple-900 focus:ring focus:ring-purple-50"
                placeholder="e.g., Available for weekend recordings"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  if (onCancel) {
                    onCancel()
                  } else {
                    router.push("/vocalist/profile")
                  }
                }}
                className="px-4 py-2 rounded-lg bg-slate-50 text-slate-800 hover:bg-purple-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-purple-900 text-white hover:bg-purple-800 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EditVocalistProfile
