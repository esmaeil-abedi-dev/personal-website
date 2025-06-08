const { execSync } = require("child_process")

console.log("🚀 Starting build process...")

try {
  // Generate Prisma client first
  console.log("📦 Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  // Run next build
  console.log("🔨 Building Next.js application...")
  execSync("npx next build", { stdio: "inherit" })

  console.log("✅ Build completed successfully!")
} catch (error) {
  console.error("❌ Build failed:", error)
  process.exit(1)
}
