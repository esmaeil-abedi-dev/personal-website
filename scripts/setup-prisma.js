const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Ensure the .prisma directory exists
const prismaDir = path.join(__dirname, "..", "node_modules", ".prisma")
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true })
}

// Run prisma generate
console.log("Generating Prisma client...")
try {
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log("Prisma client generated successfully!")
} catch (error) {
  console.error("Failed to generate Prisma client:", error)
  process.exit(1)
}
