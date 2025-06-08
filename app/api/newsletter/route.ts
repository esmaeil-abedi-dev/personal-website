import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    // Check if the email already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      return NextResponse.json({ error: "This email is already subscribed" }, { status: 400 })
    }

    // Create a new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
      },
    })

    return NextResponse.json({ message: "Subscription successful", subscriber }, { status: 201 })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe to the newsletter" }, { status: 500 })
  }
}
