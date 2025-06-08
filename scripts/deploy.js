const { execSync } = require("child_process")

async function deploy() {
  try {
    console.log("Setting up database...")

    // Generate Prisma client
    execSync("npx prisma generate", { stdio: "inherit" })

    // Push database schema (creates tables if they don't exist)
    execSync("npx prisma db push", { stdio: "inherit" })

    console.log("Database setup complete!")
  } catch (error) {
    console.error("Database setup failed:", error)
    process.exit(1)
  }
}

deploy()
