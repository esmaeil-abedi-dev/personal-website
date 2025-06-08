import type React from "react"
import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const metadata = {
  title: "Admin Panel - John Doe",
  description: "Content management system for John Doe's personal website",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession()

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
