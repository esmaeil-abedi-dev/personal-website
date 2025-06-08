const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Function to run a command and handle errors
function runCommand(command, errorMessage) {
  try {
    console.log(`Running: ${command}`)
    execSync(command, { stdio: "inherit" })
    return true
  } catch (error) {
    console.error(`${errorMessage}:`, error.message)
    return false
  }
}

// Main function to set up Prisma
async function setupPrisma() {
  console.log("🔧 Setting up Prisma...")

  // Ensure the prisma directory exists
  const prismaDir = path.join(process.cwd(), "node_modules", ".prisma")
  if (!fs.existsSync(prismaDir)) {
    console.log("Creating .prisma directory...")
    fs.mkdirSync(prismaDir, { recursive: true })
  }

  // Generate Prisma client
  if (!runCommand("npx prisma generate", "Failed to generate Prisma client")) {
    console.log("Retrying Prisma generation...")
    // Try again with force flag
    if (!runCommand("npx prisma generate --force-reset", "Failed to generate Prisma client on retry")) {
      process.exit(1)
    }
  }

  console.log("✅ Prisma setup complete!")
}

// Run the setup
setupPrisma().catch((error) => {
  console.error("❌ Prisma setup failed:", error)
  process.exit(1)
})
