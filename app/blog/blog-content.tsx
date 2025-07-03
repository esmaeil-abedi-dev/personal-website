// app/blog/blog-content.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo } from "react";

interface Category {
  id: string;
  slug: string;
  title: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  mainImage: string | null;
  excerpt: string | null;
  publishedAt: string; // Expect ISO string from server
  readingTime: number | null;
  categories: Category[];
}

interface BlogContentProps {
  initialPosts: Post[]; // This will now align with SerializablePost if Category also aligns
  categories: Category[];
}

export default function BlogContent({
  initialPosts,
  categories,
}: BlogContentProps) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  const filteredPosts = useMemo(() => {
    if (!categorySlug) {
      return initialPosts;
    }
    return initialPosts.filter((post) =>
      post.categories.some((cat) => cat.slug === categorySlug)
    );
  }, [categorySlug, initialPosts]);

  return (
    <>
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
        {categories.map((cat) => (
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
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="space-y-3 rounded-lg border bg-background p-4 transition-all hover:shadow-md">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={
                      post.mainImage || "/placeholder.svg?height=200&width=400"
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
              No blog posts found{categorySlug ? " for this category" : ""}.
              Check back soon!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
