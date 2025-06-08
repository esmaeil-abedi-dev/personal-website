const { execSync } = require("child_process")

// Run prisma generate
console.log("Running prisma generate...")
execSync("npx prisma generate", { stdio: "inherit" })

// Run next build
console.log("Running next build...")
execSync("next build", { stdio: "inherit" })
