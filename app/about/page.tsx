import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PortableText } from "@/components/portable-text";
import type { About } from "@prisma/client";

export const metadata = {
  title: "About - Esmaeil Abedi",
  description: "Learn more about Esmaeil Abedi, software developer and writer.",
};

export default async function AboutPage() {
  let about: About = {
    id: "1", // Default ID
    updatedAt: new Date(), // Default date
    image: null,
    shortBio:
      "Software developer passionate about creating beautiful and functional web applications.",
    fullBio: JSON.stringify([{ _type: "block", children: [{ _type: "span", text: "Default full bio if not found." }] }]), // Default empty Portable Text structure
  };

  try {
    const aboutData = await prisma.about.findUnique({
      where: { id: "1" },
    });

    if (aboutData) {
      about = aboutData;
    }
  } catch (error) {
    console.error("Error fetching about page data:", error);
  }

  // Ensure fullBio is parsed if it's a string
  const parsedFullBio = typeof about.fullBio === 'string' ? JSON.parse(about.fullBio) : about.fullBio;

  return (
    <main className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center mb-12">
          <div className="w-full md:w-1/3">
            <div className="relative aspect-square overflow-hidden rounded-full border-4 border-primary/20">
              <Image
                src={about?.image || "/placeholder.svg?height=300&width=300"}
                alt="Esmaeil Abedi"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              About Me
            </h1>
            <div className="text-xl text-muted-foreground">
              {about?.shortBio || "Welcome to my personal website."}
            </div>
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          {parsedFullBio ? (
            <PortableText value={parsedFullBio} />
          ) : (
            <p>
              I'm a passionate software developer with expertise in modern web
              technologies. I love building user-friendly applications and
              sharing my knowledge through writing and open-source
              contributions.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
