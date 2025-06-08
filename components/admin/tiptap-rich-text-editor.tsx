"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import React, { useEffect } from "react";
import { SimpleEditor } from "./editor";

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
        isActive
          ? "bg-gray-300 dark:bg-gray-600"
          : "bg-gray-100 dark:bg-gray-800"
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

  return <SimpleEditor />;
};

export default TiptapRichTextEditor;
