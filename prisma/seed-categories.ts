import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Recipe Categories
    const recipeCategories = [
        { name: 'Carnívora', slug: 'carnivora', type: 'RECIPE' },
        { name: 'Low Carb', slug: 'low-carb', type: 'RECIPE' },
        { name: 'Keto', slug: 'keto', type: 'RECIPE' },
        { name: 'Paleo', slug: 'paleo', type: 'RECIPE' },
        { name: 'Ancestral', slug: 'ancestral', type: 'RECIPE' },
        { name: 'Jejum', slug: 'jejum', type: 'RECIPE' },
        { name: 'Outros', slug: 'outros-receitas', type: 'RECIPE' },
    ];

    for (const cat of recipeCategories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                type: cat.type as any,
            },
        });
    }

    // Blog Categories
    const blogCategories = [
        { name: 'Nutrição', slug: 'nutricao', type: 'BLOG' },
        { name: 'Jejum', slug: 'jejum-blog', type: 'BLOG' },
        { name: 'Treino', slug: 'treino', type: 'BLOG' },
        { name: 'Mindset', slug: 'mindset', type: 'BLOG' },
        { name: 'Estilo de Vida', slug: 'estilo-de-vida', type: 'BLOG' },
        { name: 'Outros', slug: 'outros-blog', type: 'BLOG' },
    ];

    for (const cat of blogCategories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                type: cat.type as any,
            },
        });
    }

    console.log('Categories seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
