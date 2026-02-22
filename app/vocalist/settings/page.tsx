"use client"

import VocalistLayout from "@/components/Layouts/VocalistLayout"
import { SettingsForm } from "@/components/ui"

export default function VocalistSettingsPage() {
  const handleSaveSettings = async (data: any) => {
    // In production, this would call an API to save settings
    console.log("Saving settings:", data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <VocalistLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
          <p className="text-slate-600">Manage your account preferences and settings</p>
        </div>
        <SettingsForm onSubmit={handleSaveSettings} />
      </div>
    </VocalistLayout>
  )
}
