import { PrismaClient, RecipeDifficulty, CategoryType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

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

    // Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@oancestral.com' },
        update: {},
        create: {
            email: 'admin@oancestral.com',
            name: 'Admin',
            password: adminPassword,
            role: 'ADMIN',
            birthdate: new Date('1990-01-01'),
            emailVerified: true,
        },
    });

    console.log('Admin user seeded:', admin.email);

    // 2. Criar Categoria do Capítulo 2
    const categoryName = 'Laticínios & Básicos Ancestrais';
    const categorySlug = slugify(categoryName);

    const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: categoryName,
            slug: categorySlug,
            description: 'Receitas essenciais e fermentados básicos do Capítulo 2.',
            type: CategoryType.RECIPE,
        },
    });

    console.log(`📂 Categoria garantida: ${category.name}`);

    // 3. Dados das Receitas (Extraídos do PDF)
    const recipesData = [
        {
            title: 'Pasteurização Caseira de Leite Cru',
            description: 'Método gentil para garantir a segurança do leite cru preservando enzimas e nutrientes. Ideal para quem busca os benefícios do leite in natura com segurança.',
            content: 'A pasteurização caseira a 63°C por 30 minutos elimina patógenos sem destruir todas as enzimas benéficas e a estrutura das proteínas, diferente do processo industrial UHT.',
            prepTime: 5,
            cookTime: 40,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Leite cru fresco e de qualidade (preferencialmente de vacas a pasto)', amount: 'Quantidade desejada', order: 1 },
            ],
            instructions: [
                'Despeje o leite numa panela de fundo grosso, enchendo até a metade.',
                'Aqueça em fogo baixo a médio, mexendo ocasionalmente.',
                'Use um termômetro culinário para monitorar até atingir 63°C (145°F).',
                'Mantenha a temperatura em 63°C por exatos 30 minutos.',
                'Retire do fogo e faça um banho de gelo (coloque a panela em água com gelo) para resfriar rapidamente até 4°C.',
                'Armazene em potes de vidro esterilizados na geladeira por 5 a 7 dias.'
            ]
        },
        {
            title: 'Iogurte Caseiro Natural',
            description: 'Iogurte fermentado tradicional, rico em probióticos e sem aditivos.',
            content: 'O iogurte caseiro é uma forma simples de multiplicar os benefícios do leite através da fermentação. O tempo de fermentação define a acidez e consistência.',
            prepTime: 15,
            cookTime: 0, // O tempo principal é passivo (fermentação)
            servings: 8,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Leite integral (de preferência cru)', amount: '1 litro', order: 1 },
                { name: 'Iogurte natural sem açúcar (isca)', amount: '2 colheres', order: 2 },
            ],
            instructions: [
                'Preaqueça o forno a 240ºC por 15 minutos, depois desligue e mantenha a porta fechada (estufa).',
                'Aqueça o leite até ficar morno (45ºC) - teste do dedo: deve conseguir manter por 10s sem queimar.',
                'Misture o iogurte natural (isca) ao leite morno delicadamente.',
                'Cubra a tigela, envolva em um pano grosso ou toalha e coloque no forno desligado.',
                'Deixe fermentar por 8 a 24 horas. Quanto mais tempo, mais ácido.',
                'Leve à geladeira por pelo menos 2 horas antes de servir.'
            ]
        },
        {
            title: 'Kefir de Leite',
            description: 'Superalimento ancestral rico em probióticos, feito com grãos de kefir e leite.',
            content: 'O Kefir ajuda a equilibrar a saúde intestinal e fortalecer a imunidade. Os grãos são organismos vivos que transformam o leite em uma bebida poderosa.',
            prepTime: 5,
            cookTime: 0,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Leite integral de qualidade', amount: '2 xícaras', order: 1 },
                { name: 'Grãos de kefir', amount: '1 colher de sopa', order: 2 },
            ],
            instructions: [
                'Coloque o leite em temperatura ambiente em um pote de vidro limpo.',
                'Adicione os grãos de kefir ao leite.',
                'Cubra o pote com um pano ou papel toalha e prenda com elástico (para respirar).',
                'Deixe fermentar em temperatura ambiente por 18 a 24 horas.',
                'Mexa delicadamente após 12 horas.',
                'Coe o líquido (o kefir pronto) e reserve os grãos para a próxima leva.'
            ]
        },
        {
            title: 'Queijo Labane Cremoso e Soro de Leite',
            description: 'Queijo cremoso tipo "cream cheese" feito a partir da dessora do iogurte. Gera o Soro de Leite (Whey) como subproduto nutritivo.',
            content: 'O Labane é versátil e pode ser temperado com azeite e ervas. O soro (whey) que sobra é rico em proteínas e ótimo para fermentar vegetais.',
            prepTime: 10,
            cookTime: 0,
            servings: 6,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Iogurte natural (comercial ou caseiro)', amount: '1 litro', order: 1 },
                { name: 'Sal, azeite e ervas', amount: 'A gosto', order: 2 },
                { name: 'Pano tipo fralda ou pano de prato limpo', amount: '1 unidade', order: 3 },
            ],
            instructions: [
                'Abra o pano dentro de um recipiente fundo.',
                'Despeje o iogurte sobre o pano.',
                'Junte as pontas e amarre, formando uma "trouxinha". Não esprema.',
                'Pendure a trouxinha em local fresco com uma tigela embaixo para coletar o soro.',
                'Deixe pingar por 12 a 24 horas. Quando parar de pingar, o queijo está pronto.',
                'Guarde o soro líquido na geladeira para usar em outras receitas.',
                'Retire o queijo do pano, tempere a gosto e guarde na geladeira.'
            ]
        }
    ]

    // 4. Inserir Receitas
    for (const recipe of recipesData) {
        const slug = slugify(recipe.title);

        const existing = await prisma.recipe.findUnique({
            where: { slug }
        });

        if (!existing) {
            await prisma.recipe.create({
                data: {
                    title: recipe.title,
                    slug,
                    description: recipe.description,
                    content: recipe.content,
                    prepTime: recipe.prepTime,
                    cookTime: recipe.cookTime,
                    servings: recipe.servings,
                    difficulty: recipe.difficulty,
                    published: true,
                    authorId: admin.id, // Usa o ID do admin criado acima
                    categoryId: category.id,
                    ingredients: {
                        create: recipe.ingredients.map(ing => ({
                            name: ing.name,
                            amount: ing.amount,
                            order: ing.order
                        }))
                    },
                    instructions: {
                        create: recipe.instructions.map((inst, idx) => ({
                            step: idx + 1,
                            content: inst
                        }))
                    }
                }
            });
            console.log(`✅ Receita criada: ${recipe.title}`);
        } else {
            console.log(`⚠️ Receita já existe: ${recipe.title}`);
        }
    }

    console.log('🏁 Seed finalizado!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
