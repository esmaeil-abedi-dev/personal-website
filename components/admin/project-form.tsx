"use client"

import { Badge } from "@/components/ui/badge"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { ImageUpload } from "@/components/admin/image-upload"
import { createProject, updateProject } from "@/lib/actions"
import { slugify } from "@/lib/utils"

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title must be less than 100 characters."),
  slug: z
    .string()
    .min(5, "Slug must be at least 5 characters.")
    .max(100, "Slug must be less than 100 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(300, "Description must be less than 300 characters."),
  content: z.string().min(50, "Content must be at least 50 characters."),
  image: z.string().optional(),
  demoUrl: z
    .string()
    .optional()
    .refine((val) => !val || urlRegex.test(val), {
      message: "Please enter a valid URL.",
    }),
  githubUrl: z
    .string()
    .optional()
    .refine((val) => !val || urlRegex.test(val), {
      message: "Please enter a valid URL.",
    })
    .refine((val) => !val || val.includes("github.com"), {
      message: "GitHub URL must contain 'github.com'.",
    }),
  technologies: z.array(z.string()).min(1, "At least one technology is required."),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
})

export function ProjectForm({ project = null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || [])
  const [newTech, setNewTech] = useState("")
  const [validationErrors, setValidationErrors] = useState([])
  const [autoSlug, setAutoSlug] = useState(!project?.slug)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: project
      ? {
          ...project,
        }
      : {
          title: "",
          slug: "",
          description: "",
          content: "",
          image: "",
          demoUrl: "",
          githubUrl: "",
          technologies: [],
          featured: false,
          order: 0,
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

  // Validate content
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
    if (!content.includes("<img") && form.watch("image") === "") {
      errors.push("Projects should include at least one image (either main image or in content).")
    }

    // Check for technologies
    if (technologies.length === 0) {
      errors.push("At least one technology should be added.")
    }

    setValidationErrors(errors)
  }, [form.watch("content"), form.watch("image"), technologies])

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      const updatedTechnologies = [...technologies, newTech.trim()]
      setTechnologies(updatedTechnologies)
      form.setValue("technologies", updatedTechnologies)
      setNewTech("")
    }
  }

  const removeTechnology = (tech: string) => {
    const updatedTechnologies = technologies.filter((t) => t !== tech)
    setTechnologies(updatedTechnologies)
    form.setValue("technologies", updatedTechnologies)
  }

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      if (project) {
        await updateProject(project.id, values)
      } else {
        await createProject(values)
      }
      router.push("/admin/projects")
      router.refresh()
    } catch (error) {
      console.error("Error saving project:", error)
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
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description of the project" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>A short summary that appears in project listings</FormDescription>
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Image</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    This image will be displayed at the top of your project and in listings
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
                    <Input placeholder="project-slug" {...field} readOnly={autoSlug} />
                  </FormControl>
                  <FormDescription>The URL-friendly version of the title</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="demoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://demo-url.com" {...field} />
                    </FormControl>
                    <FormDescription>Link to the live demo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repo" {...field} />
                    </FormControl>
                    <FormDescription>Link to the GitHub repository</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a technology"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTechnology()
                        }
                      }}
                    />
                    <Button type="button" onClick={addTechnology}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                        {tech}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeTechnology(tech)}
                        >
                          <span className="sr-only">Remove {tech}</span>
                          &times;
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  {technologies.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">Add at least one technology</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Project</FormLabel>
                      <FormDescription>Featured projects are highlighted on the portfolio page</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>Lower numbers appear first</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || validationErrors.length > 0}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
