import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PostsTable } from "@/components/admin/posts-table"
import { getAllPosts } from "@/lib/admin"

export const metadata = {
  title: "Manage Posts - Admin Panel",
  description: "Manage blog posts for your personal website",
}

export default async function PostsPage() {
  const posts = await getAllPosts()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
        <Link href="/admin/posts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      <PostsTable posts={posts} />
    </div>
  )
}
