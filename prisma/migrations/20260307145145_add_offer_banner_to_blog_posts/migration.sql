-- CreateEnum
CREATE TYPE "BlogOfferBanner" AS ENUM ('AUTO', 'LIVRO', 'JEJUM', 'MEMBERSHIP', 'NONE');

-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "offerBanner" "BlogOfferBanner" NOT NULL DEFAULT 'AUTO';
