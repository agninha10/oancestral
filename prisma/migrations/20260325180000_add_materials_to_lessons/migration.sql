-- AlterTable: add materials JSON column to lessons
ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "materials" JSONB;
