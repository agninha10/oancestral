import { PrismaClient, RecipeDifficulty, CategoryType, Role } from '@prisma/client'

const prisma = new PrismaClient()

// Função utilitária para criar slugs
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
const RATING_VALUES = [4.8, 4.9, 5.0, 4.9, 4.8, 5.0, 4.9, 4.8, 5.0, 4.9, 4.8, 5.0, 4.9, 5.0, 4.8, 4.9, 5.0, 4.8, 4.9, 5.0]
const RATING_COUNTS = [127, 203, 156, 289, 95, 312, 178, 241, 108, 267, 142, 198, 305, 87, 231, 163, 278, 119, 254, 189]

function generateRating(index: number) {
    return {
        ratingValue: RATING_VALUES[index % RATING_VALUES.length],
        ratingCount: RATING_COUNTS[index % RATING_COUNTS.length],
    }
}

const STEP_IMAGE = '/images/og-receitas.png'

function buildInstructionData(steps: string[]) {
    return steps.map((text, idx) => ({
        step: idx + 1,
        content: text,
        name: `Passo ${idx + 1}`,
        image: STEP_IMAGE,
        video: null as string | null,
    }))
}

async function main() {
    console.log('🌱 Iniciando seed do Capítulo 6: Molhos de Saladas Nutritivos...')

    // 1. Definir o Autor
    let author = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    })

    if (!author) {
        author = await prisma.user.findFirst()
    }

    if (!author) {
        console.log('⚠️ Nenhum usuário encontrado. Criando usuário Admin padrão...')
        author = await prisma.user.create({
            data: {
                email: 'admin@receitas.com',
                name: 'Admin',
                password: '$2b$10$EpRnTzVlqHNP0.fKbXTn3.E9Geb/1ZNSInv8uYEf.K.j.',
                birthdate: new Date(),
                role: Role.ADMIN,
                emailVerified: new Date()
            }
        })
    }

    // 2. Criar Categoria do Capítulo 6
    const categoryName = 'Molhos de Saladas Nutritivos'
    const categorySlug = slugify(categoryName)

    const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: categoryName,
            slug: categorySlug,
            description: 'Molhos caseiros ricos em gorduras saudáveis e probióticos para aumentar a absorção de nutrientes das saladas.',
            type: CategoryType.RECIPE,
        },
    })

    console.log(`📂 Categoria garantida: ${category.name}`)

    // 3. Dados das Receitas
    const recipesData = [
        {
            title: 'Molho Básico de Salada',
            description: 'Um vinagrete funcional enriquecido com óleo de linhaça para aporte de Ômega-3.',
            content: 'Simples e rápido, este molho combina a acidez do vinagre de maçã com gorduras boas, essencial para absorver as vitaminas lipossolúveis (A, D, E, K) dos vegetais.',
            metaTitle: 'Vinagrete Funcional com Ômega-3 e Linhaça',
            metaDescription: 'Molho de salada funcional com azeite e óleo de linhaça rico em Ômega-3. Essencial para absorver vitaminas A, D, E e K dos vegetais.',
            coverImageAlt: 'Molheira com vinagrete dourado de azeite e linhaça sobre salada',
            tags: ['vinagrete', 'omega 3', 'linhaca', 'molho de salada', 'gorduras boas', 'low carb', 'dieta da selva', 'dieta ancestral'],
            prepTime: 5,
            cookTime: 0,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Mostarda Dijon', amount: '1 colher de chá', order: 1 },
                { name: 'Vinagre de vinho ou maçã orgânico', amount: '3 colheres de sopa', order: 2 },
                { name: 'Azeite de oliva extra virgem', amount: '1/2 xícara', order: 3 },
                { name: 'Óleo de linhaça', amount: '1/2 colher de chá', order: 4 },
                { name: 'Sal marinho', amount: 'A gosto', order: 5 },
            ],
            instructions: [
                'Coloque todos os ingredientes em um pote de vidro ou tigela pequena.',
                'Misture vigorosamente com um garfo ou agite o pote fechado até emulsionar.',
                'Sirva imediatamente sobre a salada de sua preferência.'
            ]
        },
        {
            title: 'Molho de Tahine Cremoso',
            description: 'Rico em cálcio e gorduras boas, este molho traz cremosidade sem laticínios.',
            content: 'O tahine (pasta de gergelim) é uma excelente fonte de minerais. Combinado com limão e alho, cria um sabor marcante.',            metaTitle: 'Molho de Tahine Cremoso Rico em Cálcio',
            metaDescription: 'Molho de tahine cremoso sem lacticínios, rico em cálcio e minerais. Receita rápida para saladas e vegetais na dieta ancestral.',
            coverImageAlt: 'Tigela com molho de tahine cremoso com limão e alho',
            tags: ['tahine', 'molho cremoso', 'calcio', 'sem lactose', 'low carb', 'dieta ancestral', 'dieta da selva', 'gorduras boas'],            prepTime: 5,
            cookTime: 0,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Tahine (pasta de gergelim)', amount: '2 colheres de sopa', order: 1 },
                { name: 'Dente de alho amassado', amount: '1 unidade', order: 2 },
                { name: 'Limão espremido', amount: '1/2 unidade', order: 3 },
                { name: 'Azeite de oliva', amount: '2 colheres de sopa', order: 4 },
                { name: 'Água filtrada', amount: '2 colheres de sopa (ou mais para ajustar)', order: 5 },
                { name: 'Cominho em pó', amount: 'Uma pitada', order: 6 },
                { name: 'Sal', amount: 'A gosto', order: 7 },
            ],
            instructions: [
                'Em uma tigela, misture o tahine, alho, limão, azeite e temperos.',
                'Adicione a água aos poucos, mexendo sempre.',
                'O molho vai endurecer primeiro e depois ficar cremoso. Continue adicionando água até atingir a consistência desejada.'
            ]
        },
        {
            title: 'Molho de Kefir com Ervas',
            description: 'Um molho probiótico refrescante, similar ao Ranch, mas natural e vivo.',
            content: 'Utiliza o Kefir de leite (ou iogurte natural) como base, adicionando bactérias benéficas à sua salada.',
            metaTitle: 'Molho de Kefir com Ervas: Ranch Probiótico',
            metaDescription: 'Molho tipo ranch feito com kefir de leite e ervas frescas. Probiótico natural e vivo que transforma qualquer salada em alimento funcional.',
            coverImageAlt: 'Molho branco de kefir com ervas frescas picadas em potinho',
            tags: ['molho de kefir', 'probioticos', 'ranch natural', 'ervas frescas', 'saude intestinal', 'low carb', 'dieta da selva'],
            prepTime: 5,
            cookTime: 0,
            servings: 2,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Kefir de leite ou iogurte natural', amount: '1/4 de xícara', order: 1 },
                { name: 'Azeite ou manteiga clarificada derretida', amount: '2 colheres de sopa', order: 2 },
                { name: 'Ervas frescas picadas (salsinha, cebolinha, endro)', amount: '1 colher de sopa', order: 3 },
                { name: 'Sal marinho e pimenta', amount: 'A gosto', order: 4 },
            ],
            instructions: [
                'Pique bem as ervas frescas.',
                'Em uma tigela, misture o kefir com o azeite até incorporar.',
                'Adicione as ervas e tempere com sal e pimenta.',
                'Misture bem e sirva. Conservar na geladeira.'
            ]
        },
        {
            title: 'Molho Pesto Ancestral',
            description: 'Versão funcional do clássico italiano, utilizando nozes germinadas para maior digestibilidade.',
            content: 'Rico em antioxidantes do manjericão e gorduras boas das nozes e azeite. Perfeito para saladas ou vegetais assados.',
            metaTitle: 'Pesto Ancestral com Nozes Germinadas',
            metaDescription: 'Pesto caseiro com nozes germinadas para máxima digestibilidade. Rico em antioxidantes do manjericão e gorduras boas do azeite extra virgem.',
            coverImageAlt: 'Pote de molho pesto verde vibrante com nozes e manjericão fresco',
            tags: ['pesto', 'nozes germinadas', 'manjericao', 'antioxidantes', 'gorduras boas', 'low carb', 'dieta ancestral', 'dieta da selva'],
            prepTime: 10,
            cookTime: 0,
            servings: 6,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Manjericão fresco', amount: '1 maço', order: 1 },
                { name: 'Nozes ou castanhas germinadas', amount: '1/4 de xícara', order: 2 },
                { name: 'Azeite extra virgem', amount: '1/4 de xícara', order: 3 },
                { name: 'Queijo parmesão ralado (ou de leite cru)', amount: '2 colheres de sopa', order: 4 },
                { name: 'Alho pequeno', amount: '1 dente', order: 5 },
                { name: 'Suco de limão (opcional)', amount: '1/2 unidade', order: 6 },
            ],
            instructions: [
                'Coloque manjericão, nozes, azeite, queijo e alho no processador.',
                'Bata até formar uma pasta homogênea (pode deixar pedacinhos se preferir rústico).',
                'Se ficar muito grosso, adicione mais azeite.',
                'Tempere com sal, pimenta e limão se desejar. Bata rapidamente para misturar.'
            ]
        },
        {
            title: 'Guacamole Ancestral',
            description: 'Mais que um molho, um acompanhamento rico em gorduras monoinsaturadas.',
            content: 'Perfeito para acompanhar saladas, carnes ou vegetais crus. O segredo é usar o limão imediatamente para não oxidar.',
            metaTitle: 'Guacamole Ancestral Rico em Gorduras Boas',
            metaDescription: 'Guacamole caseiro rico em gorduras monoinsaturadas do abacate. Acompanhamento perfeito para carnes e saladas na dieta ancestral.',
            coverImageAlt: 'Tigela de guacamole fresco com abacate, tomate e coentro',
            tags: ['guacamole', 'abacate', 'gorduras boas', 'monoinsaturadas', 'low carb', 'dieta ancestral', 'dieta da selva', 'acompanhamento'],
            prepTime: 10,
            cookTime: 0,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Abacates maduros', amount: '2 unidades', order: 1 },
                { name: 'Suco de limão', amount: '1 unidade', order: 2 },
                { name: 'Tomate pequeno em cubos', amount: '1 unidade', order: 3 },
                { name: 'Cebola roxa picada finamente', amount: '1/4 unidade', order: 4 },
                { name: 'Alho amassado', amount: '1 dente', order: 5 },
                { name: 'Azeite de oliva', amount: '1 colher de sopa', order: 6 },
                { name: 'Coentro fresco picado', amount: '1 colher de sopa', order: 7 },
            ],
            instructions: [
                'Retire a polpa do abacate e amasse com um garfo (deixe alguns pedaços para textura).',
                'Adicione o limão imediatamente e misture.',
                'Junte o tomate, cebola, alho, azeite e coentro.',
                'Tempere com sal, pimenta e cominho (opcional). Misture e sirva.'
            ]
        }
    ]

    // 4. Inserir Receitas
    for (let i = 0; i < recipesData.length; i++) {
        const recipe = recipesData[i]
        const slug = slugify(recipe.title)
        const rating = generateRating(i)

        const existing = await prisma.recipe.findUnique({
            where: { slug }
        })

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
                    authorId: author.id,
                    categoryId: category.id,
                    ingredients: {
                        create: recipe.ingredients.map(ing => ({
                            name: ing.name,
                            amount: ing.amount,
                            order: ing.order
                        }))
                    },
                    instructions: {
                        create: buildInstructionData(recipe.instructions),
                    }
                }
            })
            console.log(`✅ Receita criada: ${recipe.title}`)
        } else {
            // Atualiza APENAS os campos de SEO sem sobrescrever edições manuais
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
            })
            console.log(`🔄 SEO atualizado: ${recipe.title}`)
        }
    }

    console.log('🏁 Seed do Capítulo 6 finalizado!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
