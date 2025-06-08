import { prisma } from "@/lib/prisma"

export async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...")

    // Log database URL (with credentials masked)
    const dbUrl = process.env.DATABASE_URL || ""
    const maskedUrl = dbUrl.replace(/:\/\/([^:]+):([^@]+)@/, "://*****:*****@")
    console.log(`Database URL: ${maskedUrl}`)

    // Attempt connection
    await prisma.$connect()
    console.log("Database connection successful!")

    // Run a simple query
    const userCount = await prisma.user.count()
    console.log(`User count: ${userCount}`)

    return {
      success: true,
      message: "Database connection successful",
      userCount,
    }
  } catch (error) {
    console.error("Database connection failed:", error)
    return {
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : String(error),
    }
  } finally {
    await prisma.$disconnect()
  }
}
