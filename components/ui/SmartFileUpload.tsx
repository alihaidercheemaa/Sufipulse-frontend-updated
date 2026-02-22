"use client"

import React from "react"
import { Upload, X, File, Image, FileText, Music, Video } from "lucide-react"

export interface SmartFileUploadProps {
  value?: File | null
  previewUrl?: string
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
  label?: string
  description?: string
  icon?: "image" | "file" | "audio" | "video" | "document"
  className?: string
  disabled?: boolean
}

export const SmartFileUpload: React.FC<SmartFileUploadProps> = ({
  value,
  previewUrl,
  onChange,
  accept,
  maxSize = 5,
  label,
  description,
  icon = "file",
  className = "",
  disabled = false,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    onChange(file)
  }

  const handleRemove = () => {
    onChange(null)
  }

  const getIcon = () => {
    switch (icon) {
      case "image":
        return <Image className="w-8 h-8" />
      case "audio":
        return <Music className="w-8 h-8" />
      case "video":
        return <Video className="w-8 h-8" />
      case "document":
        return <FileText className="w-8 h-8" />
      default:
        return <File className="w-8 h-8" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}

      {value ? (
        <div className="relative rounded-lg border border-slate-200 overflow-hidden">
          {previewUrl && icon === "image" ? (
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-slate-50">
              <div className="text-slate-400">{getIcon()}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{value.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(value.size)}</p>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <label
          className={`
            flex flex-col items-center justify-center w-full h-48
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors duration-200
            ${disabled
              ? "border-slate-200 bg-slate-50 cursor-not-allowed"
              : "border-slate-300 hover:border-emerald-500 hover:bg-emerald-50"}
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="text-slate-400 mb-2">{getIcon()}</div>
            <p className="mb-2 text-sm text-slate-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">
              Max file size: {maxSize}MB {accept && `• ${accept}`}
            </p>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </label>
      )}
    </div>
  )
}

export default SmartFileUpload
