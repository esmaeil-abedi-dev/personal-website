"use client"

import { JsonContentRenderer } from "./json-content-renderer"

export function PortableText({ value }: { value: any }) {
  // Handle JSON content (new format)
  if (typeof value === "object" && value !== null) {
    return <JsonContentRenderer content={value} className="prose prose-gray dark:prose-invert max-w-none" />
  }

  // Handle string content (backward compatibility)
  if (typeof value === "string") {
    return <div className="prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
  }

  // Default fallback
  return <div>No content available</div>
}
