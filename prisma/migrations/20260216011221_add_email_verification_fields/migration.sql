/*
  Warnings:

  - The `emailVerified` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationTokenExpires" TIMESTAMP(3),
DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" TIMESTAMP(3);
