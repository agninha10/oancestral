-- Add Role enum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- Add role column to users table
ALTER TABLE "users" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';

-- Make a specific user an admin (replace with your email)
UPDATE "users" SET "role" = 'ADMIN' WHERE "email" = 'seu-email@exemplo.com';
