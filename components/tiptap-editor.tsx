"use client"

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { parseContent, stringifyContent } from "@/lib/tiptap-content"
import { useEffect, useState } from "react"

type TiptapEditorProps = {
  content?: string | object
  onChange?: (content: object) => void
  imageUploadHandler?: (file: File) => Promise<string>
  onError?: (error: Error) => void
}

export function TiptapEditor({
  content,
  onChange,
  imageUploadHandler,
  onError,
}: TiptapEditorProps) {
  const [editorContent, setEditorContent] = useState<object>(parseContent(content))

  // Parse the content once on initial load
  useEffect(() => {
    setEditorContent(parseContent(content))
  }, [content])

  const handleEditorChange = (jsonContent: string | object) => {
    try {
      // Parse the content if it's a string (HTML)
      const parsedContent = typeof jsonContent === 'string'
        ? JSON.parse(jsonContent)
        : jsonContent
        
      // Update local state
      setEditorContent(parsedContent)
      
      // Call the parent's onChange handler with the JSON object
      if (onChange) {
        onChange(parsedContent)
      }
    } catch (error) {
      console.error("Failed to parse editor content:", error)
      if (onError && error instanceof Error) {
        onError(error)
      }
    }
  }

  return (
    <SimpleEditor
      content={editorContent}
      onChange={handleEditorChange}
      imageUploadHandler={imageUploadHandler}
      onError={onError}
    />
  )
}
