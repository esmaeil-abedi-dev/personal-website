import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
    const post = await prisma.post.findFirst({
      where: {
        slug: params.slug,
        status: "published",
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        categories: true,
      },
    });

    if (!post) {
      return constructMetadata({
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      });
    }

    return constructMetadata({
      title: `${post.title} - Esmaeil Abedi's Blog`,
      description: post.excerpt ?? undefined, // Ensure string | undefined
      url: `/blog/${post.slug}`,
      ogImage: post.mainImage ?? undefined, // Ensure string | undefined
      type: "article",
      publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
      tags: post.categories?.map((cat) => cat.title) || [],
    });
  } catch (error) {
    console.error(
      `Error generating metadata for post with slug ${params.slug}:`,
      error
    );
    return constructMetadata({
      title: "Error Loading Post",
      description: "There was an error loading this blog post.",
    });
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: params.slug,
        status: "published",
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        categories: true,
      },
    });

    if (!post) {
      notFound();
    }

    // Generate JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt ?? undefined,
      image: post.mainImage ?? undefined,
      datePublished: post.publishedAt ? post.publishedAt.toISOString() : undefined,
      dateModified:
        post.updatedAt?.toISOString() || (post.publishedAt ? post.publishedAt.toISOString() : undefined),
      author: {
        "@type": "Person",
        name: "Esmaeil Abedi",
        url: "https://yourdomain.com/about",
      },
      publisher: {
        "@type": "Person",
        name: "Esmaeil Abedi",
        logo: {
          "@type": "ImageObject",
          url: "https://yourdomain.com/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://yourdomain.com/blog/${post.slug}`,
      },
      keywords: post.categories?.map((cat) => cat.title).join(", "),
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl">
            <Link href="/blog">
              <Button variant="ghost" className="mb-8 pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all posts
              </Button>
            </Link>

            <div className="space-y-2 mb-8">
              <div className="flex flex-wrap gap-2">
                {post.categories?.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.title}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {post.publishedAt && (
                  <time dateTime={post.publishedAt.toISOString()}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                )}
                <div className="text-sm text-muted-foreground">
                  {post.readingTime} min read
                </div>
              </div>
            </div>

            {post.mainImage && (
              <div className="mb-8 overflow-hidden rounded-lg">
                <Image
                  src={post.mainImage || "/placeholder.svg"}
                  alt={post.title}
                  width={1200}
                  height={630}
                  className="aspect-video object-cover"
                  priority
                />
              </div>
            )}

            <article className="prose prose-gray dark:prose-invert max-w-none">
              <PortableText value={post.content} />
            </article>
          </div>
        </main>
      </>
    );
  } catch (error) {
    console.error(`Error loading post with slug ${params.slug}:`, error);
    return (
      <main className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Error Loading Post
          </h1>
          <p className="mt-4 text-muted-foreground">
            There was an error loading this blog post. Please try again later.
          </p>
          <Link href="/blog" className="mt-8 inline-block">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all posts
            </Button>
          </Link>
        </div>
      </main>
    );
  }
}
