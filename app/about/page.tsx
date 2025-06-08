import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { PortableText } from "@/components/portable-text"

export const metadata = {
  title: "About - John Doe",
  description: "Learn more about John Doe, software developer and writer.",
}

export default async function AboutPage() {
  let about = {
    image: null,
    shortBio: "Software developer passionate about creating beautiful and functional web applications.",
    fullBio: [],
  }

  try {
    const aboutData = await prisma.about.findUnique({
      where: { id: "1" },
    })

    if (aboutData) {
      about = aboutData
    }
  } catch (error) {
    console.error("Error fetching about page data:", error)
  }

  return (
    <main className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center mb-12">
          <div className="w-full md:w-1/3">
            <div className="relative aspect-square overflow-hidden rounded-full border-4 border-primary/20">
              <Image
                src={about?.image || "/placeholder.svg?height=300&width=300"}
                alt="John Doe"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Me</h1>
            <div className="text-xl text-muted-foreground">{about?.shortBio || "Welcome to my personal website."}</div>
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          {about?.fullBio ? (
            <PortableText value={about.fullBio} />
          ) : (
            <p>
              I'm a passionate software developer with expertise in modern web technologies. I love building
              user-friendly applications and sharing my knowledge through writing and open-source contributions.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
