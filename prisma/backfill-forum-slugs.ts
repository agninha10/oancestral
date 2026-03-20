import { PrismaClient } from '@prisma/client';
import { generateForumSlug } from '../lib/forum-utils';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.forumPost.findMany({
        where: { slug: null },
        select: { id: true, title: true },
    });

    console.log(`Found ${posts.length} post(s) without slugs.`);

    for (const post of posts) {
        let slug = generateForumSlug(post.title);
        // Ensure uniqueness (unlikely collision, but defensive)
        const existing = await prisma.forumPost.findUnique({ where: { slug } });
        if (existing) slug = generateForumSlug(post.title);

        await prisma.forumPost.update({ where: { id: post.id }, data: { slug } });
        console.log(`  ✓ "${post.title}" → ${slug}`);
    }

    console.log('✅ Backfill complete.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
