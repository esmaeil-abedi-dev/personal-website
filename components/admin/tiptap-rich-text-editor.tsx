"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import React, { useEffect } from "react";

interface TiptapRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TiptapRichTextEditor: React.FC<TiptapRichTextEditorProps> = ({
  value,
  onChange,
  className,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit options here if needed
        // For example, to disable certain features:
        // heading: { levels: [1, 2, 3] },
        // history: true,
        // bold: true,
        // italic: true,
        // listItem: true,
        // orderedList: true,
        // bulletList: true,
        // codeBlock: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();
      // Convert empty paragraph to empty string
      if (html === "<p></p>") {
        html = "";
      }
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Check if the new value is substantially different from the current content
      // to avoid unnecessary re-renders or cursor jumps.
      // A simple check for empty paragraph might be needed if value is ""
      const currentContent = editor.getHTML();
      if (value === "" && currentContent === "<p></p>") {
        // If value is empty and editor has default empty paragraph, do nothing
      } else {
        editor.commands.setContent(value, false); // false to not emit update
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
  }> = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 m-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
        isActive ? "bg-gray-300 dark:bg-gray-600" : "bg-gray-100 dark:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className={`border border-gray-300 dark:border-gray-700 rounded-md ${className}`}>
      <div className="toolbar p-1 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 flex flex-wrap items-center">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          I
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="H1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="H2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="H3"
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          UL
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          OL
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          Code
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Add Image">
          Img
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="p-2 min-h-[150px] prose dark:prose-invert max-w-full"/>
    </div>
  );
};

export default TiptapRichTextEditor;
