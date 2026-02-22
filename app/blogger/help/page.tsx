"use client"

import BloggerDashboardLayout from "@/components/Layouts/BloggerDashboard"
import { HelpCenter } from "@/components/ui"

export default function BloggerHelpPage() {
  return (
    <BloggerDashboardLayout>
      <HelpCenter role="blogger" contactEmail="blogger@sufipulse.com" />
    </BloggerDashboardLayout>
  )
}
