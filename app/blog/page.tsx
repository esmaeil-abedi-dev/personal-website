import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

export const metadata = {
  title: "Blog - John Doe",
  description:
    "Read my latest articles on software development, design, and more.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const categorySlug = searchParams?.category;

  // Fetch all categories
  let categories = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: {
        title: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Fetch posts with optional category filter
  let posts = [];
  try {
    if (categorySlug) {
      const category = await prisma.category.findFirst({
        where: { slug: categorySlug },
      });

      if (category) {
        posts = await prisma.post.findMany({
          where: {
            status: "published",
            publishedAt: {
              lte: new Date(),
            },
            categories: {
              some: {
                id: category.id,
              },
            },
          },
          orderBy: {
            publishedAt: "desc",
          },
          include: {
            categories: true,
          },
        });
      }
    } else {
      posts = await prisma.post.findMany({
        where: {
          status: "published",
          publishedAt: {
            lte: new Date(),
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        include: {
          categories: true,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  return (
    <main className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            My Blog
          </h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Thoughts, ideas, and insights on software development, design, and
            more.
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading results...</div>}>
        <div className="flex flex-wrap gap-2 justify-center mt-8">
          <Link href="/blog">
            <Button
              variant="outline"
              size="sm"
              className={
                !categorySlug ? "bg-primary text-primary-foreground" : ""
              }
            >
              All
            </Button>
          </Link>
          {categories &&
            categories.length > 0 &&
            categories.map((cat) => (
              <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    categorySlug === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  {cat.title}
                </Button>
              </Link>
            ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
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
                    <div className="flex flex-wrap gap-2">
                      {post.categories?.map((category) => (
                        <Badge key={category.id} variant="secondary">
                          {category.title}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="font-bold text-xl">{post.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {post.readingTime} min read
                      </p>
                    </div>
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
      </Suspense>
    </main>
  );
}
