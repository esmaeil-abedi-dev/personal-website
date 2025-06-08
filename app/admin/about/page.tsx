import { getAboutPage } from "@/lib/admin"
import { AboutForm } from "@/components/admin/about-form"

export const metadata = {
  title: "Manage About Page - Admin Panel",
  description: "Edit your about page content",
}

export default async function AboutPage() {
  const about = await getAboutPage()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">About Page</h1>
      <AboutForm about={about} />
    </div>
  )
}
