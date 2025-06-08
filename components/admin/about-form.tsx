"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { QuillRichTextEditor } from "@/components/admin/quill-rich-text-editor"
import { ImageUpload } from "@/components/admin/image-upload"
import { updateAboutPage } from "@/lib/actions"

const formSchema = z.object({
  shortBio: z.string().min(1, "Short bio is required").max(300, "Short bio must be less than 300 characters"),
  fullBio: z.any(),
  image: z.string().optional(),
})

export function AboutForm({ about = null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: about || {
      shortBio: "",
      fullBio: "",
      image: "",
    },
  })

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      await updateAboutPage(values)
      router.refresh()
    } catch (error) {
      console.error("Error saving about page:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <FormField
              control={form.control}
              name="shortBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief introduction" className="resize-none h-32" {...field} />
                  </FormControl>
                  <FormDescription>
                    A brief introduction that appears at the top of your about page (max 300 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>Your profile picture for the about page</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="fullBio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Bio</FormLabel>
                <FormControl>
                  <Card>
                    <CardContent className="p-0">
                      <QuillRichTextEditor value={field.value ?? ""} onChange={field.onChange} />
                    </CardContent>
                  </Card>
                </FormControl>
                <FormDescription>
                  Your complete biography with details about your background, interests, and career
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
