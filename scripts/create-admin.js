const { PrismaClient } = require("@prisma/client");
const { createHash } = require("crypto");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    // Create admin user
    const hashedPassword = createHash("sha256")
      .update("admin123")
      .digest("hex");

    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
      },
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    console.log("Please change the password after first login!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
