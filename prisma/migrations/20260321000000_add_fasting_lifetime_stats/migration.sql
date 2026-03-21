-- AlterTable: add fasting lifetime stats to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "fastingCount"      INTEGER          NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "totalFastingHours" DOUBLE PRECISION NOT NULL DEFAULT 0;
