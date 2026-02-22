"use client"

interface LoadingStateProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function LoadingState({ message = "Loading...", size = "md", className = "" }: LoadingStateProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <div
          className={`${sizeClasses[size]} border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}
        ></div>
        <p className="text-slate-600 font-medium">{message}</p>
      </div>
    </div>
  )
}
