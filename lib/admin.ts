import { prisma } from "@/lib/prisma"

// Dashboard Stats
export async function getStats() {
  const [totalPosts, publishedPosts, draftPosts, experienceEntries, skillCategories, categories, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "published" } }),
      prisma.post.count({ where: { status: "draft" } }),
      prisma.experience.count(),
      prisma.skillCategory.count(),
      prisma.category.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          updatedAt: true,
        },
      }),
    ])

  // Get total skills count
  const allSkillCategories = await prisma.skillCategory.findMany({
    select: { skills: true },
  })
  const totalSkills = allSkillCategories.reduce((acc, category) => acc + category.skills.length, 0)

  // Generate mock data for the overview chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - i + 12) % 12
    return months[monthIndex]
  }).reverse()

  // Mock data for the chart
  const overviewData = last6Months.map((name) => ({
    name,
    posts: Math.floor(Math.random() * 5),
    visitors: Math.floor(Math.random() * 1000) + 100,
  }))

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    experienceEntries,
    skillCategories,
    totalSkills,
    categories,
    recentPosts,
    overviewData,
  }
}

// Blog Posts
export async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      categories: true,
    },
  })
}

export async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      categories: true,
    },
  })
}

// Categories
export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { title: "asc" },
  })
}

// Experience
export async function getExperiences() {
  return prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  })
}

export async function getExperienceById(id) {
  return prisma.experience.findUnique({
    where: { id },
  })
}

// Skills
export async function getSkills() {
  return prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
  })
}

export async function getSkillCategoryById(id) {
  return prisma.skillCategory.findUnique({
    where: { id },
  })
}

// About Page
export async function getAboutPage() {
  return (
    prisma.about.findUnique({
      where: { id: "1" }, // Assuming there's only one about page
    }) || {
      shortBio: "",
      fullBio: "",
      image: "",
    }
  )
}
