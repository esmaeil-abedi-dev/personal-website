-- Update content fields to JSON
-- CreateMigration

-- AlterTable: Post
ALTER TABLE "Post" ALTER COLUMN "content" TYPE JSONB USING content::jsonb;

-- AlterTable: About
ALTER TABLE "About" ALTER COLUMN "fullBio" TYPE JSONB USING fullBio::jsonb;

-- AlterTable: Project
ALTER TABLE "Project" ALTER COLUMN "content" TYPE JSONB USING content::jsonb;

-- AlterTable: Experience
ALTER TABLE "Experience" ALTER COLUMN "description" TYPE JSONB USING description::jsonb;
