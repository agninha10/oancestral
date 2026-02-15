/*
  Warnings:

  - You are about to drop the column `category` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `recipes` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('RECIPE', 'BLOG');

-- DropIndex
DROP INDEX "blog_posts_category_idx";

-- DropIndex
DROP INDEX "recipes_category_idx";

-- AlterTable
ALTER TABLE "blog_posts" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT;

-- DropEnum
DROP TYPE "BlogCategory";

-- DropEnum
DROP TYPE "RecipeCategory";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "CategoryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_type_idx" ON "categories"("type");

-- CreateIndex
CREATE INDEX "blog_posts_categoryId_idx" ON "blog_posts"("categoryId");

-- CreateIndex
CREATE INDEX "recipes_categoryId_idx" ON "recipes"("categoryId");

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
