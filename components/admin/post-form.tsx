"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { MultiSelect } from "@/components/admin/multi-select"
import { ImageUpload } from "@/components/admin/image-upload"
import { createPost, updatePost } from "@/lib/actions"
import { slugify } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title must be less than 100 characters."),
  slug: z
    .string()
    .min(5, "Slug must be at least 5 characters.")
    .max(100, "Slug must be less than 100 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens."),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters.")
    .max(200, "Excerpt must be less than 200 characters."),
  content: z.string().min(50, "Content must be at least 50 characters."),
  mainImage: z.string().optional(),
  categories: z.array(z.string()).min(1, "At least one category is required."),
  status: z.enum(["draft", "published"]),
  publishedAt: z
    .string()
    .optional()
    .refine((val) => !val || new Date(val) <= new Date(), {
      message: "Publication date cannot be in the future.",
    })
    .refine((val) => !val || !isNaN(new Date(val).getTime()), {
      message: "Invalid date format.",
    }),
  readingTime: z.coerce
    .number()
    .int()
    .min(1, "Reading time must be at least 1 minute.")
    .max(60, "Reading time must be less than 60 minutes."),
})

export function PostForm({ post = null, categories = [] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [validationErrors, setValidationErrors] = useState([])
  const [autoSlug, setAutoSlug] = useState(!post?.slug)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: post
      ? {
          ...post,
          categories: post.categories?.map((cat) => cat.id) || [],
          publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : "",
          content: post.content || "",
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          mainImage: "",
          categories: [],
          status: "draft",
          publishedAt: "",
          readingTime: 5,
        },
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug) {
      const title = form.watch("title")
      if (title) {
        form.setValue("slug", slugify(title))
      }
    }
  }, [form.watch("title"), autoSlug, form])

  // Validate content length
  useEffect(() => {
    const content = form.watch("content")
    const errors = []

    if (content) {
      // Check for minimum content length (excluding HTML tags)
      const textContent = content.replace(/<[^>]*>/g, "")
      if (textContent.length < 50) {
        errors.push("Content text should be at least 50 characters.")
      }
    }

    // Check for images
    if (!content.includes("<img") && form.watch("status") === "published") {
      errors.push("Published posts should include at least one image.")
    }

    // Check for headings
    if (!content.includes("<h2") && !content.includes("<h3") && content.length > 500) {
      errors.push("Longer posts should include headings (h2 or h3) for better readability.")
    }

    setValidationErrors(errors)
  }, [form.watch("content"), form.watch("status"), form])

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      if (post) {
        await updatePost(post._id, values)
      } else {
        await createPost(values)
      }
      router.push("/admin/posts")
      router.refresh()
    } catch (error) {
      console.error("Error saving post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief summary of the post" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>A short summary that appears in blog listings (max 200 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Card>
                      <CardContent className="p-0">
                        <RichTextEditor value={field.value} onChange={field.onChange} />
                      </CardContent>
                    </Card>
                  </FormControl>
                  <FormMessage />
                  {validationErrors.length > 0 && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Content validation</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="media" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="mainImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Image</FormLabel>
                  <FormControl>
                    <ImageUpload key={field.value || 'empty'} value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    This image will be displayed at the top of your post and in listings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="settings" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Slug</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAutoSlug(!autoSlug)
                        if (!autoSlug) {
                          form.setValue("slug", slugify(form.getValues("title")))
                        }
                      }}
                    >
                      {autoSlug ? "Manual" : "Auto-generate"}
                    </Button>
                  </div>
                  <FormControl>
                    <Input placeholder="post-slug" {...field} readOnly={autoSlug} />
                  </FormControl>
                  <FormDescription>The URL-friendly version of the title</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={categories.map((cat) => ({
                        label: cat.title,
                        value: cat.id,
                      }))}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="readingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reading Time (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} max={new Date().toISOString().split("T")[0]} />
                  </FormControl>
                  <FormDescription>Leave empty for drafts. Cannot be in the future.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/posts")}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || (validationErrors.length > 0 && form.watch("status") === "published")}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {post ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
