"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { cn } from "@/lib/utils";

// Define the props interface
interface QuillRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// It's good practice to define modules and formats outside the component
// to prevent re-creation on every render, unless they depend on props.
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "code-block"],
    ["clean"], // remove formatting button
  ],
  // Consider adding syntax highlighting for code blocks if needed later
  // syntax: true, // Example: if using quill-syntax module
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "code-block",
];

export function QuillRichTextEditor({
  value,
  onChange,
  className,
}: QuillRichTextEditorProps) {
  // Use useEffect to handle server-side rendering and client-side hydration mismatch
  // ReactQuill relies on browser APIs which are not available on the server.
  const [isClient, setIsClient] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a placeholder or null on the server
    // You could also render a div with the initial HTML content if needed,
    // but it won't be interactive until the client hydrates.
    return (
      <div
        className={cn("border rounded-md p-4 min-h-[200px]", className)}
        ref={ref.current}
        defaultValue={value}
      />
    );
  }

  const handleEditorChange = (
    content: string,
    delta: any,
    source: string,
    editor: any
  ) => {
    // Quill's onChange provides the HTML content directly if valueType is 'html' (default)
    // However, an empty editor might return '<p><br></p>'. Handle this if you want to store an empty string.
    if (content === "<p><br></p>") {
      onChange("");
    } else {
      onChange(content);
    }
  };

  return (
    <div className={cn("border rounded-md", className)}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        className="bg-background text-foreground" // Basic styling for theme compatibility
        style={{ minHeight: "200px" }} // Ensure editor has some default height
      />
    </div>
  );
}

// You might need to register custom formats or modules with Quill if you extend it further.
// For example, if you wanted custom image handling or custom code block languages:
// import ImageResize from 'quill-image-resize-module-react';
// Quill.register('modules/imageResize', ImageResize);
// Or for code syntax highlighting:
// import hljs from 'highlight.js';
// hljs.configure({ languages: ['javascript', 'python', 'java', 'typescript', 'html', 'css', 'json', 'bash'] });
// const codeBlockModules = {
//   toolbar: [ /* existing toolbar options */ , ['code-block'] ],
//   syntax: {
//     highlight: (text: string) => hljs.highlightAuto(text).value,
//   },
// };
