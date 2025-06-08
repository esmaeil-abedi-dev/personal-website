import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Suspense } from "react";

export const metadata = {
  title: "Portfolio - Esmaeil Abedi",
  description:
    "Explore Esmaeil Abedi's portfolio of software development projects.",
};

export default async function PortfolioPage() {
  let projects = [];

  try {
    projects = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <main className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            My Portfolio
          </h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Check out some of my recent projects and work.
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading Feature Projects results...</div>}>
        {/* Featured Projects */}
        {projects.some((project) => project.featured) && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Featured Projects</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {projects
                .filter((project) => project.featured)
                .map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={
                          project.image ||
                          "/placeholder.svg?height=400&width=600"
                        }
                        alt={project.title}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full transition-transform hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 pb-6 pt-0 flex gap-4">
                      <Link href={`/portfolio/${project.slug}`}>
                        <Button>
                          View Project
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <div className="flex gap-2">
                        {project.demoUrl && (
                          <Link
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="icon">
                              <Globe className="h-4 w-4" />
                              <span className="sr-only">Live Demo</span>
                            </Button>
                          </Link>
                        )}
                        {project.githubUrl && (
                          <Link
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="icon">
                              <Github className="h-4 w-4" />
                              <span className="sr-only">GitHub</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </section>
        )}
      </Suspense>

      {/* All Projects */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8">All Projects</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<div>Loading All Projects results...</div>}>
            {projects.length > 0 ? (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group"
                >
                  <Card className="h-full overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={
                          project.image ||
                          "/placeholder.svg?height=300&width=500"
                        }
                        alt={project.title}
                        width={500}
                        height={300}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">
                  No projects found. Check back soon!
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </main>
  );
}
