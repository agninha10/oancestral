import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categories = [
        {
            name: 'O Fogo (Geral)',
            slug: 'geral',
            description: 'Discussões abertas sobre a jornada ancestral, apresentações e tópicos livres.',
            icon: '🔥',
            order: 0,
        },
        {
            name: 'Jejum & Dieta',
            slug: 'jejum-e-dieta',
            description: 'Protocolos de jejum, carnívora, cetogênica, carnivore e nutrição ancestral.',
            icon: '⚡',
            order: 1,
        },
        {
            name: 'Treino & Soberania',
            slug: 'treino-e-soberania',
            description: 'Força, resistência, treino funcional e domínio do corpo.',
            icon: '🏋️',
            order: 2,
        },
        {
            name: 'Mentalidade & Propósito',
            slug: 'mentalidade-e-proposito',
            description: 'Disciplina, estoicismo, controle emocional e construção de identidade masculina.',
            icon: '🧠',
            order: 3,
        },
    ];

    for (const cat of categories) {
        await prisma.forumCategory.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }

    console.log('✅ Forum categories seeded.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
