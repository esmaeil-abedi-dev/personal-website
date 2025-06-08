"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export function RecentPosts({ posts }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href={`/admin/posts/${post.id}`} className="font-medium hover:underline">
              {post.title}
            </Link>
            <p className="text-xs text-muted-foreground">{format(new Date(post.updatedAt), "MMM d, yyyy")}</p>
          </div>
          <Badge variant={post.status === "published" ? "default" : "secondary"}>
            {post.status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>
      ))}
    </div>
  )
}
