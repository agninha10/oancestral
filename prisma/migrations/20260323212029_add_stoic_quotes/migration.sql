-- CreateTable
CREATE TABLE "stoic_quotes" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stoic_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stoic_quotes_isActive_idx" ON "stoic_quotes"("isActive");
