const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

async function setupDatabase() {
  console.log("🔧 Setting up database...")

  try {
    // Ensure the prisma directory exists
    const prismaDir = path.join(process.cwd(), "node_modules", ".prisma")
    if (!fs.existsSync(prismaDir)) {
      fs.mkdirSync(prismaDir, { recursive: true })
    }

    // Generate Prisma client
    console.log("📦 Generating Prisma client...")
    execSync("npx prisma generate", { stdio: "inherit" })

    // Push schema to database (only in production)
    if (process.env.NODE_ENV === "production") {
      console.log("🚀 Pushing schema to database...")
      execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" })
    }

    console.log("✅ Database setup complete!")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    process.exit(1)
  }
}

setupDatabase()
