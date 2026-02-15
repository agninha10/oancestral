/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `recipes` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RecipeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "NewsletterSource" AS ENUM ('BLOG_FOOTER', 'RECIPE_POPUP', 'INLINE_CTA', 'HOMEPAGE', 'OTHER');

-- AlterEnum
ALTER TYPE "RecipeCategory" ADD VALUE 'FASTING';

-- AlterTable
ALTER TABLE "blog_posts" DROP COLUMN "imageUrl",
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "imageUrl",
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "difficulty" "RecipeDifficulty" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "macronutrients" JSONB;

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" "NewsletterSource" NOT NULL DEFAULT 'OTHER',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_active_idx" ON "newsletter_subscribers"("active");
