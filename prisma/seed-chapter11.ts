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
    console.log('🌱 Iniciando seed do Capítulo 11: Frango - Versatilidade e Nutrição Ancestral...')

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

    // 2. Criar Categoria do Capítulo 11
    const categoryName = 'Frango: Versatilidade e Nutrição Ancestral'
    const categorySlug = slugify(categoryName)

    const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: categoryName,
            slug: categorySlug,
            description: 'Receitas ancestrais de frango, valorizando todas as partes da ave, incluindo miúdos e ossos.',
            type: CategoryType.RECIPE,
        },
    })

    console.log(`📂 Categoria garantida: ${category.name}`)

    // 3. Dados das Receitas
    const recipesData = [
        {
            title: 'Coxa de Frango ao Molho de Mostarda e Mel',
            description: 'Coxas suculentas assadas com um molho agridoce clássico.',
            content: 'Uma preparação simples que eleva o sabor do frango com ingredientes funcionais como a mostarda e o mel.',
            prepTime: 10,
            cookTime: 45,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Coxas de frango', amount: '8 unidades', order: 1 },
                { name: 'Mostarda Dijon', amount: '3 colheres de sopa', order: 2 },
                { name: 'Mel', amount: '2 colheres de sopa', order: 3 },
                { name: 'Azeite ou manteiga', amount: '1 colher de sopa', order: 4 },
                { name: 'Páprica doce', amount: '1 colher de chá', order: 5 },
                { name: 'Sal e pimenta', amount: 'A gosto', order: 6 },
            ],
            instructions: [
                'Preaqueça o forno a 200°C.',
                'Misture mostarda, mel, páprica, azeite, sal e pimenta.',
                'Passe a mistura nas coxas e disponha na assadeira.',
                'Asse por 40-45 min, virando na metade para dourar os dois lados.'
            ],
            metaTitle: 'Coxa de Frango com Mostarda e Mel Ancestral',
            metaDescription: 'Coxas de frango suculentas assadas com molho de mostarda Dijon e mel. Receita ancestral simples, funcional e deliciosa para o dia a dia.',
            coverImageAlt: 'Coxas de frango assadas douradas com molho de mostarda e mel brilhante',
            tags: ['frango assado', 'mostarda e mel', 'receita ancestral', 'dieta da selva', 'funcional', 'proteína']
        },
        {
            title: 'Moela de Frango com Molho de Tomate e Páprica',
            description: 'Miúdos nutritivos preparados lentamente para ficarem macios.',
            content: 'A moela é uma excelente fonte de proteínas e minerais, ficando deliciosa quando cozida lentamente no molho.',
            prepTime: 15,
            cookTime: 60,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Moelas de frango limpas', amount: '500 g', order: 1 },
                { name: 'Banha ou manteiga', amount: '2 colheres de sopa', order: 2 },
                { name: 'Cebola picada', amount: '1 unidade', order: 3 },
                { name: 'Alho picado', amount: '3 dentes', order: 4 },
                { name: 'Tomates maduros picados', amount: '4 unidades', order: 5 },
                { name: 'Páprica doce', amount: '1 colher de chá', order: 6 },
                { name: 'Caldo de galinha', amount: '1 xícara', order: 7 },
            ],
            instructions: [
                'Refogue cebola e alho na banha.',
                'Adicione as moelas, sal, pimenta e páprica.',
                'Junte tomates e caldo.',
                'Cozinhe em fogo baixo com tampa por 1h até amaciar.'
            ],
            metaTitle: 'Moela de Frango ao Molho de Tomate e Páprica',
            metaDescription: 'Moela de frango macia cozida lentamente em molho de tomate com páprica. Fonte econômica de proteínas e minerais na dieta ancestral.',
            coverImageAlt: 'Moela de frango em molho de tomate com páprica doce servida em panela',
            tags: ['moela de frango', 'miúdos', 'vísceras', 'proteína', 'dieta da selva', 'receita econômica']
        },
        {
            title: 'Frango ao Leite de Coco e Gengibre',
            description: 'Prato aromático com influência asiática e gorduras saudáveis.',
            content: 'O leite de coco traz cremosidade e o gengibre adiciona propriedades anti-inflamatórias.',
            prepTime: 15,
            cookTime: 25,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Peito ou sobrecoxa em pedaços', amount: '500 g', order: 1 },
                { name: 'Gengibre ralado', amount: '1 colher de sopa', order: 2 },
                { name: 'Leite de coco', amount: '1 xícara', order: 3 },
                { name: 'Caldo de frango caseiro', amount: '1 xícara', order: 4 },
                { name: 'Cebola e alho', amount: '1 un / 2 dentes', order: 5 },
            ],
            instructions: [
                'Refogue cebola, alho e gengibre no azeite.',
                'Doure o frango temperado.',
                'Adicione leite de coco e caldo.',
                'Cozinhe por 15 min até o molho reduzir e engrossar.'
            ],
            metaTitle: 'Frango ao Leite de Coco e Gengibre Ancestral',
            metaDescription: 'Frango cremoso ao leite de coco com gengibre anti-inflamatório. Receita ancestral aromática rica em gorduras saudáveis e especiarias.',
            coverImageAlt: 'Frango ao leite de coco cremoso com gengibre ralado e ervas frescas',
            tags: ['frango', 'leite de coco', 'gengibre', 'anti-inflamatório', 'dieta da selva', 'gorduras saudáveis']
        },
        {
            title: 'Asas de Frango Assadas com Páprica Defumada',
            description: 'Asinhas crocantes e cheias de sabor, perfeitas para petiscar.',
            content: 'A páprica defumada dá um toque especial de churrasco sem precisar de grelha.',
            prepTime: 10,
            cookTime: 40,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Asas de frango', amount: '1 kg', order: 1 },
                { name: 'Azeite ou banha', amount: '2 colheres de sopa', order: 2 },
                { name: 'Páprica defumada', amount: '1 colher de chá', order: 3 },
                { name: 'Alho em pó', amount: '1 colher de chá', order: 4 },
            ],
            instructions: [
                'Tempere as asas com azeite, páprica, alho em pó, sal e pimenta.',
                'Asse a 200°C por 40 min.',
                'Vire na metade do tempo para dourar por igual.'
            ],
            metaTitle: 'Asas de Frango Crocantes com Páprica Defumada',
            metaDescription: 'Asinhas de frango crocantes assadas com páprica defumada. Petisco ancestral saboroso, sem fritura e sem ultraprocessados.',
            coverImageAlt: 'Asas de frango crocantes e douradas temperadas com páprica defumada',
            tags: ['asas de frango', 'páprica defumada', 'petisco ancestral', 'sem fritura', 'dieta da selva', 'low carb']
        },
        {
            title: 'Curry de Frango com Leite de Coco',
            description: 'Um clássico reconfortante rico em cúrcuma e especiarias.',
            content: 'Combina vegetais e proteínas em um molho dourado e nutritivo.',
            prepTime: 20,
            cookTime: 30,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Frango em pedaços', amount: '500 g', order: 1 },
                { name: 'Leite de coco', amount: '1 xícara', order: 2 },
                { name: 'Caldo de frango', amount: '2 xícaras', order: 3 },
                { name: 'Curry em pó', amount: '2 colheres de sopa', order: 4 },
                { name: 'Gengibre ralado', amount: '1 colher de sopa', order: 5 },
                { name: 'Tomate e cenoura picados', amount: '1 un de cada', order: 6 },
            ],
            instructions: [
                'Refogue alho, cebola e gengibre.',
                'Doure o frango.',
                'Adicione curry, tomate e cenoura.',
                'Cubra com leite de coco e caldo. Cozinhe por 20-30 min.',
                'Finalize com coentro.'
            ],
            metaTitle: 'Curry de Frango com Leite de Coco e Cúrcuma',
            metaDescription: 'Curry de frango ancestral com leite de coco, cúrcuma e especiarias anti-inflamatórias. Receita reconfortante e nutritiva com caldo de ossos.',
            coverImageAlt: 'Curry dourado de frango com leite de coco, legumes e coentro fresco',
            tags: ['curry de frango', 'leite de coco', 'cúrcuma', 'anti-inflamatório', 'dieta da selva', 'especiarias']
        },
        {
            title: 'Frango ao Molho de Cogumelos com Creme de Leite Fresco',
            description: 'Prato sofisticado e cremoso, ideal para um jantar especial.',
            content: 'O creme de leite fresco traz gorduras naturais e textura aveludada.',
            prepTime: 15,
            cookTime: 20,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Frango em pedaços', amount: '500 g', order: 1 },
                { name: 'Cogumelos frescos fatiados', amount: '250 g', order: 2 },
                { name: 'Creme de leite fresco', amount: '1 xícara', order: 3 },
                { name: 'Caldo de frango', amount: '1 xícara', order: 4 },
                { name: 'Manteiga', amount: '2 colheres de sopa', order: 5 },
            ],
            instructions: [
                'Sele o frango na manteiga e reserve.',
                'Refogue cebola e alho. Adicione os cogumelos.',
                'Volte o frango, adicione creme de leite e caldo.',
                'Cozinhe por 10-15 min até engrossar. Finalize com salsa.'
            ],
            metaTitle: 'Frango ao Molho de Cogumelos Cremoso Ancestral',
            metaDescription: 'Frango cremoso ao molho de cogumelos com creme de leite fresco. Prato sofisticado e ancestral, rico em gorduras naturais e sabor.',
            coverImageAlt: 'Frango em molho cremoso de cogumelos frescos com salsa picada',
            tags: ['frango', 'cogumelos', 'creme de leite', 'gorduras naturais', 'dieta da selva', 'jantar especial']
        },
        {
            title: 'Frango ao Molho de Vinho Branco e Ervas',
            description: 'Frango aromático cozido lentamente no vinho e caldo de ossos.',
            content: 'O vinho branco traz acidez e complexidade ao molho.',
            prepTime: 15,
            cookTime: 30,
            servings: 3,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Pedaços de frango (6 un)', amount: '6 unidades', order: 1 },
                { name: 'Vinho branco seco', amount: '1 xícara', order: 2 },
                { name: 'Caldo de ossos', amount: '1 xícara', order: 3 },
                { name: 'Tomilho e louro', amount: 'A gosto', order: 4 },
            ],
            instructions: [
                'Sele o frango e reserve. Refogue cebola e alho.',
                'Deglaceie com vinho branco.',
                'Volte o frango e adicione caldo e ervas.',
                'Cozinhe tampado por 20-25 min.'
            ],
            metaTitle: 'Frango ao Vinho Branco com Ervas Frescas',
            metaDescription: 'Frango aromático cozido em vinho branco e caldo de ossos com ervas frescas. Receita ancestral francesa elegante e nutritiva.',
            coverImageAlt: 'Pedaços de frango em molho de vinho branco com tomilho e louro',
            tags: ['frango ao vinho', 'vinho branco', 'caldo de ossos', 'ervas frescas', 'dieta da selva', 'receita francesa']
        },
        {
            title: 'Sopa de Frango com Legumes',
            description: 'A sopa curativa definitiva, feita com caldo de ossos e vegetais.',
            content: 'Perfeita para aumentar a imunidade e aproveitar sobras de frango.',
            prepTime: 15,
            cookTime: 25,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Frango cozido desfiado', amount: '2 xícaras', order: 1 },
                { name: 'Caldo de ossos', amount: '1 litro', order: 2 },
                { name: 'Legumes (cenoura, batata-doce, abobrinha)', amount: '1 un de cada', order: 3 },
                { name: 'Salsão (opcional)', amount: '1 talo', order: 4 },
            ],
            instructions: [
                'Refogue cebola, alho e salsão.',
                'Adicione cenoura, batata e caldo. Cozinhe 10 min.',
                'Adicione abobrinha e frango. Cozinhe mais 10 min.',
                'Ajuste temperos e sirva.'
            ],
            metaTitle: 'Sopa de Frango Curativa com Caldo de Ossos',
            metaDescription: 'Sopa de frango com caldo de ossos e legumes frescos: receita curativa ancestral para aumentar a imunidade e nutrir o corpo inteiro.',
            coverImageAlt: 'Sopa de frango com cenoura, batata-doce e legumes em caldo dourado',
            tags: ['sopa de frango', 'caldo de ossos', 'imunidade', 'receita curativa', 'dieta da selva', 'gut healing']
        },
        {
            title: 'Coração de Galinha Salteado com Ervas e Alho',
            description: 'Fonte rica de Coenzima Q10, preparada de forma simples e saborosa.',
            content: 'Corações são superalimentos que devem ser consumidos regularmente.',
            prepTime: 10,
            cookTime: 10,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Coração de galinha', amount: '500 g', order: 1 },
                { name: 'Banha ou manteiga', amount: '2 colheres de sopa', order: 2 },
                { name: 'Alho picado', amount: '3 dentes', order: 3 },
                { name: 'Ervas frescas', amount: '2 colheres de sopa', order: 4 },
            ],
            instructions: [
                'Refogue os corações na gordura quente por 5-7 min (não encha a frigideira).',
                'Adicione alho e cebola, refogue mais 2 min.',
                'Tempere com sal, pimenta, páprica e ervas.',
                'Sirva imediatamente.'
            ],
            metaTitle: 'Coração de Galinha Salteado: Rico em Coenzima Q10',
            metaDescription: 'Coração de galinha salteado com ervas e alho: superalimento rico em Coenzima Q10 e proteínas. Preparação rápida e ancestral.',
            coverImageAlt: 'Corações de galinha salteados com alho e ervas frescas em frigideira',
            tags: ['coração de galinha', 'coenzima Q10', 'vísceras', 'superalimento', 'dieta da selva', 'organ meats']
        },
        {
            title: 'Patê de Fígado de Galinha',
            description: 'A maneira mais deliciosa de consumir o superalimento que é o fígado.',
            content: 'Rico em ferro e vitamina A, este patê é cremoso e versátil.',
            prepTime: 15,
            cookTime: 10,
            servings: 8,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Fígado de galinha limpo', amount: '300 g', order: 1 },
                { name: 'Banha ou manteiga', amount: '2 colheres de sopa', order: 2 },
                { name: 'Cebola e alho', amount: '1 un / 2 dentes', order: 3 },
                { name: 'Vinagre de maçã ou limão', amount: '1 colher de sopa', order: 4 },
            ],
            instructions: [
                'Refogue cebola e alho na gordura.',
                'Adicione os fígados e cozinhe por 5-7 min (deve ficar rosado dentro).',
                'Tempere e bata no processador com o vinagre até virar creme.',
                'Refrigere por até 3 dias.'
            ],
            metaTitle: 'Patê de Fígado de Galinha Cremoso e Nutritivo',
            metaDescription: 'Patê de fígado de galinha cremoso: rico em ferro, vitamina A e B12. A maneira mais deliciosa de consumir vísceras na dieta ancestral.',
            coverImageAlt: 'Patê cremoso de fígado de galinha servido com ervas frescas',
            tags: ['patê de fígado', 'fígado de galinha', 'ferro', 'vitamina A', 'dieta da selva', 'vísceras']
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
                    metaTitle: recipe.metaTitle,
                    metaDescription: recipe.metaDescription,
                    coverImageAlt: recipe.coverImageAlt,
                    tags: recipe.tags,
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
            await prisma.recipe.update({
                where: { slug },
                data: {
                    metaTitle: recipe.metaTitle,
                    metaDescription: recipe.metaDescription,
                    coverImageAlt: recipe.coverImageAlt,
                    tags: recipe.tags,
                }
            })
            console.log(`🔄 SEO atualizado: ${recipe.title}`)
        }
    }

    console.log('🏁 Seed do Capítulo 11 finalizado!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })