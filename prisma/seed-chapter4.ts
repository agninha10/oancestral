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

async function main() {
    console.log('🌱 Iniciando seed do Capítulo 4: Grãos, Nozes e Sementes Germinadas...')

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

    // 2. Criar Categoria do Capítulo 4
    const categoryName = 'Grãos, Nozes e Sementes Germinadas'
    const categorySlug = slugify(categoryName)

    const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: categoryName,
            slug: categorySlug,
            description: 'Técnicas de germinação para redução de antinutrientes e receitas com grãos vivos.',
            type: CategoryType.RECIPE,
        },
    })

    console.log(`📂 Categoria garantida: ${category.name}`)

    // 3. Dados das Receitas
    const recipesData = [
        {
            title: 'Como Germinar Grãos, Sementes e Nozes (Guia Básico)',
            description: 'A técnica fundamental para despertar a vida nos alimentos, reduzir antinutrientes (fitatos) e multiplicar a biodisponibilidade de vitaminas.',
            content: 'A germinação transforma sementes adormecidas em superalimentos vivos. Funciona para trigo, lentilhas, feijões (moyashi, azuki), sementes de girassol, abóbora e muito mais.',
            prepTime: 10,
            cookTime: 0, // Tempo ativo baixo, processo leva dias
            servings: 10, // Porções variadas
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Grãos, sementes ou nozes de sua escolha (crus e integrais)', amount: '1 xícara', order: 1 },
                { name: 'Água filtrada', amount: 'Q.B.', order: 2 },
                { name: 'Pote de vidro de boca larga', amount: '1 unidade', order: 3 },
                { name: 'Pedaço de voal, gaze ou pano de prato limpo', amount: '1 unidade', order: 4 },
                { name: 'Elástico', amount: '1 unidade', order: 5 },
            ],
            instructions: [
                'Deixe os grãos de molho em água filtrada durante a noite (8-12h).',
                'No dia seguinte, escorra a água e enxágue bem.',
                'Coloque os grãos no vidro e cubra a boca com o pano/gaze, prendendo com o elástico.',
                'Vire o pote de cabeça para baixo (inclinado) em um escorredor ou bowl, para que a água drene e o ar circule.',
                'Mantenha em local fresco e sem luz solar direta.',
                'Enxágue os grãos através do pano duas vezes ao dia (manhã e noite). Em dias quentes, aumente a frequência.',
                'Repita o processo até os grãos começarem a brotar (o tempo varia por grão). Estão prontos para consumo!'
            ]
        },
        {
            title: 'Salada de Grãos Germinados com Molho de Tahine',
            description: 'Uma refeição completa, refrescante e cheia de enzimas vivas, utilizando a base de grãos germinados.',
            content: 'Esta salada combina a crocância dos vegetais frescos com a potência nutricional das lentilhas ou grão-de-bico germinados, finalizada com um molho rico em cálcio.',
            prepTime: 15,
            cookTime: 0,
            servings: 2,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Grãos germinados (lentilhas, trigo ou grão-de-bico)', amount: '1 xícara', order: 1 },
                { name: 'Pepino médio picado', amount: '1 unidade', order: 2 },
                { name: 'Tomate grande em cubos', amount: '1 unidade', order: 3 },
                { name: 'Cenoura média ralada', amount: '1 unidade', order: 4 },
                { name: 'Cebola roxa fatiada finamente', amount: '1/4 unidade', order: 5 },
                { name: 'Salsinha ou coentro fresco picado', amount: '2 colheres de sopa', order: 6 },
                { name: 'Azeite de oliva extra virgem', amount: '2 colheres de sopa', order: 7 },
                // Ingredientes do Molho
                { name: 'Tahine (pasta de gergelim)', amount: '2 colheres de sopa', order: 8 },
                { name: 'Suco de limão', amount: '1/2 unidade', order: 9 },
                { name: 'Mel ou xarope de bordo (opcional)', amount: '1 colher de chá', order: 10 },
                { name: 'Água filtrada', amount: '2 colheres de sopa (ajuste o ponto)', order: 11 },
                { name: 'Sal e pimenta', amount: 'A gosto', order: 12 },
            ],
            instructions: [
                'Lave bem os grãos germinados prontos e escorra.',
                'Em uma tigela grande, misture os grãos, pepino, tomate, cenoura, cebola e as ervas.',
                'Prepare o molho: misture o tahine, limão, mel, água e temperos até ficar cremoso e homogêneo.',
                'Regue a salada com o molho e misture bem.',
                'Finalize com um fio de azeite extra virgem. Sirva imediatamente ou refrigere por até 24h.'
            ]
        }
    ]

    // 4. Inserir Receitas
    for (const recipe of recipesData) {
        const slug = slugify(recipe.title)

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
                    prepTime: recipe.prepTime,
                    cookTime: recipe.cookTime,
                    servings: recipe.servings,
                    difficulty: recipe.difficulty,
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
                        create: recipe.instructions.map((inst, idx) => ({
                            step: idx + 1,
                            content: inst
                        }))
                    }
                }
            })
            console.log(`✅ Receita criada: ${recipe.title}`)
        } else {
            console.log(`⚠️ Receita já existe: ${recipe.title}`)
        }
    }

    console.log('🏁 Seed do Capítulo 4 finalizado!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
