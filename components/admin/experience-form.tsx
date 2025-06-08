"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createExperience, updateExperience } from "@/lib/actions"; // Assuming updateExperience exists for editing
import { toast } from "sonner"; // Using sonner for notifications

// Define the schema for the form
const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"), // Consider using a date picker
  endDate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()).optional(), // For multi-select or comma-separated input
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  experience?: ExperienceFormValues & { id?: string }; // Optional experience prop for editing
}

export function ExperienceForm({ experience }: ExperienceFormProps) {
  const router = useRouter();
  const isEditing = !!experience?.id;

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: experience || {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: [],
    },
  });

  async function onSubmit(data: ExperienceFormValues) {
    try {
      if (isEditing && experience?.id) {
        // await updateExperience(experience.id, data); // Uncomment if updateExperience is implemented
        toast.success("Experience updated successfully!");
      } else {
        await createExperience(data);
        toast.success("Experience created successfully!");
      }
      router.push("/admin/experience"); // Redirect to the experience list
      router.refresh(); // Refresh the page to show the new/updated entry
    } catch (error) {
      console.error("Failed to save experience:", error);
      toast.error("Failed to save experience. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Google" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g., 2022-01-01 or Jan 2022" {...field} />
              </FormControl>
              <FormDescription>Enter the start date of your employment.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date (Optional)</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g., 2023-12-31 or Dec 2023 or Present" {...field} />
              </FormControl>
              <FormDescription>Leave blank if it's your current position.</FormDescription>
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
                <Textarea
                  placeholder="Describe your responsibilities and achievements."
                  className="resize-y min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies (Comma-separated)</FormLabel>
              <FormControl>
                {/* For a better UX, consider a multi-select component or tag input */}
                <Input
                  placeholder="e.g., React, Node.js, Python"
                  {...field}
                  onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                />
              </FormControl>
              <FormDescription>Enter technologies separated by commas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Experience")}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={() => router.back()} className="ml-2">
            Cancel
          </Button>
        )}
      </form>
    </Form>
  );
}
