import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define a union type for the search results
type SearchResultItem =
  | {
      id: string;
      title: string;
      excerpt: string | null;
      slug: string;
      type: "post";
      image: string | null;
      date: Date | null;
      categories: string[];
    }
  | {
      id: string;
      title: string;
      excerpt: string | null;
      slug: string;
      type: "project";
      image: string | null;
      date: Date;
      technologies: string[];
    };

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const type = searchParams.get("type")

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    let results: SearchResultItem[] = [];

    // Search blog posts
    if (!type || type === "post") {
      const posts = await prisma.post.findMany({
        where: {
          status: "published",
          publishedAt: {
            lte: new Date(),
          },
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          categories: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: 10,
      })

      results = [
        ...results,
        ...posts.map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          type: "post",
          image: post.mainImage,
          date: post.publishedAt,
          categories: post.categories.map((cat) => cat.title),
        })),
      ]
    }

    // Search projects
    if (!type || type === "project") {
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
            { technologies: { hasSome: [query] } },
          ],
        },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
        take: 10,
      })

      results = [
        ...results,
        ...projects.map((project) => ({
          id: project.id,
          title: project.title,
          excerpt: project.description,
          slug: project.slug,
          type: "project",
          image: project.image,
          date: project.updatedAt || project.createdAt,
          technologies: project.technologies,
        })),
      ]
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  }
}
