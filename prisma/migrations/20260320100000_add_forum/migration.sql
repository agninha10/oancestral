-- CreateTable
CREATE TABLE "forum_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '💬',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forum_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_replies" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_likes" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex
CREATE UNIQUE INDEX "forum_categories_slug_key" ON "forum_categories"("slug");

-- CreateUniqueIndex
CREATE UNIQUE INDEX "post_likes_postId_userId_key" ON "post_likes"("postId", "userId");

-- CreateIndex
CREATE INDEX "forum_posts_categoryId_idx" ON "forum_posts"("categoryId");
CREATE INDEX "forum_posts_authorId_idx" ON "forum_posts"("authorId");
CREATE INDEX "forum_posts_createdAt_idx" ON "forum_posts"("createdAt");
CREATE INDEX "forum_replies_postId_idx" ON "forum_replies"("postId");
CREATE INDEX "forum_replies_authorId_idx" ON "forum_replies"("authorId");
CREATE INDEX "post_likes_postId_idx" ON "post_likes"("postId");

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "forum_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_postId_fkey" FOREIGN KEY ("postId") REFERENCES "forum_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "forum_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
