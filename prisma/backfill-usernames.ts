import { PrismaClient } from '@prisma/client';
import { slugifyUsername } from '../lib/username-utils';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: { username: null },
        select: { id: true, name: true },
    });

    console.log(`Backfilling usernames for ${users.length} users…`);

    for (const user of users) {
        const base = slugifyUsername(user.name) || 'user';
        let candidate = base;
        let suffix = 2;

        // Find a unique username
        while (true) {
            const exists = await prisma.user.findUnique({
                where: { username: candidate },
                select: { id: true },
            });
            if (!exists) break;
            candidate = `${base}_${suffix++}`;
        }

        await prisma.user.update({
            where: { id: user.id },
            data:  { username: candidate },
        });

        console.log(`  ${user.name} → @${candidate}`);
    }

    console.log('Done.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
