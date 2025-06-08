import { PrismaClient } from "@prisma/client"

// This prevents multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

// Function to create a new PrismaClient with error handling
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
  } catch (error) {
    console.error("Failed to create Prisma client:", error)
    throw new Error(
      "Could not create Prisma Client. Please ensure 'prisma generate' has been run before starting the application.",
    )
  }
}

// Initialize the PrismaClient
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Save the client instance in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Export a wrapped version of the client to ensure it's initialized
export function getPrismaClient() {
  return prisma
}
