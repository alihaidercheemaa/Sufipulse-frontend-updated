"use client"

import { useState } from "react"
import { SmartField, SmartTextArea, SmartToggle, SmartSelect, FieldGroup, Alert } from "@/components/ui"
import { User, Mail, Bell, Lock, Globe, Shield, Eye, EyeOff } from "lucide-react"

interface SettingsFormProps {
  onSubmit?: (data: SettingsData) => Promise<void>
  initialData?: SettingsData
}

interface SettingsData {
  // Profile Settings
  name?: string
  email?: string
  bio?: string
  location?: string
  website?: string

  // Notification Settings
  emailNotifications?: boolean
  pushNotifications?: boolean
  weeklyDigest?: boolean
  marketingEmails?: boolean

  // Privacy Settings
  publicProfile?: boolean
  showEmail?: boolean
  allowMessages?: boolean

  // Security Settings
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string

  // Preferences
  language?: string
  timezone?: string
  theme?: "light" | "dark" | "system"
}

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ur", label: "Urdu" },
  { value: "ar", label: "Arabic" },
  { value: "fa", label: "Persian" },
]

const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "Europe/London", label: "London" },
  { value: "Asia/Karachi", label: "Pakistan" },
  { value: "Asia/Dubai", label: "Dubai" },
]

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System Default" },
]

export default function SettingsForm({ onSubmit, initialData }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "privacy" | "security" | "preferences">("profile")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState<SettingsData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    bio: initialData?.bio || "",
    location: initialData?.location || "",
    website: initialData?.website || "",
    emailNotifications: initialData?.emailNotifications ?? true,
    pushNotifications: initialData?.pushNotifications ?? true,
    weeklyDigest: initialData?.weeklyDigest ?? false,
    marketingEmails: initialData?.marketingEmails ?? false,
    publicProfile: initialData?.publicProfile ?? true,
    showEmail: initialData?.showEmail ?? false,
    allowMessages: initialData?.allowMessages ?? true,
    language: initialData?.language || "en",
    timezone: initialData?.timezone || "UTC",
    theme: initialData?.theme || "system",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleToggleChange = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (onSubmit) {
        await onSubmit(formData)
      }
      setSuccess("Settings saved successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Globe },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success/Error Alerts */}
      {success && (
        <Alert type="success" title="Success" message={success} onClose={() => setSuccess("")} />
      )}
      {error && (
        <Alert type="error" title="Error" message={error} onClose={() => setError("")} />
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Settings */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Profile Information</h3>
              <p className="text-sm text-slate-500">Update your personal information</p>
            </div>

            <FieldGroup title="Basic Info" icon={User}>
              <SmartField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                icon={User}
              />
              <SmartField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                icon={Mail}
              />
              <SmartField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
              <SmartField
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
              />
              <div className="md:col-span-2">
                <SmartTextArea
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </FieldGroup>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Notification Preferences</h3>
              <p className="text-sm text-slate-500">Manage how you receive notifications</p>
            </div>

            <FieldGroup title="Email Notifications" icon={Mail}>
              <div className="md:col-span-2 space-y-4">
                <SmartToggle
                  label="Email Notifications"
                  description="Receive email notifications for important updates"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={(checked) => handleToggleChange("emailNotifications", checked)}
                />
                <SmartToggle
                  label="Push Notifications"
                  description="Receive browser push notifications"
                  name="pushNotifications"
                  checked={formData.pushNotifications}
                  onChange={(checked) => handleToggleChange("pushNotifications", checked)}
                />
                <SmartToggle
                  label="Weekly Digest"
                  description="Receive a weekly summary of activities"
                  name="weeklyDigest"
                  checked={formData.weeklyDigest}
                  onChange={(checked) => handleToggleChange("weeklyDigest", checked)}
                />
                <SmartToggle
                  label="Marketing Emails"
                  description="Receive promotional emails and updates"
                  name="marketingEmails"
                  checked={formData.marketingEmails}
                  onChange={(checked) => handleToggleChange("marketingEmails", checked)}
                />
              </div>
            </FieldGroup>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === "privacy" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Privacy Settings</h3>
              <p className="text-sm text-slate-500">Control your privacy and visibility</p>
            </div>

            <FieldGroup title="Privacy Options" icon={Shield}>
              <div className="md:col-span-2 space-y-4">
                <SmartToggle
                  label="Public Profile"
                  description="Make your profile visible to other users"
                  name="publicProfile"
                  checked={formData.publicProfile}
                  onChange={(checked) => handleToggleChange("publicProfile", checked)}
                />
                <SmartToggle
                  label="Show Email"
                  description="Display your email on your public profile"
                  name="showEmail"
                  checked={formData.showEmail}
                  onChange={(checked) => handleToggleChange("showEmail", checked)}
                />
                <SmartToggle
                  label="Allow Messages"
                  description="Allow other users to send you messages"
                  name="allowMessages"
                  checked={formData.allowMessages}
                  onChange={(checked) => handleToggleChange("allowMessages", checked)}
                />
              </div>
            </FieldGroup>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Security Settings</h3>
              <p className="text-sm text-slate-500">Update your password and security options</p>
            </div>

            <FieldGroup title="Change Password" icon={Lock}>
              <SmartField
                label="Current Password"
                name="currentPassword"
                type={showPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
                icon={Lock}
              />
              <SmartField
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                icon={Lock}
              />
              <SmartField
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                icon={Lock}
              />
              <div className="md:col-span-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPassword ? "Hide passwords" : "Show passwords"}
                </button>
              </div>
            </FieldGroup>
          </div>
        )}

        {/* Preferences */}
        {activeTab === "preferences" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Preferences</h3>
              <p className="text-sm text-slate-500">Customize your experience</p>
            </div>

            <FieldGroup title="App Preferences" icon={Globe}>
              <SmartSelect
                label="Language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                options={LANGUAGE_OPTIONS}
              />
              <SmartSelect
                label="Timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                options={TIMEZONE_OPTIONS}
              />
              <SmartSelect
                label="Theme"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                options={THEME_OPTIONS}
              />
            </FieldGroup>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`
              px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700
              text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800
              transition-all shadow-lg hover:shadow-xl
              ${loading ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}
