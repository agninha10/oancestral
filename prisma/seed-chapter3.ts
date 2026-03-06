import { PrismaClient, RecipeDifficulty, CategoryType, Role } from '@prisma/client'

const prisma = new PrismaClient()

// Função utilitária para criar slugs de URL
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
    console.log('🌱 Iniciando seed do Capítulo 3: Frutas e Vegetais Fermentados...')

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

    // 2. Criar Categoria do Capítulo 3
    const categoryName = 'Frutas e Vegetais Fermentados'
    const categorySlug = slugify(categoryName)

    const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: categoryName,
            slug: categorySlug,
            description: 'Receitas de fermentação natural de vegetais e frutas para preservação e probióticos.',
            type: CategoryType.RECIPE,
        },
    })

    console.log(`📂 Categoria garantida: ${category.name}`)

    // 3. Dados das Receitas
    const recipesData = [
        {
            title: 'Chucrute Tradicional',
            description: 'Um tesouro probiótico feito apenas com repolho e sal. Melhora a digestão e fortalece o intestino.',
            content: 'O chucrute é um dos alimentos fermentados mais antigos. Rico em bactérias benéficas, é simples de preparar e se conserva por muito tempo.',
            metaTitle: 'Chucrute Tradicional: Receita Probiótica Caseira',
            metaDescription: 'Aprenda a fazer chucrute caseiro fermentado naturalmente. Rico em probióticos para fortalecer o intestino e melhorar a digestão.',
            coverImageAlt: 'Pote de vidro com chucrute caseiro de repolho fermentado',
            tags: ['chucrute', 'fermentacao', 'probioticos', 'saude intestinal', 'low carb', 'dieta da selva', 'conserva natural'],
            prepTime: 20,
            cookTime: 0,
            servings: 10,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Repolho médio orgânico (verde ou roxo), cortado bem fininho', amount: '1 unidade', order: 1 },
                { name: 'Semente de cominho', amount: '1 colher', order: 2 },
                { name: 'Sal integral (marinho ou rosa)', amount: '1 colher', order: 3 },
                { name: 'Soro de leite (Whey caseiro)', amount: '4 colheres de sopa', order: 4 },
            ],
            instructions: [
                'Misture o repolho e o sal em uma tigela e deixe desidratar por alguns minutos.',
                'Acrescente as sementes de cominho e o soro de leite.',
                'Amasse o repolho com um socador ou as mãos por 10 minutos até soltar bastante líquido.',
                'Coloque em um vidro com tampa e pressione bem para que o líquido cubra todo o repolho.',
                'Deixe pelo menos um dedo de espaço até a tampa. Feche e deixe fermentar em temperatura ambiente por no mínimo 7 dias.',
                'Após 7 dias, prove. Se gostar da acidez, leve à geladeira. Se não, deixe fermentar mais.'
            ]
        },
        {
            title: 'Cenouras Fermentadas com Gengibre',
            description: 'Conservas de cenoura crocantes e probióticas, perfeitas como acompanhamento.',
            content: 'A combinação de cenoura com gengibre cria um sabor refrescante e auxilia na digestão e imunidade.',
            metaTitle: 'Cenouras Fermentadas com Gengibre: Probióticas',
            metaDescription: 'Receita de cenouras fermentadas com gengibre, crocantes e ricas em probióticos. Acompanhamento ancestral que fortalece a imunidade.',
            coverImageAlt: 'Pote de cenouras fermentadas com gengibre em conserva natural',
            tags: ['cenoura fermentada', 'gengibre', 'fermentacao', 'probioticos', 'conserva natural', 'dieta ancestral', 'dieta da selva'],
            prepTime: 15,
            cookTime: 0,
            servings: 8,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Cenouras raladas', amount: '4 xícaras', order: 1 },
                { name: 'Gengibre fresco ralado', amount: '1 colher de sopa', order: 2 },
                { name: 'Sal marinho', amount: '1 colher de sopa', order: 3 },
                { name: 'Soro de leite caseiro', amount: '4 colheres de sopa', order: 4 },
            ],
            instructions: [
                'Misture todos os ingredientes em uma tigela e amasse bem para liberar os sucos.',
                'Coloque em um pote de vidro de boca larga.',
                'Pressione firmemente até que os sucos cubram as cenouras (deixe 2,5cm de espaço livre no topo).',
                'Tampe bem e deixe em temperatura ambiente por cerca de 3 dias antes de refrigerar.'
            ]
        },
        {
            title: 'Pepinos Fermentados',
            description: 'Picles de verdade, feitos através da fermentação natural (lactofermentação) em vez de vinagre.',
            content: 'Esses pepinos são ricos em enzimas e muito mais saudáveis que as conservas industriais pasteurizadas.',
            metaTitle: 'Pepinos Fermentados: Picles Probiótico Natural',
            metaDescription: 'Picles de verdade por lactofermentação, sem vinagre. Ricos em enzimas e probióticos para uma digestão saudável. Receita fácil e rápida.',
            coverImageAlt: 'Pote de vidro com pepinos fermentados naturalmente em salmoura',
            tags: ['pepinos fermentados', 'picles natural', 'lactofermentacao', 'probioticos', 'low carb', 'dieta da selva', 'conserva caseira'],
            prepTime: 10,
            cookTime: 0,
            servings: 6,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Pepinos japoneses ou para conserva', amount: '5 unidades', order: 1 },
                { name: 'Sementes de mostarda', amount: '1 colher de sopa', order: 2 },
                { name: 'Endro (Dill) ou funcho fresco', amount: '2 colheres de sopa', order: 3 },
                { name: 'Sal marinho', amount: '1 colher de sopa', order: 4 },
                { name: 'Soro de leite', amount: '4 colheres de sopa', order: 5 },
                { name: 'Água filtrada', amount: '1 copo (ou quanto baste)', order: 6 },
            ],
            instructions: [
                'Corte os pepinos em rodelas, palitos ou deixe inteiros se forem pequenos.',
                'Coloque no vidro com os temperos, sal e soro.',
                'Adicione água até cobrir os pepinos, deixando 2,5cm de espaço no topo.',
                'Tampe e deixe fermentar em temperatura ambiente por cerca de 3 dias antes de refrigerar.'
            ]
        },
        {
            title: 'Conserva de Beterrabas',
            description: 'Beterrabas fermentadas ricas em nutrientes e com sabor terroso e ácido.',
            content: 'Cuidado para não cortar muito fino, pois beterrabas fermentam rápido devido ao açúcar natural.',
            metaTitle: 'Conserva de Beterrabas Fermentadas Caseira',
            metaDescription: 'Beterrabas fermentadas ricas em nutrientes e probióticos. Sabor terroso e ácido, perfeitas para acompanhar carnes na dieta ancestral.',
            coverImageAlt: 'Pote de beterrabas fermentadas em fatias com especiarias',
            tags: ['beterraba fermentada', 'conserva natural', 'fermentacao', 'probioticos', 'dieta ancestral', 'dieta da selva', 'antioxidantes'],
            prepTime: 20,
            cookTime: 40, // Tempo de assar
            servings: 8,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Beterrabas orgânicas médias', amount: '12 unidades', order: 1 },
                { name: 'Sal marinho', amount: '1 colher de sopa', order: 2 },
                { name: 'Sementes de cardamomo', amount: 'A gosto', order: 3 },
                { name: 'Soro de leite', amount: '4 colheres de sopa', order: 4 },
                { name: 'Água filtrada', amount: '1 copo', order: 5 },
            ],
            instructions: [
                'Descasque e corte as beterrabas em fatias de 0,6cm. Asse a 150°C por 40 minutos (para suavizar).',
                'Coloque as beterrabas assadas em um pote de vidro.',
                'Adicione o sal, cardamomo, soro e cubra com água filtrada.',
                'Certifique-se que as beterrabas estão submersas (use um peso se necessário).',
                'Deixe fermentar por 3 dias em temperatura ambiente e transfira para a geladeira.'
            ]
        },
        {
            title: 'Mostarda Caseira Fermentada',
            description: 'Mostarda probiótica feita em casa, sem conservantes artificiais e cheia de sabor.',
            content: 'Uma mostarda viva que fica mais saborosa com o tempo na geladeira.',
            metaTitle: 'Mostarda Caseira Fermentada sem Conservantes',
            metaDescription: 'Receita de mostarda fermentada caseira, viva e probiótica. Sem conservantes artificiais, perfeita para dieta low carb e ancestral.',
            coverImageAlt: 'Pote de mostarda caseira fermentada cremosa e amarela',
            tags: ['mostarda fermentada', 'condimento caseiro', 'probioticos', 'fermentacao', 'low carb', 'dieta da selva', 'sem conservantes'],
            prepTime: 10,
            cookTime: 0,
            servings: 20,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Mostarda em pó', amount: '1 e 1/2 copo', order: 1 },
                { name: 'Água filtrada', amount: '1/2 copo', order: 2 },
                { name: 'Soro de leite', amount: '2 colheres de sopa', order: 3 },
                { name: 'Sal marinho', amount: '2 colheres de chá', order: 4 },
                { name: 'Suco de limão', amount: '1 unidade', order: 5 },
                { name: 'Mel (opcional)', amount: '1 colher de sopa', order: 6 },
            ],
            instructions: [
                'Misture bem todos os ingredientes até atingir a consistência desejada.',
                'Transfira para um pote de vidro, deixando espaço no topo.',
                'Deixe fermentar em temperatura ambiente por 3 dias.',
                'Prove. Se estiver no ponto, leve à geladeira. Se não, deixe mais um dia.'
            ]
        },
        {
            title: 'Ketchup Caseiro Fermentado',
            description: 'Uma versão saudável e probiótica do condimento favorito de todos.',
            content: 'Feito com pasta de tomate e mel, fermentado para reduzir o açúcar e criar complexidade.',
            metaTitle: 'Ketchup Caseiro Fermentado: Saudável e Natural',
            metaDescription: 'Ketchup fermentado caseiro com pasta de tomate e mel. Versão probiótica, sem conservantes, que reduz o açúcar pela fermentação natural.',
            coverImageAlt: 'Pote de ketchup caseiro fermentado vermelho intenso ao lado de tomates',
            tags: ['ketchup fermentado', 'condimento caseiro', 'probioticos', 'fermentacao', 'dieta da selva', 'sem conservantes', 'dieta ancestral'],
            prepTime: 5,
            cookTime: 0,
            servings: 15,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Pasta de tomate orgânica', amount: '3 xícaras', order: 1 },
                { name: 'Soro de leite', amount: '1/4 xícara', order: 2 },
                { name: 'Sal marinho', amount: '1 colher de sopa', order: 3 },
                { name: 'Mel ou melado', amount: '1/4 xícara', order: 4 },
                { name: 'Pimenta caiena', amount: '1/4 colher de chá', order: 5 },
                { name: 'Alho amassado', amount: '3 dentes', order: 6 },
            ],
            instructions: [
                'Bata todos os ingredientes no liquidificador.',
                'Coloque em um pote de vidro, deixando 2,5cm de espaço no topo.',
                'Deixe fermentar em temperatura ambiente por 2 dias.',
                'Verifique o sabor e leve à geladeira.'
            ]
        },
        {
            title: 'Chutney de Abacaxi',
            description: 'Condimento agridoce e fermentado, ótimo para acompanhar carnes.',
            content: 'A fermentação realça o sabor do abacaxi e o torna um excelente digestivo.',
            metaTitle: 'Chutney de Abacaxi Fermentado para Carnes',
            metaDescription: 'Chutney de abacaxi fermentado naturalmente, agridoce e digestivo. Acompanhamento ancestral perfeito para carnes grelhadas e assadas.',
            coverImageAlt: 'Pote de chutney de abacaxi fermentado com coentro fresco',
            tags: ['chutney', 'abacaxi fermentado', 'condimento', 'fermentacao', 'probioticos', 'dieta da selva', 'digestivo natural'],
            prepTime: 15,
            cookTime: 0,
            servings: 10,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Abacaxi pequeno picado', amount: '1 unidade', order: 1 },
                { name: 'Coentro picado', amount: '1 maço', order: 2 },
                { name: 'Gengibre ralado', amount: '1 colher de sopa', order: 3 },
                { name: 'Suco de limão', amount: '2 colheres de sopa', order: 4 },
                { name: 'Soro de leite', amount: '1/4 de xícara', order: 5 },
                { name: 'Água filtrada', amount: '1/2 xícara', order: 6 },
            ],
            instructions: [
                'Misture abacaxi, coentro e gengibre no pote e pressione levemente.',
                'Misture o limão, sal, soro e água e despeje sobre o abacaxi.',
                'Garanta que o líquido cubra as frutas.',
                'Fermente por 2 dias em temperatura ambiente antes de refrigerar. Consumir em 2 meses.'
            ]
        },
        {
            title: 'Massa de Mandioca Fermentada (Puba)',
            description: 'Massa base ancestral para bolos e pães, rica em enzimas e de fácil digestão.',
            content: 'Substitui a tapioca processada e enriquece a alimentação através da fermentação natural da raiz.',
            metaTitle: 'Puba: Massa de Mandioca Fermentada Ancestral',
            metaDescription: 'Receita de puba (massa de mandioca fermentada) rica em enzimas. Base ancestral brasileira para bolos e pães de fácil digestão.',
            coverImageAlt: 'Massa de mandioca fermentada (puba) branca em pote de vidro',
            tags: ['puba', 'mandioca fermentada', 'fermentacao', 'receita ancestral', 'dieta da selva', 'sem gluten', 'enzimas'],
            prepTime: 30,
            cookTime: 0,
            servings: 10,
            difficulty: RecipeDifficulty.HARD,
            ingredients: [
                { name: 'Mandioca fresca descascada', amount: '2 kg', order: 1 },
                { name: 'Água filtrada', amount: 'Q.B.', order: 2 },
            ],
            instructions: [
                'Rale a mandioca crua e limpa.',
                'Esprema a massa num voal ou pano para retirar o líquido (que contém o amido/tapioca).',
                'Coloque a massa espremida num vidro e compacte muito bem para tirar todo o ar.',
                'Cubra com um pano (não vedar totalmente) e deixe fermentar por 2 a 4 dias.',
                'Quando sentir um aroma ácido agradável, está pronta. Guarde na geladeira.'
            ]
        },
        {
            title: 'Alho Fermentado',
            description: 'Alho em conserva probiótica que potencializa os antioxidantes e suaviza o sabor.',
            content: 'Estudos mostram que o alho fermentado tem maior atividade antioxidante que o fresco.',
            metaTitle: 'Alho Fermentado: Mais Antioxidantes e Sabor',
            metaDescription: 'Alho fermentado em salmoura com poder antioxidante superior ao fresco. Conserva probiótica caseira que suaviza o sabor e fortalece a imunidade.',
            coverImageAlt: 'Pote de vidro com dentes de alho fermentados em salmoura',
            tags: ['alho fermentado', 'antioxidante', 'probioticos', 'fermentacao', 'conserva natural', 'dieta da selva', 'imunidade'],
            prepTime: 10,
            cookTime: 0,
            servings: 30,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Dentes de alho descascados', amount: 'Q.B. para encher o pote', order: 1 },
                { name: 'Água filtrada', amount: 'Q.B.', order: 2 },
                { name: 'Sal marinho', amount: '2 colheres de sopa por litro de água (Salmoura 2%)', order: 3 },
            ],
            instructions: [
                'Encha o pote com os dentes de alho.',
                'Complete com a salmoura (água + sal misturados).',
                'Feche levemente e deixe fermentar por semanas ou meses. Quanto mais tempo, mais suave.',
                'Agite ocasionalmente. Guarde na geladeira quando atingir o sabor desejado.'
            ]
        },
        {
            title: 'Beet Kvass Clássico',
            description: 'Bebida tônica de leste europeu, excelente para limpar o fígado e o sangue.',
            content: 'Rico em eletrólitos e bactérias benéficas, é uma bebida funcional poderosa.',
            metaTitle: 'Beet Kvass: Tônico Ancestral de Beterraba',
            metaDescription: 'Receita de beet kvass, tônico ancestral de beterraba fermentada. Rico em eletrólitos e probióticos, limpa o fígado e fortalece o sangue.',
            coverImageAlt: 'Copo de beet kvass vermelho escuro ao lado de cubos de beterraba',
            tags: ['beet kvass', 'beterraba fermentada', 'tonico', 'probioticos', 'fermentacao', 'dieta da selva', 'detox natural', 'eletrolitos'],
            prepTime: 10,
            cookTime: 0,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Beterrabas médias em cubos', amount: '2 unidades', order: 1 },
                { name: 'Sal marinho', amount: '1 colher de sopa', order: 2 },
                { name: 'Água filtrada', amount: 'Q.B.', order: 3 },
            ],
            instructions: [
                'Coloque as beterrabas no vidro (encha até 2/3).',
                'Adicione o sal e complete com água.',
                'Tampe e deixe fermentar por 3 a 7 dias longe da luz.',
                'Agite todo dia. Coe e beba o líquido. As beterrabas podem ser usadas em saladas.'
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
                    metaTitle: recipe.metaTitle,
                    metaDescription: recipe.metaDescription,
                    coverImageAlt: recipe.coverImageAlt,
                    tags: recipe.tags,
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
            // Atualiza APENAS os campos de SEO sem sobrescrever edições manuais
            await prisma.recipe.update({
                where: { slug },
                data: {
                    metaTitle: recipe.metaTitle,
                    metaDescription: recipe.metaDescription,
                    coverImageAlt: recipe.coverImageAlt,
                    tags: recipe.tags,
                },
            })
            console.log(`🔄 SEO atualizado: ${recipe.title}`)
        }
    }

    console.log('🏁 Seed do Capítulo 3 finalizado!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
