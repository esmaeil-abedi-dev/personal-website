import { PostForm } from "@/components/admin/post-form"
import prisma from "@/lib/prisma";

export const metadata = {
  title: "New Post - Admin Panel",
  description: "Create a new blog post for your personal website",
}

export default async function NewPostPage() {
  const allCategories = await prisma.category.findMany();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">New Post</h1>
      <PostForm categories={allCategories || []} />
    </div>
  )
}
