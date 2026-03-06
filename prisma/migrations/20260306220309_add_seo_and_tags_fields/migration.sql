-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "coverImageAlt" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
