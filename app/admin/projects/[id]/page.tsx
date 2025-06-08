import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProjectForm } from "@/components/admin/project-form"

export const metadata = {
  title: "Edit Project - Admin Panel",
  description: "Edit a portfolio project for your personal website",
}

async function getProjectById(id: string) {
  try {
    return await prisma.project.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error)
    return null
  }
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  )
}
