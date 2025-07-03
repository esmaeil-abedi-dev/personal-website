"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createPost, updatePost } from "@/lib/actions"
import { slugify } from "@/lib/utils"
import { MultiSelect } from "./multi-select"
import { ImageUpload } from "./image-upload"
import TiptapRichTextEditor from "./tiptap-rich-text-editor"

interface PostFormProps {
  post?: any
  categories: any[]
}

export function PostForm({ post, categories }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || { type: "doc", content: [] }, // Initialize as JSON
    mainImage: post?.mainImage || "",
    status: post?.status || "draft",
    publishedAt: post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "",
    readingTime: post?.readingTime || 5,
    categories: post?.categories?.map((cat: any) => cat.id) || [],
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !post) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(formData.title),
      }))
    }
  }, [formData.title, post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = {
        ...formData,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
      }

      if (post) {
        await updatePost(post.id, data)
      } else {
        await createPost(data)
      }

      router.push("/admin/posts")
      router.refresh()
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Error saving post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContentChange = (content: any) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{post ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Main Image</Label>
            <ImageUpload
              value={formData.mainImage}
              onChange={(url) => setFormData((prev) => ({ ...prev, mainImage: url }))}
            />
          </div>

          <div>
            <Label>Content</Label>
            <TiptapRichTextEditor value={formData.content} onChange={handleContentChange} className="min-h-[400px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="publishedAt">Published At</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={formData.publishedAt}
                onChange={(e) => setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="readingTime">Reading Time (minutes)</Label>
              <Input
                id="readingTime"
                type="number"
                value={formData.readingTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, readingTime: Number.parseInt(e.target.value) || 5 }))
                }
              />
            </div>
          </div>

          <div>
            <Label>Categories</Label>
            <MultiSelect
              options={categories.map((cat) => ({ value: cat.id, label: cat.title }))}
              value={formData.categories}
              onChange={(categories) => setFormData((prev) => ({ ...prev, categories }))}
              placeholder="Select categories..."
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : post ? "Update Post" : "Create Post"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
