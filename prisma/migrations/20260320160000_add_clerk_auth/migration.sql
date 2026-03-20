-- Add clerkUserId (unique, nullable — populated by webhook on first sign-in)
ALTER TABLE "users" ADD COLUMN "clerkUserId" TEXT;
CREATE UNIQUE INDEX "users_clerkUserId_key" ON "users"("clerkUserId");

-- Make password nullable (Clerk users have no local password)
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

-- Make birthdate nullable (Clerk users set it later via profile)
ALTER TABLE "users" ALTER COLUMN "birthdate" DROP NOT NULL;
