-- AlterTable: add parentId for reply threading
ALTER TABLE "forum_replies" ADD COLUMN "parentId" TEXT;

-- CreateIndex
CREATE INDEX "forum_replies_parentId_idx" ON "forum_replies"("parentId");

-- AddForeignKey
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "forum_replies"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
