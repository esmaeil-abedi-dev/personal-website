const { PrismaClient } = require("@prisma/client");
const { createHash } = require("crypto");

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Create admin user
    const hashedPassword = createHash("sha256")
      .update("admin123")
      .digest("hex");

    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
      },
    });

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: "web-development" },
        update: {},
        create: {
          title: "Web Development",
          slug: "web-development",
          description: "Articles about web development",
        },
      }),
      prisma.category.upsert({
        where: { slug: "javascript" },
        update: {},
        create: {
          title: "JavaScript",
          slug: "javascript",
          description: "JavaScript tutorials and tips",
        },
      }),
      prisma.category.upsert({
        where: { slug: "react" },
        update: {},
        create: {
          title: "React",
          slug: "react",
          description: "React development guides",
        },
      }),
    ]);

    // Create sample blog post
    const samplePost = await prisma.post.upsert({
      where: { slug: "welcome-to-my-blog" },
      update: {},
      create: {
        title: "Welcome to My Blog",
        slug: "welcome-to-my-blog",
        excerpt: "This is my first blog post. Welcome to my personal website!",
        content: `
          <h2>Welcome!</h2>
          <p>This is my first blog post on my new personal website. I'm excited to share my thoughts and experiences with you.</p>
          <p>In this blog, I'll be writing about:</p>
          <ul>
            <li>Web development</li>
            <li>JavaScript and React</li>
            <li>My personal projects</li>
            <li>Tech industry insights</li>
          </ul>
          <p>Stay tuned for more content!</p>
        `,
        status: "published",
        publishedAt: new Date(),
        readingTime: 2,
        categories: {
          connect: [{ id: categories[0].id }],
        },
      },
    });

    // Create sample experience
    const sampleExperience = await prisma.experience.upsert({
      where: { id: "sample-experience" },
      update: {},
      create: {
        id: "sample-experience",
        company: "Tech Company Inc.",
        position: "Senior Developer",
        startDate: "2020",
        endDate: "Present",
        description:
          "Led development of multiple web applications using React, Next.js, and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.",
        technologies: [
          "React",
          "Next.js",
          "Node.js",
          "TypeScript",
          "PostgreSQL",
        ],
      },
    });

    // Create sample skills
    const sampleSkills = await prisma.skillCategory.upsert({
      where: { id: "frontend-skills" },
      update: {},
      create: {
        id: "frontend-skills",
        category: "Frontend Development",
        skills: [
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "HTML",
          "CSS",
        ],
        order: 1,
      },
    });

    // Create sample project
    const sampleProject = await prisma.project.upsert({
      where: { slug: "personal-website" },
      update: {},
      create: {
        title: "Personal Website",
        slug: "personal-website",
        description:
          "A modern personal website built with Next.js and Tailwind CSS",
        content: `
          <h2>Project Overview</h2>
          <p>This is my personal website built with modern web technologies.</p>
          <h3>Features</h3>
          <ul>
            <li>Responsive design</li>
            <li>Blog functionality</li>
            <li>Portfolio showcase</li>
            <li>Admin panel</li>
          </ul>
        `,
        technologies: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Prisma",
        ],
        featured: true,
        order: 1,
      },
    });

    // Create about page content
    const aboutContent = await prisma.about.upsert({
      where: { id: "1" },
      update: {},
      create: {
        id: "1",
        shortBio:
          "I'm a passionate software developer with expertise in modern web technologies.",
        fullBio: `
          <p>Hello! I'm a software developer passionate about creating beautiful, functional, and user-friendly applications.</p>
          <p>I have experience working with various technologies including React, Next.js, Node.js, and PostgreSQL. I love learning new technologies and sharing my knowledge with others.</p>
          <p>When I'm not coding, you can find me reading tech blogs, contributing to open source projects, or exploring new places.</p>
        `,
      },
    });

    console.log("✅ Database seeded successfully!");
    console.log("📧 Admin email: admin@example.com");
    console.log("🔑 Admin password: admin123");
    console.log("⚠️  Please change the admin password after first login!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
