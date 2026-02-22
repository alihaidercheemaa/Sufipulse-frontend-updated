"use client"

import WriterDashboardLayout from "@/components/Layouts/WriterDashboard"
import { HelpCenter } from "@/components/ui"

export default function WriterHelpPage() {
  return (
    <WriterDashboardLayout>
      <HelpCenter role="writer" contactEmail="writer@sufipulse.com" />
    </WriterDashboardLayout>
  )
}
