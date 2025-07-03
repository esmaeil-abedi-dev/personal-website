import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroAnimation } from "@/components/hero-animation";
import { NewsletterSection } from "@/components/newsletter-section";
import { prisma } from "@/lib/prisma";
import type { Post, Category } from "@prisma/client";

// Define the type for posts fetched with categories
type PostWithCategories = Post & { categories: Category[] };

export default async function Home() {
  // Fetch latest posts from the database
  let latestPosts: PostWithCategories[] = [];
  try {
    latestPosts = await prisma.post.findMany({
      where: {
        status: "published",
        publishedAt: {
          lte: new Date(),
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 3,
      include: {
        categories: true,
      },
    });
  } catch (error) {
    console.error("Error fetching latest posts:", error);
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Hi, I'm <span className="text-primary">Esmaeil Abedi</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  I'm a software developer passionate about building beautiful,
                  functional, and user-friendly applications.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/about">
                  <Button className="w-full min-[400px]:w-auto">
                    Learn more about me
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button
                    variant="outline"
                    className="w-full min-[400px]:w-auto"
                  >
                    Read my blog
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link href="mailto:contact@example.com">
                  <Button variant="ghost" size="icon">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Latest Articles
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Check out my most recent blog posts on software development,
                design, and more.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3 mt-8">
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="space-y-3 rounded-lg border bg-background p-4 transition-all hover:shadow-md">
                    <div className="overflow-hidden rounded-lg">
                      <Image
                        src={
                          post.mainImage ||
                          "/placeholder.svg?height=200&width=400"
                        }
                        alt={post.title}
                        width={400}
                        height={200}
                        className="aspect-video object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      {post.publishedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">
                  No blog posts found. Check back soon!
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/blog">
              <Button variant="outline">
                View all articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Preview */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                My Experience
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I've worked with various technologies and companies throughout
                my career.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl mt-8">
            <div className="space-y-8">
              <div className="flex flex-col gap-2 rounded-lg border p-6 transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Senior Developer</h3>
                  <p className="text-sm text-muted-foreground">
                    2020 - Present
                  </p>
                </div>
                <p className="text-muted-foreground">Tech Company Inc.</p>
                <p>
                  Led development of multiple web applications using React,
                  Next.js, and Node.js.
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border p-6 transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Frontend Developer</h3>
                  <p className="text-sm text-muted-foreground">2018 - 2020</p>
                </div>
                <p className="text-muted-foreground">Digital Agency Ltd.</p>
                <p>
                  Developed responsive websites and applications for various
                  clients.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/experience">
                <Button variant="outline">
                  View full experience
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Contact CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Get in Touch
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have a project in mind or just want to chat? Feel free to reach
                out.
              </p>
            </div>
            <Link href="/contact">
              <Button size="lg">
                Contact Me
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
