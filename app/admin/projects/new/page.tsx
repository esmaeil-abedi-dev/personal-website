import { ProjectForm } from "@/components/admin/project-form"

export const metadata = {
  title: "New Project - Admin Panel",
  description: "Create a new portfolio project for your personal website",
}

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
      <ProjectForm />
    </div>
  )
}
