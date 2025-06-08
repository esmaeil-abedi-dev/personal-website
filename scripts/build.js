const { execSync } = require("child_process")

// Install dependencies
console.log("Installing dependencies...")
execSync("npm install --legacy-peer-deps", { stdio: "inherit" })

// Run prisma generate
console.log("Running Prisma setup...")
execSync("npx prisma generate", { stdio: "inherit" })

// Run next build
console.log("Running next build...")
execSync("npx next build", { stdio: "inherit" })
