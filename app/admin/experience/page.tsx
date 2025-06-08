import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExperienceTable } from "@/components/admin/experience-table"
import { getExperiences } from "@/lib/admin"

export const metadata = {
  title: "Manage Experience - Admin Panel",
  description: "Manage work experience entries for your personal website",
}

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Work Experience</h1>
        <Link href="/admin/experience/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>
      <ExperienceTable experiences={experiences} />
    </div>
  )
}
