"use client"
import Image from "next/image"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface ContentBlock {
  type: string
  content?: any
  attrs?: any
  marks?: any[]
}

interface JsonContentRendererProps {
  content: any
  className?: string
}

export function JsonContentRenderer({ content, className = "" }: JsonContentRendererProps) {
  if (!content) {
    return <div className={className}>No content available</div>
  }

  // Handle different content formats
  if (typeof content === "string") {
    // If it's a string, render as HTML (backward compatibility)
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
  }

  if (Array.isArray(content)) {
    // If it's an array of blocks, render each block
    return (
      <div className={className}>
        {content.map((block, index) => (
          <ContentBlock key={index} block={block} />
        ))}
      </div>
    )
  }

  if (content.type === "doc" && content.content) {
    // TipTap JSON format
    return (
      <div className={className}>
        {content.content.map((block: any, index: number) => (
          <ContentBlock key={index} block={block} />
        ))}
      </div>
    )
  }

  // Fallback for unknown formats
  return <div className={className}>Content format not supported</div>
}

function ContentBlock({ block }: { block: any }) {
  if (!block || !block.type) {
    return null
  }

  switch (block.type) {
    case "paragraph":
      return (
        <p className="mb-4">
          {block.content?.map((inline: any, index: number) => (
            <InlineContent key={index} content={inline} />
          ))}
        </p>
      )

    case "heading":
      const level = block.attrs?.level || 1
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
      const headingClasses = {
        1: "text-4xl font-bold mb-6 mt-8",
        2: "text-3xl font-semibold mb-5 mt-7",
        3: "text-2xl font-semibold mb-4 mt-6",
        4: "text-xl font-semibold mb-3 mt-5",
        5: "text-lg font-semibold mb-2 mt-4",
        6: "text-base font-semibold mb-2 mt-3",
      }

      return (
        <HeadingTag className={headingClasses[level as keyof typeof headingClasses]}>
          {block.content?.map((inline: any, index: number) => (
            <InlineContent key={index} content={inline} />
          ))}
        </HeadingTag>
      )

    case "bulletList":
      return (
        <ul className="list-disc list-inside mb-4 ml-4">
          {block.content?.map((item: any, index: number) => (
            <ContentBlock key={index} block={item} />
          ))}
        </ul>
      )

    case "orderedList":
      return (
        <ol className="list-decimal list-inside mb-4 ml-4">
          {block.content?.map((item: any, index: number) => (
            <ContentBlock key={index} block={item} />
          ))}
        </ol>
      )

    case "listItem":
      return (
        <li className="mb-1">
          {block.content?.map((content: any, index: number) => (
            <ContentBlock key={index} block={content} />
          ))}
        </li>
      )

    case "blockquote":
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4 text-gray-600 dark:text-gray-400">
          {block.content?.map((content: any, index: number) => (
            <ContentBlock key={index} block={content} />
          ))}
        </blockquote>
      )

    case "codeBlock":
      return (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto">
          <code className="text-sm">
            {block.content?.map((inline: any, index: number) => (
              <InlineContent key={index} content={inline} />
            ))}
          </code>
        </pre>
      )

    case "image":
      return (
        <div className="mb-4">
          <Image
            src={block.attrs?.src || "/placeholder.svg"}
            alt={block.attrs?.alt || "Image"}
            width={block.attrs?.width || 800}
            height={block.attrs?.height || 400}
            className="rounded-lg max-w-full h-auto"
          />
          {block.attrs?.title && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">{block.attrs.title}</p>
          )}
        </div>
      )

    case "hardBreak":
      return <br />

    case "horizontalRule":
      return <hr className="my-6 border-gray-300 dark:border-gray-600" />

    default:
      // Handle unknown block types
      return (
        <div className="mb-4">
          {block.content?.map((content: any, index: number) => (
            <ContentBlock key={index} block={content} />
          ))}
        </div>
      )
  }
}

function InlineContent({ content }: { content: any }) {
  if (!content) return null

  if (content.type === "text") {
    const text = content.text || ""
    let element = <span>{text}</span>

    // Apply marks (formatting)
    if (content.marks) {
      content.marks.forEach((mark: any) => {
        switch (mark.type) {
          case "bold":
            element = <strong>{element}</strong>
            break
          case "italic":
            element = <em>{element}</em>
            break
          case "underline":
            element = <u>{element}</u>
            break
          case "strike":
            element = <s>{element}</s>
            break
          case "code":
            element = <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">{element}</code>
            break
          case "link":
            element = (
              <a
                href={mark.attrs?.href}
                target={mark.attrs?.target}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {element}
              </a>
            )
            break
          case "highlight":
            element = (
              <mark className="px-1 py-0.5 rounded" style={{ backgroundColor: mark.attrs?.color || "#ffff00" }}>
                {element}
              </mark>
            )
            break
        }
      })
    }

    return element
  }

  // Handle other inline content types
  return <span>{content.text || ""}</span>
}
