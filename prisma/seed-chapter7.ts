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
    console.log('🌱 Iniciando seed do Capítulo 7: Bebidas Fermentadas...')

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

    // 2. Criar Categoria do Capítulo 7
    const categoryName = 'Bebidas Fermentadas e Refrigerantes Naturais'
    const categorySlug = slugify(categoryName)

    const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: categoryName,
            slug: categorySlug,
            description: 'Refrigerantes naturais ricos em probióticos, feitos a partir de fermentação selvagem (Ginger Bug) ou cultura (Kombucha).',
            type: CategoryType.RECIPE,
        },
    })

    console.log(`📂 Categoria garantida: ${category.name}`)

    // 3. Dados das Receitas
    const recipesData = [
        {
            title: 'Ginger Bug (Iniciador de Fermentação)',
            description: 'A "mãe" de todos os refrigerantes naturais. Uma cultura viva feita apenas de gengibre e açúcar.',
            content: 'O Ginger Bug captura leveduras selvagens do ar e da casca do gengibre. É usado como base para gaseificar sucos e chás naturalmente.',
            metaTitle: 'Ginger Bug: Iniciador de Refrigerante Natural',
            metaDescription: 'Aprenda a fazer ginger bug, a cultura viva que transforma qualquer suco em refrigerante probiótico natural. Só gengibre, açúcar e água.',
            coverImageAlt: 'Pote de vidro com ginger bug borbulhando com gengibre ralado',
            tags: ['ginger bug', 'fermentacao', 'refrigerante natural', 'probioticos', 'gengibre', 'dieta da selva', 'dieta ancestral'],
            prepTime: 10,
            cookTime: 0, // Tempo ativo baixo, fermentação de 5 dias
            servings: 20, // Rende muitas porções de iniciador
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Gengibre fresco ralado (com casca, orgânico)', amount: '2 colheres de sopa (inicial) + alimentação diária', order: 1 },
                { name: 'Açúcar', amount: '2 colheres de sopa (inicial) + alimentação diária', order: 2 },
                { name: 'Água filtrada (sem cloro)', amount: '1 xícara', order: 3 },
            ],
            instructions: [
                'Dia 1: Misture 2 colheres de gengibre, 2 de açúcar e a água em um vidro. Cubra com pano/elástico.',
                'Dias 2 a 5: Todo dia, adicione mais 1 colher de gengibre ralado e 1 colher de açúcar. Mexa bem.',
                'Observe: Quando começar a borbulhar e tiver cheiro agradável de fermento, está pronto para usar.',
                'Uso: Coe o líquido para usar nas receitas e mantenha o bug vivo alimentando-o regularmente.',
                'Se não for usar, guarde na geladeira e alimente 1x por semana.'
            ]
        },
        {
            title: 'Refrigerante Caseiro de Limonada Fermentada',
            description: 'Uma limonada gaseificada naturalmente, rica em probióticos e com muito menos açúcar que a industrial.',
            content: 'Refrescante e digestiva, esta limonada utiliza o Ginger Bug para criar gás natural.',
            metaTitle: 'Limonada Fermentada: Refrigerante Probiótico',
            metaDescription: 'Limonada gaseificada naturalmente com ginger bug. Refrigerante caseiro probiótico com menos açúcar, refrescante e digestivo.',
            coverImageAlt: 'Copo de limonada fermentada com bolhas naturais e rodela de limão',
            tags: ['limonada fermentada', 'refrigerante natural', 'probioticos', 'ginger bug', 'low carb', 'dieta da selva', 'sem conservantes'],
            prepTime: 10,
            cookTime: 0,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Água filtrada', amount: '1 litro', order: 1 },
                { name: 'Suco de limão fresco', amount: 'Suco de 3 unidades', order: 2 },
                { name: 'Açúcar mascavo ou mel', amount: '1/4 de xícara', order: 3 },
                { name: 'Ginger Bug (líquido coado)', amount: '1/4 de xícara', order: 4 },
                { name: 'Raspas de limão (opcional)', amount: '1 unidade', order: 5 },
            ],
            instructions: [
                'Misture água, limão e açúcar até dissolver bem.',
                'Adicione o líquido do Ginger Bug e misture.',
                'Engarrafe em garrafa com tampa hermética (de pressão), deixando 2 dedos de espaço vazio.',
                'Deixe fermentar fora da geladeira por 24h a 48h até pegar gás (cuidado ao abrir!).',
                'Refrigere para parar a fermentação e sirva gelado.'
            ]
        },
        {
            title: 'Refrigerante de Chá Verde com Limão e Mel',
            description: 'Um chá gelado probiótico e antioxidante, levemente gaseificado.',
            content: 'Une os benefícios do chá verde com a fermentação natural.',
            metaTitle: 'Chá Verde Fermentado: Gelado e Probiótico',
            metaDescription: 'Chá verde fermentado com limão e mel, gaseificado naturalmente. Antioxidante e probiótico em uma bebida refrescante e funcional.',
            coverImageAlt: 'Garrafa de chá verde fermentado gelado com limão e mel',
            tags: ['cha verde fermentado', 'antioxidante', 'probioticos', 'refrigerante natural', 'ginger bug', 'dieta da selva', 'bebida funcional'],
            prepTime: 15,
            cookTime: 0,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Água filtrada', amount: '1 litro', order: 1 },
                { name: 'Chá verde (sachê ou folhas)', amount: '2 colheres/sachês', order: 2 },
                { name: 'Suco de limão', amount: 'Suco de 2 unidades', order: 3 },
                { name: 'Mel ou açúcar', amount: '1/4 de xícara', order: 4 },
                { name: 'Ginger Bug (líquido coado)', amount: '1/4 de xícara', order: 5 },
            ],
            instructions: [
                'Faça o chá verde com água quente (80°C) e deixe em infusão por 5 min. Coe e espere esfriar.',
                'Quando estiver em temperatura ambiente, adicione limão, mel e o Ginger Bug.',
                'Engarrafe hermeticamente e deixe fermentar por 24-48h.',
                'Quando estiver com gás, leve à geladeira.'
            ]
        },
        {
            title: 'Refrigerante de Abacaxi com Hortelã',
            description: 'Sabor tropical intenso, aproveitando a doçura natural da fruta para fermentar.',
            content: 'Uma das combinações mais saborosas de refrigerante natural.',
            metaTitle: 'Refrigerante de Abacaxi com Hortelã Natural',
            metaDescription: 'Refrigerante natural de abacaxi com hortelã, gaseificado por fermentação. Sabor tropical intenso, probiótico e sem conservantes.',
            coverImageAlt: 'Garrafa de refrigerante de abacaxi fermentado com folhas de hortelã',
            tags: ['refrigerante de abacaxi', 'hortela', 'fermentacao', 'probioticos', 'refrigerante natural', 'dieta da selva', 'sem conservantes'],
            prepTime: 15,
            cookTime: 0,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Abacaxi maduro picado', amount: '2 xícaras', order: 1 },
                { name: 'Água filtrada', amount: '1 litro', order: 2 },
                { name: 'Açúcar demerara', amount: '1/4 de xícara', order: 3 },
                { name: 'Hortelã fresca', amount: '8 folhas', order: 4 },
                { name: 'Ginger Bug (líquido)', amount: '1/4 de xícara', order: 5 },
            ],
            instructions: [
                'Bata o abacaxi com a água no liquidificador e coe bem (use voal se quiser bem límpido).',
                'Misture o açúcar ao suco.',
                'Adicione a hortelã (dê uma leve amassada nela para liberar aroma) e o Ginger Bug.',
                'Engarrafe e deixe fermentar por 24-48h até gaseificar.',
                'Refrigere antes de servir.'
            ]
        },
        {
            title: 'Kombucha Caseira',
            description: 'O famoso chá fermentado milenar, feito a partir da colônia SCOBY.',
            content: 'Rica em ácidos orgânicos e probióticos, a Kombucha é um tônico poderoso para a imunidade.',
            metaTitle: 'Kombucha Caseira: Guia Completo com SCOBY',
            metaDescription: 'Guia completo para fazer kombucha caseira com SCOBY. Chá fermentado milenar rico em probióticos e ácidos orgânicos para a imunidade.',
            coverImageAlt: 'Jarra de kombucha caseira com SCOBY visível e chá dourado',
            tags: ['kombucha', 'scoby', 'cha fermentado', 'probioticos', 'fermentacao', 'imunidade', 'dieta da selva', 'dieta ancestral'],
            prepTime: 30,
            cookTime: 0, // Fermentação de 7-14 dias
            servings: 12,
            difficulty: RecipeDifficulty.HARD,
            ingredients: [
                { name: 'SCOBY (Colônia de bactérias e leveduras)', amount: '1 unidade', order: 1 },
                { name: 'Kombucha pronta (Starter)', amount: '1/2 xícara', order: 2 },
                { name: 'Chá preto ou verde', amount: '4 sachês', order: 3 },
                { name: 'Açúcar orgânico', amount: '1 xícara', order: 4 },
                { name: 'Água filtrada', amount: '3 litros', order: 5 },
            ],
            instructions: [
                'Ferva 1 litro de água, faça o chá e dissolva o açúcar. Deixe esfriar completamente.',
                'Junte o chá doce frio com o restante da água no vidro fermentador.',
                'Adicione o SCOBY e o líquido starter.',
                'Cubra com pano e elástico (precisa respirar, mas sem entrar insetos).',
                'Deixe fermentar em local escuro e arejado por 7 a 14 dias.',
                'Prove após o 7º dia. Se estiver agridoce/ácido ao seu gosto, está pronto.',
                'Remova o SCOBY (guarde com um pouco de líquido para a próxima) e engarrafe o restante (pode saborizar na garrafa para 2ª fermentação).'
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

    console.log('🏁 Seed do Capítulo 7 finalizado!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })