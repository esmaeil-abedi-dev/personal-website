import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Github, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PortableText } from "@/components/portable-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const project = await prisma.project.findFirst({
      where: { slug: params.slug },
    });

    if (!project) {
      return constructMetadata({
        title: "Project Not Found",
        description: "The requested project could not be found.",
      });
    }

    return constructMetadata({
      title: `${project.title} - Esmaeil Abedi's Portfolio`,
      description: project.description,
      url: `/portfolio/${project.slug}`,
      ogImage: project.image ?? undefined, // Ensure string | undefined
      type: "article",
      tags: project.technologies,
    });
  } catch (error) {
    console.error(
      `Error generating metadata for project with slug ${params.slug}:`,
      error
    );
    return constructMetadata({
      title: "Error Loading Project",
      description: "There was an error loading this project.",
    });
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const project = await prisma.project.findFirst({
      where: { slug: params.slug },
    });

    if (!project) {
      notFound();
    }

    // Generate JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      image: project.image ?? undefined,
      dateCreated: project.createdAt.toISOString(),
      dateModified:
        project.updatedAt?.toISOString() || project.createdAt.toISOString(),
      author: {
        "@type": "Person",
        name: "Esmaeil Abedi",
        url: "https://yourdomain.com/about",
      },
      keywords: project.technologies.join(", "),
      url: `https://yourdomain.com/portfolio/${project.slug}`,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl">
            <Link href="/portfolio">
              <Button variant="ghost" className="mb-8 pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all projects
              </Button>
            </Link>

            <div className="space-y-2 mb-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {project.description}
              </p>
            </div>

            {project.image && (
              <div className="mb-8 overflow-hidden rounded-lg">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={1200}
                  height={630}
                  className="aspect-video object-cover"
                  priority
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-12">
              {project.demoUrl && (
                <Link
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <Globe className="mr-2 h-4 w-4" />
                    Live Demo
                  </Button>
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </Button>
                </Link>
              )}
            </div>

            <article className="prose prose-gray dark:prose-invert max-w-none">
              <PortableText value={project.content} />
            </article>
          </div>
        </main>
      </>
    );
  } catch (error) {
    console.error(`Error loading project with slug ${params.slug}:`, error);
    return (
      <main className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Error Loading Project
          </h1>
          <p className="mt-4 text-muted-foreground">
            There was an error loading this project. Please try again later.
          </p>
          <Link href="/portfolio" className="mt-8 inline-block">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all projects
            </Button>
          </Link>
        </div>
      </main>
    );
  }
}
