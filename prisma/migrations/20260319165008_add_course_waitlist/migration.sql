-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "waitlistEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "course_waitlist" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "course_waitlist_courseId_idx" ON "course_waitlist"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "course_waitlist_courseId_email_key" ON "course_waitlist"("courseId", "email");

-- AddForeignKey
ALTER TABLE "course_waitlist" ADD CONSTRAINT "course_waitlist_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
