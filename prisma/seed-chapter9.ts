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
    console.log('🌱 Iniciando seed do Capítulo 9: Arroz e Feijão Ancestral...')

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

    // 2. Criar Categoria do Capítulo 9
    const categoryName = 'Arroz e Feijão Ancestral'
    const categorySlug = slugify(categoryName)

    const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: categoryName,
            slug: categorySlug,
            description: 'Técnicas ancestrais para preparar os grãos do dia a dia, com foco na redução de antinutrientes e enriquecimento com caldos.',
            type: CategoryType.RECIPE,
        },
    })

    console.log(`📂 Categoria garantida: ${category.name}`)

    // 3. Dados das Receitas
    const recipesData = [
        {
            title: 'Feijão Ancestral',
            description: 'O feijão do dia a dia preparado com sabedoria: demolho ácido longo e cozimento com caldo de ossos.',
            content: 'A preparação ancestral reduz os gases e antinutrientes através da fermentação no demolho. O caldo de ossos adiciona minerais e sabor profundo.',
            prepTime: 20,
            cookTime: 120, // 2 horas (sem contar demolho)
            servings: 6,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Feijão (orgânico)', amount: '2 xícaras', order: 1 },
                { name: 'Vinagre de maçã ou limão (para demolho)', amount: '2 colheres de sopa', order: 2 },
                { name: 'Caldo de ossos caseiro', amount: '1 xícara (ou mais para cobrir)', order: 3 },
                { name: 'Cebola picada', amount: '1 unidade', order: 4 },
                { name: 'Alho picado', amount: '3 dentes', order: 5 },
                { name: 'Banha de porco ou azeite', amount: '2 colheres de sopa', order: 6 },
                { name: 'Folha de louro', amount: '1 unidade', order: 7 },
                { name: 'Salsinha ou coentro fresco', amount: 'A gosto', order: 8 },
            ],
            instructions: [
                'Lave o feijão e deixe de molho em água com vinagre/limão por 12 a 24 horas. Troque a água 1x.',
                'Descarte a água do demolho e enxágue bem.',
                'Cozinhe em fogo baixo por 1h30 a 2h (ou 30min na pressão) até ficar macio.',
                'Em outra panela, refogue cebola e alho na banha.',
                'Junte o feijão cozido, o caldo de ossos, louro e complete com água se precisar.',
                'Deixe apurar o caldo. Finalize com ervas frescas.'
            ]
        },
        {
            title: 'Arroz Ancestral com Caldo de Ossos e Ervas',
            description: 'Arroz enriquecido e digestivo, cozido no caldo de ossos após demolho.',
            content: 'Transforma um acompanhamento simples em uma fonte de colágeno e minerais. O demolho é essencial para o arroz integral.',
            prepTime: 10,
            cookTime: 20, // Tempo médio para arroz branco (integral leva 40-50)
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Arroz integral ou branco', amount: '1 xícara', order: 1 },
                { name: 'Caldo de ossos caseiro quente', amount: '2 xícaras', order: 2 },
                { name: 'Vinagre de maçã ou limão (demolho)', amount: '1 colher de sopa', order: 3 },
                { name: 'Manteiga, banha ou azeite', amount: '1 colher de sopa', order: 4 },
                { name: 'Alho picado', amount: '1 dente', order: 5 },
                { name: 'Cebola picada', amount: '1/2 unidade', order: 6 },
                { name: 'Ervas frescas (salsinha, tomilho)', amount: 'A gosto', order: 7 },
            ],
            instructions: [
                'Deixe o arroz de molho em água com vinagre por 8-12h. Escorra e enxágue.',
                'Refogue cebola e alho na gordura escolhida.',
                'Adicione o arroz e refogue por 1-2 minutos.',
                'Junte o caldo de ossos quente e o sal.',
                'Cozinhe em fogo baixo com tampa entreaberta até secar (15-20min branco, 40-50min integral).',
                'Deixe descansar tampado 5 min. Solte com garfo e adicione ervas.'
            ]
        },
        {
            title: '“Arroz” de Couve-Flor Ancestral',
            description: 'Alternativa low-carb e leve ao arroz tradicional, feita com vegetal crucífero.',
            content: 'Uma maneira deliciosa de aumentar o consumo de vegetais, mantendo a textura de acompanhamento.',
            prepTime: 10,
            cookTime: 7,
            servings: 3,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Couve-flor média', amount: '1 cabeça', order: 1 },
                { name: 'Manteiga ou banha', amount: '2 colheres de sopa', order: 2 },
                { name: 'Alho picado', amount: '1 dente', order: 3 },
                { name: 'Cebola picada', amount: '1/2 unidade', order: 4 },
                { name: 'Ervas frescas', amount: 'A gosto', order: 5 },
            ],
            instructions: [
                'Processe a couve-flor crua (pulsar) ou rale até ficar com textura de grãos de arroz.',
                'Refogue cebola e alho na gordura em frigideira grande.',
                'Adicione a couve-flor, sal e pimenta.',
                'Refogue por 5-7 minutos mexendo sempre (deve ficar macia mas com leve crocância, não papa).',
                'Finalize com ervas frescas.'
            ]
        },
        {
            title: 'Risoto de Arroz com Cogumelos',
            description: 'Um prato cremoso feito com arroz demolhado e caldo nutritivo.',
            content: 'O demolho prévio do arroz para risoto é um diferencial ancestral para digestibilidade.',
            prepTime: 15,
            cookTime: 25,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Arroz integral ou para risoto (demolho 12h)', amount: '1 xícara', order: 1 },
                { name: 'Caldo de ossos quente', amount: '3 xícaras', order: 2 },
                { name: 'Cogumelos frescos fatiados', amount: '1 xícara', order: 3 },
                { name: 'Azeite ou Ghee', amount: '2 colheres de sopa', order: 4 },
                { name: 'Vinho branco seco (opcional)', amount: '1/4 xícara', order: 5 },
                { name: 'Queijo ralado (opcional)', amount: '2 colheres de sopa', order: 6 },
            ],
            instructions: [
                'Refogue a cebola no azeite até ficar translúcida.',
                'Adicione alho e cogumelos, cozinhe até murcharem.',
                'Junte o arroz (já escorrido do demolho) e envolva no refogado.',
                'Adicione o vinho e deixe evaporar.',
                'Vá adicionando o caldo de ossos aos poucos, concha a concha, mexendo sempre até ficar cremoso (20-25min).',
                'Finalize com queijo e salsinha.'
            ]
        },
        {
            title: 'Risoto de Carne com Caldo de Ossos',
            description: 'Refeição completa e robusta: proteína, carboidrato fermentado e colágeno.',
            content: 'O uso de cubos de carne dourados traz sabor e saciedade a este risoto nutritivo.',
            prepTime: 20,
            cookTime: 30,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Arroz para risoto (demolho 12h)', amount: '1 xícara', order: 1 },
                { name: 'Carne bovina em cubos (músculo/patinho)', amount: '200g', order: 2 },
                { name: 'Caldo de ossos quente', amount: '3 xícaras', order: 3 },
                { name: 'Azeite ou Ghee', amount: '3 colheres de sopa', order: 4 },
                { name: 'Vinho tinto seco (opcional)', amount: '1/4 xícara', order: 5 },
                { name: 'Tomilho ou alecrim', amount: '1 colher de chá', order: 6 },
            ],
            instructions: [
                'Doure os cubos de carne no azeite e reserve.',
                'Na mesma panela, refogue cebola e alho.',
                'Adicione o arroz e envolva.',
                'Coloque o vinho e deixe evaporar.',
                'Adicione o caldo aos poucos, mexendo sempre.',
                'Após 10 minutos, devolva a carne para a panela.',
                'Cozinhe mexendo até o ponto cremoso (mais 15-20 min).',
                'Tempere com ervas e sirva.'
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

    console.log('🏁 Seed do Capítulo 9 finalizado!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })