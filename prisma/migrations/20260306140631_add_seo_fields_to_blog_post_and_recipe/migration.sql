-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "coverImageAlt" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "coverImageAlt" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT;
