// app/blog/page.tsx
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import BlogContent from "./blog-content"; // Import the new component

export const metadata = {
  title: "Blog - John Doe",
  description:
    "Read my latest articles on software development, design, and more.",
};

// Helper function to ensure serializable Post data
const processPosts = (posts: any[]) => {
  return posts.map((post) => ({
    ...post,
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(), // Ensure Date object
    // Ensure categories is an array, and each category has id, slug, title
    categories: post.categories
      ? post.categories.map((cat: any) => ({
          id: cat.id || String(Math.random()), // Fallback for id
          slug: cat.slug || "", // Fallback for slug
          title: cat.title || "Untitled Category", // Fallback for title
        }))
      : [],
    // Ensure other potentially problematic fields are handled if necessary
    readingTime: post.readingTime || 0,
    mainImage: post.mainImage || null,
    excerpt: post.excerpt || "",
  }));
};

export default async function BlogPage() {
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
    // Optionally, return an error state or fallback UI for categories
  }

  // Fetch all posts
  let posts = [];
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
