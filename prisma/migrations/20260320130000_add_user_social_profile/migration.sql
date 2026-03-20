-- AlterTable: add social fields and privacy toggle to users
ALTER TABLE "users"
  ADD COLUMN "bio"           TEXT,
  ADD COLUMN "instagram"     TEXT,
  ADD COLUMN "twitter"       TEXT,
  ADD COLUMN "youtube"       TEXT,
  ADD COLUMN "tiktok"        TEXT,
  ADD COLUMN "linkedin"      TEXT,
  ADD COLUMN "website"       TEXT,
  ADD COLUMN "profilePublic" BOOLEAN NOT NULL DEFAULT true;
