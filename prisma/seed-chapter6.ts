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
                emailVerified: true
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
            content: 'O tahine (pasta de gergelim) é uma excelente fonte de minerais. Combinado com limão e alho, cria um sabor marcante.',
            prepTime: 5,
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
