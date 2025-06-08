import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Attempt to connect to the database
    await prisma.$connect()

    // Run a simple query to verify connection
    const userCount = await prisma.user.count()

    // Return success response
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      data: {
        userCount,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Database connection error:", error)

    // Return error response with details
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    // Always disconnect after test
    await prisma.$disconnect()
  }
}
