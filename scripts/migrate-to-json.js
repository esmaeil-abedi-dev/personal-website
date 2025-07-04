"use strict";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Default empty document structure for Tiptap editor
 */
const DEFAULT_EDITOR_CONTENT = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: {
        textAlign: null,
      },
      content: [
        {
          type: "text",
          text: "",
        },
      ],
    },
  ],
};

/**
 * Convert HTML string to a simple JSON content structure
 */
function convertHtmlToJson(html) {
  if (!html) {
    return DEFAULT_EDITOR_CONTENT;
  }

  try {
    // Try to parse if it's already JSON
    return JSON.parse(html);
  } catch (e) {
    // If it's HTML, create a simple document with the HTML content
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              type: "text",
              text: html.replace(/<[^>]*>/g, ''), // Strip HTML tags
            },
          ],
        },
      ],
    };
  }
}

async function migrateData() {
  console.log('Starting data migration to JSON format...');

  // Migrate Posts
  console.log('Migrating posts...');
  const posts = await prisma.post.findMany();
  for (const post of posts) {
    try {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          content: convertHtmlToJson(post.content),
        },
      });
      console.log(`Updated post: ${post.title}`);
    } catch (error) {
      console.error(`Error updating post ${post.id}:`, error);
    }
  }

  // Migrate Projects
  console.log('Migrating projects...');
  const projects = await prisma.project.findMany();
  for (const project of projects) {
    try {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          content: convertHtmlToJson(project.content),
        },
      });
      console.log(`Updated project: ${project.title}`);
    } catch (error) {
      console.error(`Error updating project ${project.id}:`, error);
    }
  }

  // Migrate Experiences
  console.log('Migrating experiences...');
  const experiences = await prisma.experience.findMany();
  for (const experience of experiences) {
    try {
      await prisma.experience.update({
        where: { id: experience.id },
        data: {
          description: convertHtmlToJson(experience.description),
        },
      });
      console.log(`Updated experience: ${experience.company} - ${experience.position}`);
    } catch (error) {
      console.error(`Error updating experience ${experience.id}:`, error);
    }
  }

  // Migrate About
  console.log('Migrating about page...');
  const about = await prisma.about.findUnique({
    where: { id: "1" },
  });
  
  if (about) {
    try {
      await prisma.about.update({
        where: { id: "1" },
        data: {
          fullBio: convertHtmlToJson(about.fullBio),
        },
      });
      console.log(`Updated about page`);
    } catch (error) {
      console.error(`Error updating about page:`, error);
    }
  }

  console.log('Migration completed successfully!');
}

migrateData()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
