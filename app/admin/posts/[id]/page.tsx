import { notFound } from "next/navigation";
import { getPostById, getAllCategories } from "@/lib/admin"; // Import getAllCategories
import { PostForm } from "@/components/admin/post-form";
import type { Category } from "@prisma/client";

export const metadata = {
  title: "Edit Post - Admin Panel",
  description: "Edit a blog post for your personal website",
};

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  const allCategories: Category[] = await getAllCategories(); // Fetch all categories

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
      <PostForm post={post} categories={allCategories} /> {/* Pass allCategories */}
    </div>
  );
}
