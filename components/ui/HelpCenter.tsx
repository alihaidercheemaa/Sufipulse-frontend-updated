"use client"

import { useState } from "react"
import {
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  FileText,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Video,
  Users,
  Settings,
  PenTool,
  Music,
  Mic,
} from "lucide-react"
import Link from "next/link"
import { SmartField } from "@/components/ui"

interface HelpCenterProps {
  role?: "blogger" | "writer" | "vocalist"
  contactEmail?: string
}

interface FAQ {
  question: string
  answer: string
  category: string
}

interface Guide {
  title: string
  description: string
  icon: any
  href: string
}

export default function HelpCenter({ role = "blogger", contactEmail }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const roleConfig = {
    blogger: {
      title: "Blogger Help Center",
      description: "Find answers to common questions about blogging on SufiPulse",
      color: "emerald",
      icon: PenTool,
    },
    writer: {
      title: "Writer Help Center",
      description: "Find answers to common questions about submitting poetry and kalam",
      color: "emerald",
      icon: Music,
    },
    vocalist: {
      title: "Vocalist Help Center",
      description: "Find answers to common questions about recording and collaborations",
      color: "purple",
      icon: Mic,
    },
  }

  const config = roleConfig[role]
  const Icon = config.icon

  // Role-specific FAQs
  const faqs: FAQ[] = role === "blogger" ? [
    {
      category: "Getting Started",
      question: "How do I write my first blog post?",
      answer: "Navigate to the 'Write Blog' page from your dashboard. Fill in the title, excerpt, and content using our rich text editor. Add relevant tags and a featured image, then submit for review.",
    },
    {
      category: "Getting Started",
      question: "What is the review process?",
      answer: "All blog posts go through an editorial review to ensure quality and alignment with our guidelines. This typically takes 2-3 business days.",
    },
    {
      category: "Content",
      question: "What are the content guidelines?",
      answer: "Blog posts should be original, well-researched, and relevant to Sufi culture, spirituality, or related topics. Minimum word count is 500 words.",
    },
    {
      category: "Content",
      question: "Can I edit my published blog?",
      answer: "Yes, you can request edits to published blogs by contacting the editorial team. Minor corrections are usually approved within 24 hours.",
    },
    {
      category: "Engagement",
      question: "How do I respond to comments?",
      answer: "Navigate to the 'Comments' page to view and moderate comments on your blogs. You can approve, reject, or reply to comments.",
    },
    {
      category: "Analytics",
      question: "How do I track my blog performance?",
      answer: "Visit the 'Analytics' page to see views, likes, comments, and shares for each blog post. Data is updated daily.",
    },
  ] : role === "writer" ? [
    {
      category: "Getting Started",
      question: "How do I submit a kalam?",
      answer: "Go to 'Submit Kalam' from your dashboard. Fill in the title, language, theme, and write your kalam text. Add any musical preferences and submit.",
    },
    {
      category: "Getting Started",
      question: "What happens after submission?",
      answer: "Your kalam goes through admin review. Once approved, it becomes available for vocalists to select for recording.",
    },
    {
      category: "Content",
      question: "What themes can I write about?",
      answer: "Common themes include Divine Love, Unity, Spiritual Journey, Repentance, Remembrance, and Spiritual Awakening. You can also select 'Other' for unique themes.",
    },
    {
      category: "Content",
      question: "Can I write in multiple languages?",
      answer: "Yes, you can submit kalams in Urdu, English, Arabic, Persian, Turkish, Kashmiri, or select 'Multilingual' for mixed language works.",
    },
    {
      category: "Collaboration",
      question: "How do vocalists find my kalam?",
      answer: "Once approved, your kalam appears in the Browse Kalams section where vocalists can discover and request to record it.",
    },
    {
      category: "Portfolio",
      question: "How do I showcase my best work?",
      answer: "Use the Portfolio page to feature your best kalams. You can select which works to highlight on your public profile.",
    },
  ] : [
    {
      category: "Getting Started",
      question: "How do I browse available kalams?",
      answer: "Visit the 'Browse Kalams' page to see all approved kalams available for recording. Filter by language, theme, or musical preference.",
    },
    {
      category: "Getting Started",
      question: "How do I request a studio session?",
      answer: "After selecting a kalam, go to 'Studio Recording' and fill out the request form with your preferred date, time, and performance direction.",
    },
    {
      category: "Recording",
      question: "What is the difference between studio and remote recording?",
      answer: "Studio recording is done in-person at our facility with professional equipment. Remote recording is done from your own setup and submitted digitally.",
    },
    {
      category: "Recording",
      question: "What equipment do I need for remote recording?",
      answer: "At minimum, you need a quality microphone and quiet recording space. Professional studio setups are preferred for best results.",
    },
    {
      category: "Collaboration",
      question: "How do I track my collaborations?",
      answer: "The 'Collaborations' page shows your complete history including pending requests, in-progress recordings, and published works.",
    },
    {
      category: "Technical",
      question: "What audio format should I submit?",
      answer: "For remote recordings, submit WAV or high-quality MP3 (320kbps) files. Sample rate should be 44.1kHz or higher.",
    },
  ]

  // Role-specific guides
  const guides: Guide[] = role === "blogger" ? [
    { title: "Writing Your First Blog", description: "Step-by-step guide for new bloggers", icon: PenTool, href: "/blogger/help/writing-guide" },
    { title: "SEO Best Practices", description: "Optimize your blogs for search engines", icon: Search, href: "/blogger/help/seo-guide" },
    { title: "Engaging Your Audience", description: "Tips for building reader engagement", icon: Users, href: "/blogger/help/engagement-guide" },
    { title: "Understanding Analytics", description: "Interpret your blog performance data", icon: FileText, href: "/blogger/help/analytics-guide" },
  ] : role === "writer" ? [
    { title: "Writing Sacred Poetry", description: "Guidelines for composing kalam", icon: Music, href: "/writer/help/writing-guide" },
    { title: "Understanding Themes", description: "Explore different spiritual themes", icon: BookOpen, href: "/writer/help/themes-guide" },
    { title: "Musical Preferences", description: "Guide to musical styles and preferences", icon: Mic, href: "/writer/help/musical-guide" },
    { title: "Building Your Portfolio", description: "Showcase your best work effectively", icon: FileText, href: "/writer/help/portfolio-guide" },
  ] : [
    { title: "Recording Basics", description: "Introduction to recording kalam", icon: Mic, href: "/vocalist/help/recording-guide" },
    { title: "Studio Preparation", description: "How to prepare for studio sessions", icon: Settings, href: "/vocalist/help/studio-guide" },
    { title: "Remote Recording Setup", description: "Setting up your home studio", icon: Video, href: "/vocalist/help/remote-guide" },
    { title: "Collaboration Tips", description: "Working effectively with writers", icon: Users, href: "/vocalist/help/collaboration-guide" },
  ]

  const categories = ["all", ...Array.from(new Set(faqs.map((f) => f.category)))]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className={`bg-gradient-to-r from-${config.color}-700 via-${config.color}-600 to-${config.color}-800 text-white rounded-2xl p-8`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{config.title}</h1>
            <p className="text-white/80">{config.description}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search for help articles, guides, FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href={`/${role}/dashboard`}
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
        >
          <div className="p-2 bg-emerald-100 rounded-lg">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Dashboard</p>
            <p className="text-sm text-slate-500">Back to dashboard</p>
          </div>
        </Link>
        <a
          href={`mailto:${contactEmail || `${role}@sufipulse.com`}`}
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Contact Support</p>
            <p className="text-sm text-slate-500">Email us directly</p>
          </div>
        </a>
        <Link
          href={`/${role}/notifications`}
          className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
        >
          <div className="p-2 bg-purple-100 rounded-lg">
            <MessageCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Notifications</p>
            <p className="text-sm text-slate-500">View your messages</p>
          </div>
        </Link>
      </div>

      {/* Guides */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Quick Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guides.map((guide, i) => {
            const GuideIcon = guide.icon
            return (
              <Link
                key={i}
                href={guide.href}
                className="p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-all">
                  <GuideIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{guide.title}</h3>
                <p className="text-sm text-slate-500">{guide.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-emerald-600" />
          Frequently Asked Questions
        </h2>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category === "all" ? "All Topics" : category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-slate-900 pr-4">{faq.question}</span>
                {expandedFaq === i ? (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === i && (
                <div className="px-4 pb-4 text-slate-600 border-t border-slate-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No FAQs found matching your search</p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Still need help?
          </h3>
          <p className="text-slate-600 mb-4">
            Our support team is here to assist you with any questions or issues.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${contactEmail || `${role}@sufipulse.com`}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
            <Link
              href={`/${role}/dashboard`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
