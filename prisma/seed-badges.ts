import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BADGES = [
    {
        id: 'badge_iniciado',
        name: 'O Iniciado',
        description: 'Completou seu primeiro jejum de 16 horas. A fornalha está acesa.',
        icon: 'Flame',
        requiredHours: 16,
        order: 1,
    },
    {
        id: 'badge_fornalha',
        name: 'A Fornalha',
        description: 'Completou um jejum de 24 horas. Você provou que a mente comanda o corpo.',
        icon: 'Zap',
        requiredHours: 24,
        order: 2,
    },
    {
        id: 'badge_soberania',
        name: 'Soberania Celular',
        description: 'Completou um jejum de 48 horas. Autofagia plena. Células renovadas.',
        icon: 'ShieldCheck',
        requiredHours: 48,
        order: 3,
    },
    {
        id: 'badge_mestre',
        name: 'Mestre da Forja',
        description: 'Completou um jejum de 72 horas. A conquista suprema do protocolo ancestral.',
        icon: 'Crown',
        requiredHours: 72,
        order: 4,
    },
];

async function main() {
    console.log('🏅 Seeding badges...');
    for (const badge of BADGES) {
        await prisma.badge.upsert({
            where: { id: badge.id },
            update: badge,
            create: badge,
        });
        console.log(`  ✓ ${badge.name}`);
    }
    console.log('✅ Badges seeded.');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
