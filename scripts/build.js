const { execSync } = require("child_process");

// Run prisma generate
console.log("Running Prisma setup...");
execSync("node scripts/setup-prisma.js", { stdio: "inherit" });

// Run next build
console.log("Running next build...");
execSync("npx next build", { stdio: "inherit" });
