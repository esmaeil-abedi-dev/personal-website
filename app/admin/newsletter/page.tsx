import { prisma } from "@/lib/prisma"
import { NewsletterSubscribersTable } from "@/components/admin/newsletter-subscribers-table"

export const metadata = {
  title: "Manage Newsletter - Admin Panel",
  description: "Manage newsletter subscribers for your personal website",
}

async function getSubscribers() {
  try {
    return await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    return []
  }
}

export default async function NewsletterPage() {
  const subscribers = await getSubscribers()
  const activeSubscribers = subscribers.filter((sub) => sub.active)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
        <div className="text-sm text-muted-foreground">{activeSubscribers.length} active subscribers</div>
      </div>
      <NewsletterSubscribersTable subscribers={subscribers} />
    </div>
  )
}
