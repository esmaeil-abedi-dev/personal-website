// app/blog/page.tsx
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import BlogContent from "./blog-content"; // Import the new component
import type { Post, Category } from "@prisma/client";

// Define a more specific type for categories within SerializablePost
type SerializableCategory = Pick<Category, "id" | "slug" | "title">;

// Define the type for posts after processing for client-side consumption
// This should match what BlogContent expects for initialPosts
type SerializablePost = Omit<Post, "publishedAt" | "categories" | "createdAt" | "updatedAt"> & {
  publishedAt: string; // Or Date, depending on how it's used in BlogContent
  categories: SerializableCategory[];
  createdAt: string;
  updatedAt: string;
};


export const metadata = {
  title: "Blog - Esmaeil Abedi",
  description:
    "Read my latest articles on software development, design, and more.",
};

// Helper function to ensure serializable Post data
const processPosts = (posts: (Post & { categories: Category[] })[]): SerializablePost[] => {
  return posts.map((post) => {
    const { createdAt, updatedAt, publishedAt, categories, ...restOfPost } = post;
    return {
      ...restOfPost,
      // Ensure dates are stringified for serialization
      publishedAt: publishedAt ? publishedAt.toISOString() : new Date().toISOString(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      // Ensure categories is an array, and each category has id, slug, title
      categories: categories
        ? categories.map((cat) => ({
            id: cat.id,
            slug: cat.slug,
            title: cat.title,
            // No need for description here based on SerializableCategory
          }))
        : [],
      // Ensure other potentially problematic fields are handled if necessary
      // These should ideally match the SerializablePost structure if different from Post
      readingTime: post.readingTime ?? 0, // Use nullish coalescing
      mainImage: post.mainImage ?? null,
      excerpt: post.excerpt ?? "",
    };
  });
};

export default async function BlogPage() {
  // Fetch all categories
  let categories: Category[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: {
        title: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    // categories will remain an empty array
  }

  // Fetch all posts
  let posts: (Post & { categories: Category[] })[] = [];
  try {
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
        categories: true, // Ensure categories are included
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    // Optionally, return an error state or fallback UI for posts
  }

  const serializablePosts = processPosts(posts);

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

      <Suspense
        fallback={
          <div className="text-center py-12">Loading blog content...</div>
        }
      >
        <BlogContent initialPosts={serializablePosts} categories={categories} />
      </Suspense>
    </main>
  );
}
