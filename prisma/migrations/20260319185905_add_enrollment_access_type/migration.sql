-- AlterTable
ALTER TABLE "course_enrollments" ADD COLUMN     "accessType" TEXT NOT NULL DEFAULT 'SUBSCRIPTION',
ADD COLUMN     "grantedById" TEXT;

-- CreateIndex
CREATE INDEX "course_enrollments_accessType_idx" ON "course_enrollments"("accessType");
