/**
 * Utilities for handling Tiptap JSON content throughout the application
 */

/**
 * Default empty document structure for Tiptap editor
 */
export const DEFAULT_EDITOR_CONTENT = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
      },
      content: [
        {
          type: "text",
          text: "",
        },
      ],
    },
  ],
}

/**
 * Safely parse content that might be stored as a JSON string or already as an object
 */
export function parseContent(content: string | object | null | undefined): object {
  if (!content) {
    return DEFAULT_EDITOR_CONTENT
  }
  
  if (typeof content === 'object') {
    return content
  }
  
  try {
    return JSON.parse(content)
  } catch (e) {
    console.error('Failed to parse editor content:', e)
    return DEFAULT_EDITOR_CONTENT
  }
}

/**
 * Safely stringify content that might be stored as a JSON string or as an object
 */
export function stringifyContent(content: object | string | null | undefined): string {
  if (!content) {
    return JSON.stringify(DEFAULT_EDITOR_CONTENT)
  }
  
  if (typeof content === 'string') {
    // Check if it's already a valid JSON string
    try {
      JSON.parse(content)
      return content
    } catch (e) {
      // If it's not valid JSON, return the default
      return JSON.stringify(DEFAULT_EDITOR_CONTENT)
    }
  }
  
  try {
    return JSON.stringify(content)
  } catch (e) {
    console.error('Failed to stringify editor content:', e)
    return JSON.stringify(DEFAULT_EDITOR_CONTENT)
  }
}

/**
 * Interface for the expected JSON structure of Tiptap content
 */
export interface TiptapContent {
  type: string
  content: any[]
}

/**
 * Type guard to check if an object conforms to the TiptapContent interface
 */
export function isTiptapContent(obj: any): obj is TiptapContent {
  return (
    obj &&
    typeof obj === 'object' &&
    'type' in obj &&
    obj.type === 'doc' &&
    'content' in obj &&
    Array.isArray(obj.content)
  )
}

/**
 * Safe content handler for transition between HTML and JSON storage
 * This function will handle both HTML strings and JSON objects safely
 * during the migration phase
 */
export function safeContentParser(content: any): object {
  // If content is already null/undefined, return default
  if (!content) {
    return DEFAULT_EDITOR_CONTENT
  }
  
  // If content is already an object, return it directly
  if (typeof content === 'object' && !Array.isArray(content)) {
    return content
  }
  
  // Try to parse as JSON string
  try {
    if (typeof content === 'string') {
      // If it starts with '<' it's likely HTML content
      if (content.trim().startsWith('<')) {
        // Convert HTML to a simple JSON document
        return {
          type: "doc",
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: null,
              },
              content: [
                {
                  type: "text",
                  text: content,
                },
              ],
            },
          ],
        }
      }
      
      // If it's a JSON string, parse it
      return JSON.parse(content)
    }
  } catch (e) {
    console.error('Failed to parse content:', e)
    
    // If parsing fails, create a simple document with the content as text
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              type: "text",
              text: typeof content === 'string' ? content : String(content),
            },
          ],
        },
      ],
    }
  }
  
  // Fallback to default content
  return DEFAULT_EDITOR_CONTENT
}
