import { PostForm } from "@/components/admin/post-form"

export const metadata = {
  title: "New Post - Admin Panel",
  description: "Create a new blog post for your personal website",
}

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">New Post</h1>
      <PostForm />
    </div>
  )
}
