"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createHash } from "crypto"
import { prisma } from "@/lib/prisma"
import { getServerAuthSession } from "@/lib/auth"

// Authentication check
async function checkAuth() {
  const session = await getServerAuthSession()
  if (!session) {
    redirect("/api/auth/signin")
  }
  return session
}

// Simple hash function for passwords (not for production use)
function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex")
}

// Blog Posts
export async function createPost(data) {
  await checkAuth()

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      mainImage: data.mainImage,
      status: data.status,
      publishedAt: data.status === "published" ? new Date(data.publishedAt || Date.now()) : null,
      readingTime: data.readingTime,
      categories: {
        connect: data.categories?.map((id) => ({ id })) || [],
      },
    },
  })

  revalidatePath("/blog")
  revalidatePath("/admin/posts")
  return post
}

export async function updatePost(id, data) {
  await checkAuth()

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      mainImage: data.mainImage,
      status: data.status,
      publishedAt: data.status === "published" ? new Date(data.publishedAt || Date.now()) : null,
      readingTime: data.readingTime,
      categories: {
        set: data.categories?.map((id) => ({ id })) || [],
      },
    },
  })

  revalidatePath(`/blog/${data.slug}`)
  revalidatePath("/blog")
  revalidatePath("/admin/posts")
  return post
}

export async function deletePost(id) {
  await checkAuth()

  const post = await prisma.post.delete({
    where: { id },
  })

  revalidatePath("/blog")
  revalidatePath("/admin/posts")
  return post
}

// Experience
export async function createExperience(data) {
  await checkAuth()

  const experience = await prisma.experience.create({
    data: {
      company: data.company,
      position: data.position,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      technologies: data.technologies,
    },
  })

  revalidatePath("/experience")
  revalidatePath("/admin/experience")
  return experience
}

export async function updateExperience(id, data) {
  await checkAuth()

  const experience = await prisma.experience.update({
    where: { id },
    data: {
      company: data.company,
      position: data.position,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      technologies: data.technologies,
    },
  })

  revalidatePath("/experience")
  revalidatePath("/admin/experience")
  return experience
}

export async function deleteExperience(id) {
  await checkAuth()

  const experience = await prisma.experience.delete({
    where: { id },
  })

  revalidatePath("/experience")
  revalidatePath("/admin/experience")
  return experience
}

// Skills
export async function createSkillCategory(data) {
  await checkAuth()

  const skillCategory = await prisma.skillCategory.create({
    data: {
      category: data.category,
      skills: data.skills,
      order: data.order,
    },
  })

  revalidatePath("/experience")
  revalidatePath("/admin/skills")
  return skillCategory
}

export async function updateSkillCategory(id, data) {
  await checkAuth()

  const skillCategory = await prisma.skillCategory.update({
    where: { id },
    data: {
      category: data.category,
      skills: data.skills,
      order: data.order,
    },
  })

  revalidatePath("/experience")
  revalidatePath("/admin/skills")
  return skillCategory
}

export async function deleteSkillCategory(id) {
  await checkAuth()

  const skillCategory = await prisma.skillCategory.delete({
    where: { id },
  })

  revalidatePath("/experience")
  revalidatePath("/admin/skills")
  return skillCategory
}

// About Page
export async function updateAboutPage(data) {
  await checkAuth()

  const about = await prisma.about.upsert({
    where: { id: "1" }, // Assuming there's only one about page
    update: {
      shortBio: data.shortBio,
      fullBio: data.fullBio,
      image: data.image,
    },
    create: {
      id: "1",
      shortBio: data.shortBio,
      fullBio: data.fullBio,
      image: data.image,
    },
  })

  revalidatePath("/about")
  revalidatePath("/admin/about")
  return about
}

// Image Upload
export async function uploadImage(file) {
  await checkAuth()

  // This is a placeholder for actual image upload logic
  // In a real implementation, you would upload to a service like AWS S3, Cloudinary, etc.

  // For now, we'll simulate an upload and return a placeholder URL
  // In production, replace this with actual upload logic
  return `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(file.name)}`
}

// Projects
export async function createProject(data) {
  await checkAuth()

  const project = await prisma.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      image: data.image,
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl,
      technologies: data.technologies,
      featured: data.featured,
      order: data.order,
    },
  })

  revalidatePath("/portfolio")
  revalidatePath("/admin/projects")
  return project
}

export async function updateProject(id, data) {
  await checkAuth()

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      image: data.image,
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl,
      technologies: data.technologies,
      featured: data.featured,
      order: data.order,
    },
  })

  revalidatePath(`/portfolio/${data.slug}`)
  revalidatePath("/portfolio")
  revalidatePath("/admin/projects")
  return project
}

export async function deleteProject(id) {
  await checkAuth()

  const project = await prisma.project.delete({
    where: { id },
  })

  revalidatePath("/portfolio")
  revalidatePath("/admin/projects")
  return project
}

export async function toggleProjectFeatured(id) {
  await checkAuth()

  const project = await prisma.project.findUnique({
    where: { id },
    select: { featured: true },
  })

  if (!project) {
    throw new Error("Project not found")
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      featured: !project.featured,
    },
  })

  revalidatePath("/portfolio")
  revalidatePath("/admin/projects")
  return updatedProject
}

// Newsletter
export async function subscribeToNewsletter(email: string, name: string) {
  try {
    // Check if the email already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      if (!existingSubscriber.active) {
        // Reactivate the subscription
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { active: true, name },
        })
        return { success: true, message: "Subscription reactivated" }
      }
      return { success: false, message: "Email already subscribed" }
    }

    // Create a new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
      },
    })

    return { success: true, message: "Subscription successful" }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    throw new Error("Failed to subscribe to the newsletter")
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (!subscriber) {
      return { success: false, message: "Email not found" }
    }

    // Instead of deleting, mark as inactive
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { active: false },
    })

    return { success: true, message: "Unsubscribed successfully" }
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error)
    throw new Error("Failed to unsubscribe from the newsletter")
  }
}
