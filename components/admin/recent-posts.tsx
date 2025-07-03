"use client"

import Link from "next/link"
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Define the structure of a recent post based on its usage
interface RecentPostSummary {
  id: string;
  title: string;
  updatedAt: Date | string; // Prisma returns Date, but it might be stringified if passed around
  status: string; // Prisma Post model has status as string ("draft" or "published")
  // slug is not used in this component, but was selected in getStats
}

interface RecentPostsProps {
  posts: RecentPostSummary[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <div className="space-y-4">
      {posts.map((post: RecentPostSummary) => (
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
  );
}
