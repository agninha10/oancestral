-- CreateTable
CREATE TABLE "utm_visits" (
    "id" TEXT NOT NULL,
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "content" TEXT,
    "term" TEXT,
    "landing" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utm_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "utm_visits_campaign_idx" ON "utm_visits"("campaign");

-- CreateIndex
CREATE INDEX "utm_visits_source_idx" ON "utm_visits"("source");

-- CreateIndex
CREATE INDEX "utm_visits_createdAt_idx" ON "utm_visits"("createdAt");
