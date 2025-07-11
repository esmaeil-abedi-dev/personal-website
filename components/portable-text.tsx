"use client"
import { useTheme } from "next-themes"
import { useEditor, EditorContent } from '@tiptap/react'
import { parseContent, isTiptapContent, safeContentParser } from '@/lib/tiptap-content'

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"
import { Link } from "@/components/tiptap-extension/link-extension"

export function PortableText({ value }: { value: any }) {
  const { theme } = useTheme()
  
  // Use the safe content parser for compatibility during migration
  const parsedContent = safeContentParser(value)
  
  // Create a read-only editor to render the content
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Link.configure({ openOnClick: true }),
    ],
    content: parsedContent,
  })

  if (!editor) {
    // If direct HTML is detected (before migration completes), render it directly
    if (typeof value === "string" && value.trim().startsWith("<")) {
      return <div dangerouslySetInnerHTML={{ __html: value }} />
    }
    return <div>Loading content...</div>
  }

  return (
    <div className="portable-text">
      <EditorContent editor={editor} />
    </div>
  )
}
