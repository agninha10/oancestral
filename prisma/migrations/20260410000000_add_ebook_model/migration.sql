-- CreateEnum
CREATE TYPE "EbookAccess" AS ENUM ('PURCHASE', 'CLAN', 'FREE');

-- CreateTable
CREATE TABLE "ebooks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "pages" TEXT,
    "filename" TEXT,
    "access" "EbookAccess" NOT NULL DEFAULT 'PURCHASE',
    "price" INTEGER,
    "kiwifyUrl" TEXT,
    "kiwifyProductId" TEXT,
    "buyHref" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ebooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ebooks_slug_key" ON "ebooks"("slug");

-- CreateIndex
CREATE INDEX "ebooks_published_idx" ON "ebooks"("published");

-- CreateIndex
CREATE INDEX "ebooks_access_idx" ON "ebooks"("access");
