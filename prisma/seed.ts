import { PrismaClient, RecipeDifficulty, CategoryType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Helpers compartilhados ──────────────────────────────────────────────────

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

/** Rating determinístico por receita — valores entre 4.8–5.0 e 85–320 */
const RATING_VALUES = [4.8, 4.9, 5.0, 4.9, 4.8, 5.0, 4.9, 4.8, 5.0, 4.9, 4.8, 5.0, 4.9, 5.0, 4.8, 4.9, 5.0, 4.8, 4.9, 5.0];
const RATING_COUNTS = [127, 203, 156, 289, 95, 312, 178, 241, 108, 267, 142, 198, 305, 87, 231, 163, 278, 119, 254, 189];

function generateRating(index: number) {
    return {
        ratingValue: RATING_VALUES[index % RATING_VALUES.length],
        ratingCount: RATING_COUNTS[index % RATING_COUNTS.length],
    };
}

/** Imagem padrão por passo (fallback até ter fotos reais por etapa) */
const STEP_IMAGE = '/images/og-receitas.png';

/** Converte array de strings em objetos de instrução para RecipeInstruction + JSON-LD */
function buildInstructionData(slug: string, steps: string[]) {
    return steps.map((text, idx) => ({
        step: idx + 1,
        content: text,
        name: `Passo ${idx + 1}`,
        image: STEP_IMAGE,
        video: null as string | null,
    }));
}

// ── Função principal de upsert de receitas ──────────────────────────────────

async function upsertRecipes(
    recipesData: Array<{
        title: string;
        description: string;
        content: string;
        metaTitle?: string;
        metaDescription?: string;
        coverImageAlt?: string;
        tags: string[];
        prepTime: number;
        cookTime: number;
        servings: number;
        difficulty: RecipeDifficulty;
        ingredients: Array<{ name: string; amount: string; order: number }>;
        instructions: string[];
    }>,
    authorId: string,
    categoryId: string,
    globalIndex: number = 0,
) {
    for (let i = 0; i < recipesData.length; i++) {
        const recipe = recipesData[i];
        const slug = slugify(recipe.title);
        const rating = generateRating(globalIndex + i);

        const existing = await prisma.recipe.findUnique({ where: { slug } });

        if (!existing) {
            await prisma.recipe.create({
                data: {
                    title: recipe.title,
                    slug,
                    description: recipe.description,
                    content: recipe.content,
                    metaTitle: recipe.metaTitle,
                    metaDescription: recipe.metaDescription,
                    coverImageAlt: recipe.coverImageAlt,
                    tags: recipe.tags,
                    prepTime: recipe.prepTime,
                    cookTime: recipe.cookTime,
                    servings: recipe.servings,
                    difficulty: recipe.difficulty,
                    ratingValue: rating.ratingValue,
                    ratingCount: rating.ratingCount,
                    published: true,
                    authorId,
                    categoryId,
                    ingredients: {
                        create: recipe.ingredients.map(ing => ({
                            name: ing.name,
                            amount: ing.amount,
                            order: ing.order,
                        })),
                    },
                    instructions: {
                        create: buildInstructionData(slug, recipe.instructions),
                    },
                },
            });
            console.log(`  ✅ Receita criada: ${recipe.title}`);
        } else {
            // Atualiza SEO + rating sem sobrescrever edições manuais de conteúdo
            await prisma.recipe.update({
                where: { slug },
                data: {
                    metaTitle: recipe.metaTitle,
                    metaDescription: recipe.metaDescription,
                    coverImageAlt: recipe.coverImageAlt,
                    tags: recipe.tags,
                    ratingValue: rating.ratingValue,
                    ratingCount: rating.ratingCount,
                },
            });
            console.log(`  🔄 SEO+Rating atualizado: ${recipe.title}`);
        }
    }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
    // ── Categorias ──
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
            create: { name: cat.name, slug: cat.slug, type: cat.type as any },
        });
    }

    const blogCategories = [
        { name: 'Nutrição', slug: 'nutricao', type: 'BLOG' },
        { name: 'Jejum', slug: 'jejum-blog', type: 'BLOG' },
        { name: 'Treino', slug: 'treino', type: 'BLOG' },
        { name: 'Ancestralidade', slug: 'ancestralidade', type: 'BLOG' },
        { name: 'Mindset', slug: 'mindset', type: 'BLOG' },
        { name: 'Estilo de Vida', slug: 'estilo-de-vida', type: 'BLOG' },
        { name: 'Outros', slug: 'outros-blog', type: 'BLOG' },
    ];

    for (const cat of blogCategories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: { name: cat.name, slug: cat.slug, type: cat.type as any },
        });
    }

    console.log('📦 Categorias seedadas');

    // ── Admin User ──
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
            emailVerified: new Date(),
        },
    });
    console.log('👤 Admin seedado:', admin.email);

    // ══════════════════════════════════════════════════════════════════════════
    // CAPÍTULO 2 — Laticínios & Básicos Ancestrais
    // ══════════════════════════════════════════════════════════════════════════

    const cat2 = await prisma.category.upsert({
        where: { slug: slugify('Laticínios & Básicos Ancestrais') },
        update: {},
        create: {
            name: 'Laticínios & Básicos Ancestrais',
            slug: slugify('Laticínios & Básicos Ancestrais'),
            description: 'Receitas essenciais e fermentados básicos do Capítulo 2.',
            type: CategoryType.RECIPE,
        },
    });

    console.log('\n📖 Capítulo 2: Laticínios & Básicos Ancestrais');

    await upsertRecipes([
        {
            title: 'Pasteurização Caseira de Leite Cru',
            description: 'Método gentil para garantir a segurança do leite cru preservando enzimas e nutrientes. Ideal para quem busca os benefícios do leite in natura com segurança.',
            content: 'A pasteurização caseira a 63°C por 30 minutos elimina patógenos sem destruir todas as enzimas benéficas e a estrutura das proteínas, diferente do processo industrial UHT.',
            metaTitle: 'Como Pasteurizar Leite Cru em Casa com Segurança',
            metaDescription: 'Aprenda a pasteurizar leite cru em casa a 63°C preservando enzimas e nutrientes. Método ancestral seguro para uma saúde intestinal de verdade.',
            coverImageAlt: 'Panela com leite cru sendo pasteurizado em fogo baixo com termômetro culinário',
            tags: ['leite cru', 'pasteurizacao caseira', 'saude intestinal', 'dieta ancestral', 'low carb', 'dieta da selva'],
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
                'Armazene em potes de vidro esterilizados na geladeira por 5 a 7 dias.',
            ],
        },
        {
            title: 'Iogurte Caseiro Natural',
            description: 'Iogurte fermentado tradicional, rico em probióticos e sem aditivos.',
            content: 'O iogurte caseiro é uma forma simples de multiplicar os benefícios do leite através da fermentação. O tempo de fermentação define a acidez e consistência.',
            metaTitle: 'Iogurte Caseiro Natural Rico em Probióticos',
            metaDescription: 'Receita de iogurte caseiro fermentado naturalmente, rico em probióticos para fortalecer sua flora intestinal. Sem açúcar e sem aditivos.',
            coverImageAlt: 'Tigela de iogurte caseiro cremoso natural sem açúcar',
            tags: ['iogurte caseiro', 'probioticos', 'fermentacao', 'saude intestinal', 'low carb', 'dieta da selva', 'sem acucar'],
            prepTime: 15,
            cookTime: 0,
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
                'Leve à geladeira por pelo menos 2 horas antes de servir.',
            ],
        },
        {
            title: 'Kefir de Leite',
            description: 'Superalimento ancestral rico em probióticos, feito com grãos de kefir e leite.',
            content: 'O Kefir ajuda a equilibrar a saúde intestinal e fortalecer a imunidade. Os grãos são organismos vivos que transformam o leite em uma bebida poderosa.',
            metaTitle: 'Kefir de Leite Caseiro: Receita Fácil e Rápida',
            metaDescription: 'Como fazer kefir de leite em casa com grãos vivos. Superalimento ancestral rico em probióticos que fortalece a imunidade e o intestino.',
            coverImageAlt: 'Copo de kefir de leite cremoso ao lado de grãos de kefir',
            tags: ['kefir', 'probioticos', 'fermentacao', 'saude intestinal', 'superalimento', 'dieta ancestral', 'dieta da selva'],
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
                'Coe o líquido (o kefir pronto) e reserve os grãos para a próxima leva.',
            ],
        },
        {
            title: 'Queijo Labane Cremoso e Soro de Leite',
            description: 'Queijo cremoso tipo "cream cheese" feito a partir da dessora do iogurte. Gera o Soro de Leite (Whey) como subproduto nutritivo.',
            content: 'O Labane é versátil e pode ser temperado com azeite e ervas. O soro (whey) que sobra é rico em proteínas e ótimo para fermentar vegetais.',
            metaTitle: 'Queijo Labane Caseiro e Soro de Leite (Whey)',
            metaDescription: 'Receita de queijo labane cremoso feito com iogurte e soro de leite (whey) natural como bônus. Rico em proteínas, perfeito para dieta low carb.',
            coverImageAlt: 'Queijo labane cremoso temperado com azeite e ervas frescas em prato rústico',
            tags: ['labane', 'queijo caseiro', 'soro de leite', 'whey natural', 'low carb', 'probioticos', 'dieta da selva'],
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
                'Retire o queijo do pano, tempere a gosto e guarde na geladeira.',
            ],
        },
    ], admin.id, cat2.id, 0);

    console.log('\n🏁 Seed principal finalizado!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
