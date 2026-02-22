"use client"

import VocalistLayout from "@/components/Layouts/VocalistLayout"
import { HelpCenter } from "@/components/ui"

export default function VocalistHelpPage() {
  return (
    <VocalistLayout>
      <HelpCenter role="vocalist" contactEmail="vocalist@sufipulse.com" />
    </VocalistLayout>
  )
}
