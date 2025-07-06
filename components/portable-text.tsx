"use client"
import { useTheme } from "next-themes"

export function PortableText({ value }: { value: any }) {
  const { theme } = useTheme()

  // If value is a string (from database), render it as HTML
  if (typeof value === "string") {
    return <div dangerouslySetInnerHTML={{ __html: value }} />
  }

  // If value is an array (from Sanity), use the previous implementation
  if (Array.isArray(value)) {
    // This would be the previous Sanity implementation
    // Since we're removing Sanity, this code path won't be used anymore
    return <div>Content not available in this format</div>
  }

  // Default fallback
  return <div>No content available</div>
}
