import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SkillsTable } from "@/components/admin/skills-table"
import { getSkills } from "@/lib/admin"

export const metadata = {
  title: "Manage Skills - Admin Panel",
  description: "Manage skills and skill categories for your personal website",
}

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
        <Link href="/admin/skills/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </Link>
      </div>
      <SkillsTable skills={skills} />
    </div>
  )
}
