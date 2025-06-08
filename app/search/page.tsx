import Link from "next/link"
import Image from "next/image"
import { FileText, FolderKanban } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchForm } from "@/components/search-form"

export const metadata = {
  title: "Search Results",
  description: "Search results for blog posts and projects",
}

async function getSearchResults(query: string, type?: string) {
  if (!query || query.length < 2) {
    return { posts: [], projects: [] }
  }

  try {
    // Search in blog posts
    const posts =
      type !== "projects"
        ? await prisma.post.findMany({
            where: {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { excerpt: { contains: query, mode: "insensitive" } },
                { content: { contains: query, mode: "insensitive" } },
              ],
              status: "published",
            },
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              mainImage: true,
              publishedAt: true,
              categories: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
            orderBy: {
              publishedAt: "desc",
            },
          })
        : []

    // Search in portfolio projects
    const projects =
      type !== "posts"
        ? await prisma.project.findMany({
            where: {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { content: { contains: query, mode: "insensitive" } },
                { technologies: { hasSome: [query] } },
              ],
            },
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              image: true,
              technologies: true,
            },
            orderBy: [{ featured: "desc" }, { order: "asc" }],
          })
        : []

    return { posts, projects }
  } catch (error) {
    console.error("Search error:", error)
    return { posts: [], projects: [] }
  }
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; type?: string } }) {
  const query = searchParams.q || ""
  const type = searchParams.type || ""

  if (!query) {
    return (
      <main className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">Search</h1>
          <SearchForm initialQuery="" />
          <p className="mt-8 text-center text-muted-foreground">Enter a search term to find blog posts and projects.</p>
        </div>
      </main>
    )
  }

  const results = await getSearchResults(query, type)
  const totalResults = results.posts.length + results.projects.length

  const activeTab = type === "posts" ? "posts" : type === "projects" ? "projects" : "all"

  return (
    <main className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">Search Results</h1>
        <SearchForm initialQuery={query} />

        <div className="mt-8">
          <p className="text-muted-foreground mb-6">
            Found {totalResults} result{totalResults !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>

          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" asChild>
                <Link href={`/search?q=${encodeURIComponent(query)}`}>All</Link>
              </TabsTrigger>
              <TabsTrigger value="posts" asChild>
                <Link href={`/search?q=${encodeURIComponent(query)}&type=posts`}>
                  Blog Posts ({results.posts.length})
                </Link>
              </TabsTrigger>
              <TabsTrigger value="projects" asChild>
                <Link href={`/search?q=${encodeURIComponent(query)}&type=projects`}>
                  Projects ({results.projects.length})
                </Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6 space-y-8">
              {totalResults === 0 ? (
                <p className="text-center py-12">No results found for &quot;{query}&quot;.</p>
              ) : (
                <>
                  {results.posts.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Blog Posts</h2>
                      <div className="space-y-4">
                        {results.posts.map((post: any) => (
                          <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                            <div className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border">
                                {post.mainImage ? (
                                  <Image
                                    src={post.mainImage || "/placeholder.svg"}
                                    alt={post.title}
                                    width={64}
                                    height={64}
                                    className="h-full w-full rounded-md object-cover"
                                  />
                                ) : (
                                  <FileText className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium">{post.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(post.publishedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.projects.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Projects</h2>
                      <div className="space-y-4">
                        {results.projects.map((project: any) => (
                          <Link key={project.id} href={`/portfolio/${project.slug}`} className="block">
                            <div className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border">
                                {project.image ? (
                                  <Image
                                    src={project.image || "/placeholder.svg"}
                                    alt={project.title}
                                    width={64}
                                    height={64}
                                    className="h-full w-full rounded-md object-cover"
                                  />
                                ) : (
                                  <FolderKanban className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium">{project.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.technologies.slice(0, 3).map((tech: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="text-xs px-1 py-0">
                                      {tech}
                                    </Badge>
                                  ))}
                                  {project.technologies.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{project.technologies.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            <TabsContent value="posts" className="mt-6">
              {results.posts.length === 0 ? (
                <p className="text-center py-12">No blog posts found for &quot;{query}&quot;.</p>
              ) : (
                <div className="space-y-4">
                  {results.posts.map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                      <div className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border">
                          {post.mainImage ? (
                            <Image
                              src={post.mainImage || "/placeholder.svg"}
                              alt={post.title}
                              width={64}
                              height={64}
                              className="h-full w-full rounded-md object-cover"
                            />
                          ) : (
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="projects" className="mt-6">
              {results.projects.length === 0 ? (
                <p className="text-center py-12">No projects found for &quot;{query}&quot;.</p>
              ) : (
                <div className="space-y-4">
                  {results.projects.map((project: any) => (
                    <Link key={project.id} href={`/portfolio/${project.slug}`} className="block">
                      <div className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border">
                          {project.image ? (
                            <Image
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              width={64}
                              height={64}
                              className="h-full w-full rounded-md object-cover"
                            />
                          ) : (
                            <FolderKanban className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.technologies.slice(0, 3).map((tech: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs px-1 py-0">
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{project.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
