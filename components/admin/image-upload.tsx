"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadImage } from "@/lib/actions"
import React from "react"

interface ImageUploadProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      const imageUrl = await uploadImage(file)

      clearInterval(interval)
      setUploadProgress(100)
      onChange(imageUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border">
          <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          <Button variant="destructive" size="icon" className="absolute right-2 top-2" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
          {isUploading ? (
            <div className="w-full space-y-2">
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <>
              <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
              <p className="mb-2 text-sm font-medium">Drag and drop or click to upload</p>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF, max 10MB</p>
              <Input type="file" accept="image/*" className="hidden" id="image-upload" onChange={handleFileChange} />
              <label htmlFor="image-upload">
                <Button variant="secondary" className="mt-4" asChild>
                  <span>Select Image</span>
                </Button>
              </label>
            </>
          )}
        </div>
      )}
    </div>
  )
}
