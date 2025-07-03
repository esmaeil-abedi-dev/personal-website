import { prisma } from "@/lib/prisma";
import { Post, Category, Experience, SkillCategory, About } from "@prisma/client";

// Define a type for the recent post structure
type RecentPost = Pick<Post, "id" | "title" | "slug" | "status" | "updatedAt">;

// Define a type for the overview chart data
type OverviewChartData = {
  name: string;
  posts: number;
  visitors: number;
};

// Define a type for the stats object
type Stats = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  experienceEntries: number;
  skillCategories: number;
  totalSkills: number;
  categories: number;
  recentPosts: RecentPost[];
  overviewData: OverviewChartData[];
};

// Dashboard Stats
export async function getStats(): Promise<Stats> {
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
    ]);

  // Get total skills count
  const allSkillCategories = await prisma.skillCategory.findMany({
    select: { skills: true },
  });
  const totalSkills = allSkillCategories.reduce((acc, category) => acc + category.skills.length, 0);

  // Generate mock data for the overview chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - i + 12) % 12;
    return months[monthIndex];
  }).reverse();

  // Mock data for the chart
  const overviewData = last6Months.map((name) => ({
    name,
    posts: Math.floor(Math.random() * 5),
    visitors: Math.floor(Math.random() * 1000) + 100,
  }));

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
  };
}

// Blog Posts
export async function getAllPosts(): Promise<(Post & { categories: Category[] })[]> {
  return prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      categories: true,
    },
  });
}

export async function getPostById(id: string): Promise<(Post & { categories: Category[] }) | null> {
  return prisma.post.findUnique({
    where: { id },
    include: {
      categories: true,
    },
  });
}

// Categories
export async function getAllCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { title: "asc" },
  });
}

// Experience
export async function getExperiences(): Promise<Experience[]> {
  return prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  return prisma.experience.findUnique({
    where: { id },
  });
}

// Skills
export async function getSkills(): Promise<SkillCategory[]> {
  return prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getSkillCategoryById(id: string): Promise<SkillCategory | null> {
  return prisma.skillCategory.findUnique({
    where: { id },
  });
}

// About Page
export async function getAboutPage(): Promise<About> {
  const about = await prisma.about.findUnique({
    where: { id: "1" }, // Assuming there's only one about page
  });
  return (
    about || {
      id: "1", // Ensure id is present for consistency if creating a default
      shortBio: "",
      fullBio: "",
      image: null, // Match prisma schema (nullable string)
      updatedAt: new Date(), // Ensure updatedAt is present
    }
  );
}
