import { NewsletterForm } from "@/components/newsletter-form"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Newsletter - John Doe",
  description: "Subscribe to my newsletter for updates on new blog posts, projects, and more.",
})

export default function NewsletterPage() {
  return (
    <main className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Newsletter</h1>
          <p className="text-muted-foreground mt-2">Subscribe to get updates on new blog posts, projects, and more.</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <NewsletterForm />
        </div>
      </div>
    </main>
  )
}
