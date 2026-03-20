-- AlterTable: add avatar, body metrics, and email-change fields to users

ALTER TABLE "users"
  ADD COLUMN "avatarUrl"               TEXT,
  ADD COLUMN "weight"                  DOUBLE PRECISION,
  ADD COLUMN "height"                  INTEGER,
  ADD COLUMN "pendingEmail"            TEXT,
  ADD COLUMN "emailChangeToken"        TEXT,
  ADD COLUMN "emailChangeTokenExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_emailChangeToken_key" ON "users"("emailChangeToken");
