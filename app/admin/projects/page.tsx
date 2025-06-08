import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectsTable } from "@/components/admin/projects-table"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Manage Projects - Admin Panel",
  description: "Manage portfolio projects for your personal website",
}

async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }, { updatedAt: "desc" }],
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Projects</h1>
        <Link href="/admin/projects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  )
}
