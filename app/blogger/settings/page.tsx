"use client"

import BloggerDashboardLayout from "@/components/Layouts/BloggerDashboard"
import { SettingsForm } from "@/components/ui"

export default function BloggerSettingsPage() {
  const handleSaveSettings = async (data: any) => {
    // In production, this would call an API to save settings
    console.log("Saving settings:", data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <BloggerDashboardLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
          <p className="text-slate-600">Manage your account preferences and settings</p>
        </div>
        <SettingsForm onSubmit={handleSaveSettings} />
      </div>
    </BloggerDashboardLayout>
  )
}
