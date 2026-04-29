-- CreateTable
CREATE TABLE "caffeine_detox_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "protocol" TEXT NOT NULL DEFAULT 'PROGRESSIVE',
    "status" TEXT NOT NULL DEFAULT 'ONGOING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caffeine_detox_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "caffeine_detox_sessions_userId_idx" ON "caffeine_detox_sessions"("userId");

-- CreateIndex
CREATE INDEX "caffeine_detox_sessions_status_idx" ON "caffeine_detox_sessions"("status");

-- AddForeignKey
ALTER TABLE "caffeine_detox_sessions" ADD CONSTRAINT "caffeine_detox_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
