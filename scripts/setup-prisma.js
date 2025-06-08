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

  // Apply database migrations
  if (!runCommand("npx prisma migrate deploy", "Failed to apply database migrations")) {
    process.exit(1)
  }

  // Generate Prisma client
  // Add --no-engine flag as per plan step 3, will be done in a later step, but good to note here.
  if (!runCommand("npx prisma generate --no-engine", "Failed to generate Prisma client")) {
    process.exit(1)
  }

  console.log("✅ Prisma setup complete!")
}

// Run the setup
setupPrisma().catch((error) => {
  console.error("❌ Prisma setup failed:", error)
  process.exit(1)
})
