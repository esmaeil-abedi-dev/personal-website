const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function migrateContentToJson() {
  console.log("Starting content migration to JSON format...")

  try {
    // Migrate posts
    const posts = await prisma.post.findMany()
    console.log(`Found ${posts.length} posts to migrate`)

    for (const post of posts) {
      if (typeof post.content === "string") {
        // Convert HTML string to basic JSON structure
        const jsonContent = {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: post.content.replace(/<[^>]*>/g, ""), // Strip HTML tags for now
                },
              ],
            },
          ],
        }

        await prisma.post.update({
          where: { id: post.id },
          data: { content: jsonContent },
        })

        console.log(`Migrated post: ${post.title}`)
      }
    }

    // Migrate projects
    const projects = await prisma.project.findMany()
    console.log(`Found ${projects.length} projects to migrate`)

    for (const project of projects) {
      if (typeof project.content === "string") {
        const jsonContent = {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: project.content.replace(/<[^>]*>/g, ""),
                },
              ],
            },
          ],
        }

        await prisma.project.update({
          where: { id: project.id },
          data: { content: jsonContent },
        })

        console.log(`Migrated project: ${project.title}`)
      }
    }

    // Migrate about page
    const about = await prisma.about.findUnique({ where: { id: "1" } })
    if (about && typeof about.fullBio === "string") {
      const jsonContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: about.fullBio.replace(/<[^>]*>/g, ""),
              },
            ],
          },
        ],
      }

      await prisma.about.update({
        where: { id: "1" },
        data: { fullBio: jsonContent },
      })

      console.log("Migrated about page")
    }

    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateContentToJson()
