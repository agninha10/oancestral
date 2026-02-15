/*
  Warnings:

  - A unique constraint covering the columns `[abacateCustomerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "abacateCustomerId" TEXT,
ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_abacateCustomerId_key" ON "users"("abacateCustomerId");
