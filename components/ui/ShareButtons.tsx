"use client"

import { useState } from "react"
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Link as LinkIcon, Check } from "lucide-react"
import { toast } from "react-hot-toast"

interface ShareButtonsProps {
  url: string
  title: string
  layout?: "horizontal" | "vertical" | "icons-only"
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
}

/**
 * Social share buttons for blog posts
 * Supports: Facebook, Twitter/X, LinkedIn, WhatsApp, Copy Link
 */
export default function ShareButtons({
  url,
  title,
  layout = "horizontal",
  size = "md",
  showTooltip = true,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const sizeClasses = {
    sm: { button: "w-8 h-8", icon: "w-4 h-4" },
    md: { button: "w-10 h-10", icon: "w-5 h-5" },
    lg: { button: "w-12 h-12", icon: "w-6 h-6" },
  }

  const shareOptions = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      getUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter/X",
      icon: Twitter,
      color: "bg-slate-900 hover:bg-slate-800",
      getUrl: () => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      getUrl: () => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-600 hover:bg-green-700",
      getUrl: () => `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    },
  ]

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        })
        toast.success("Shared successfully!")
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      // Fallback to copy link
      handleCopyLink()
    }
  }

  if (layout === "icons-only") {
    return (
      <div className="flex items-center gap-2">
        {shareOptions.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.name}
              onClick={() => handleShare(option.getUrl())}
              className={`${sizeClasses[size].button} ${option.color} rounded-full flex items-center justify-center text-white transition-all hover:scale-110 shadow-md`}
              title={showTooltip ? `Share on ${option.name}` : ""}
              aria-label={`Share on ${option.name}`}
            >
              <Icon className={sizeClasses[size].icon} />
            </button>
          )
        })}
        <button
          onClick={handleCopyLink}
          className={`${sizeClasses[size].button} ${copied ? "bg-emerald-600" : "bg-slate-600 hover:bg-slate-700"} rounded-full flex items-center justify-center text-white transition-all hover:scale-110 shadow-md`}
          title={showTooltip ? (copied ? "Copied!" : "Copy link") : ""}
          aria-label="Copy link"
        >
          {copied ? <Check className={sizeClasses[size].icon} /> : <LinkIcon className={sizeClasses[size].icon} />}
        </button>
      </div>
    )
  }

  return (
    <div className={`flex ${layout === "vertical" ? "flex-col" : "flex-col sm:flex-row"} gap-3`}>
      {/* Native Share Button */}
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
      >
        <Share2 className={sizeClasses[size].icon} />
        <span>Share</span>
      </button>

      {/* Social Platform Buttons */}
      <div className={`flex ${layout === "vertical" ? "flex-col" : "flex-wrap"} gap-2`}>
        {shareOptions.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.name}
              onClick={() => handleShare(option.getUrl())}
              className={`${sizeClasses[size].button} ${option.color} rounded-lg flex items-center justify-center text-white transition-all hover:scale-105 shadow-md`}
              title={showTooltip ? `Share on ${option.name}` : ""}
              aria-label={`Share on ${option.name}`}
            >
              <Icon className={sizeClasses[size].icon} />
            </button>
          )
        })}
        <button
          onClick={handleCopyLink}
          className={`${sizeClasses[size].button} ${copied ? "bg-emerald-600" : "bg-slate-600 hover:bg-slate-700"} rounded-lg flex items-center justify-center text-white transition-all hover:scale-105 shadow-md`}
          title={showTooltip ? (copied ? "Copied!" : "Copy link") : ""}
          aria-label="Copy link"
        >
          {copied ? <Check className={sizeClasses[size].icon} /> : <LinkIcon className={sizeClasses[size].icon} />}
        </button>
      </div>
    </div>
  )
}
