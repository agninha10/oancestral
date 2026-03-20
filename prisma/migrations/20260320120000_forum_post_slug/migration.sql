-- Add slug column to forum_posts (nullable for backfill)
ALTER TABLE "forum_posts" ADD COLUMN "slug" TEXT;

-- Unique index (PostgreSQL allows multiple NULLs in a unique index)
CREATE UNIQUE INDEX "forum_posts_slug_key" ON "forum_posts"("slug");
