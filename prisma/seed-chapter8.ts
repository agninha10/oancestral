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
    console.log('🌱 Iniciando seed do Capítulo 8: Café da Manhã Ancestral...')

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

    // 2. Criar Categoria do Capítulo 8
    const categoryName = 'Café da Manhã Ancestral'
    const categorySlug = slugify(categoryName)

    const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: categoryName,
            slug: categorySlug,
            description: 'Receitas nutritivas e densas em energia para começar o dia, focadas em proteínas, gorduras boas e fermentados.',
            type: CategoryType.RECIPE,
        },
    })

    console.log(`📂 Categoria garantida: ${category.name}`)

    // 3. Dados das Receitas
    const recipesData = [
        {
            title: 'Leite de Coco Caseiro',
            description: 'Leite vegetal puro e rico em gorduras boas, feito apenas com coco e água.',
            content: 'Uma alternativa nutritiva aos leites industriais, perfeita para usar em receitas, cafés ou vitaminas.',
            prepTime: 10,
            cookTime: 0,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Coco seco descascado e picado', amount: '1 unidade', order: 1 },
                { name: 'Água morna (não fervendo)', amount: '3 xícaras', order: 2 },
            ],
            instructions: [
                'Coloque o coco e a água morna no liquidificador.',
                'Bata por 2-3 minutos até ficar bem homogêneo.',
                'Coe usando um voal ou pano limpo, torcendo bem para extrair todo o leite.',
                'Armazene em vidro na geladeira por até 3 dias. Dica: Para mais creme, use menos água.'
            ]
        },
        {
            title: 'Chai Ancestral',
            description: 'Bebida aromática e termogênica, rica em especiarias anti-inflamatórias.',
            content: 'Inspirado na medicina Ayurveda, este chai aquece o corpo e melhora a digestão.',
            prepTime: 5,
            cookTime: 15,
            servings: 2,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Água filtrada', amount: '2 xícaras', order: 1 },
                { name: 'Pau de canela', amount: '1 unidade', order: 2 },
                { name: 'Cardamomo (bagas esmagadas)', amount: '4 unidades', order: 3 },
                { name: 'Cravo-da-índia', amount: '4 unidades', order: 4 },
                { name: 'Gengibre fresco fatiado', amount: '2 cm', order: 5 },
                { name: 'Cúrcuma em pó ou fresca', amount: '1 colher de chá', order: 6 },
                { name: 'Pimenta-do-reino moída', amount: '1/2 colher de chá', order: 7 },
                { name: 'Chá preto (opcional)', amount: '2 colheres de chá', order: 8 },
                { name: 'Leite integral ou de coco', amount: '1 xícara', order: 9 },
                { name: 'Mel ou açúcar de coco', amount: 'A gosto', order: 10 },
            ],
            instructions: [
                'Aqueça a água com todas as especiarias e deixe ferver em fogo baixo por 10-15 min.',
                'Se usar chá preto, adicione nos últimos 2 minutos.',
                'Acrescente o leite e aqueça sem deixar ferver.',
                'Coe diretamente na xícara e adoce a gosto.'
            ]
        },
        {
            title: 'Golden Milk Ancestral',
            description: 'O Leite Dourado é um tônico anti-inflamatório poderoso à base de cúrcuma.',
            content: 'Excelente para a imunidade e articulações. A pimenta preta e a gordura são essenciais para absorver a curcumina.',
            prepTime: 5,
            cookTime: 5,
            servings: 1,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Leite integral ou de coco', amount: '1 xícara', order: 1 },
                { name: 'Cúrcuma em pó', amount: '1 colher de chá', order: 2 },
                { name: 'Gengibre ralado', amount: '1 colher de chá', order: 3 },
                { name: 'Canela em pó', amount: '1/2 colher de chá', order: 4 },
                { name: 'Pimenta-do-reino (essencial)', amount: '1 pitada', order: 5 },
                { name: 'Óleo de coco ou Ghee', amount: '1 colher de chá', order: 6 },
                { name: 'Mel', amount: 'A gosto', order: 7 },
            ],
            instructions: [
                'Aqueça o leite em fogo baixo (não ferver).',
                'Adicione cúrcuma, gengibre, canela e pimenta. Mexa bem.',
                'Acrescente a gordura (óleo/ghee) e misture por 5-7 min.',
                'Coe se necessário, adoce e sirva.'
            ]
        },
        {
            title: 'Leite de Amêndoas Germinadas',
            description: 'Leite vegetal digestivo feito com amêndoas ativadas pelo demolho.',
            content: 'O processo de germinação (demolho) remove antinutrientes e torna o leite mais leve.',
            prepTime: 10,
            cookTime: 0,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Amêndoas cruas (demolho de 8-12h)', amount: '1 xícara', order: 1 },
                { name: 'Água filtrada', amount: '3-4 xícaras', order: 2 },
                { name: 'Mel cru (opcional)', amount: '1 colher de sopa', order: 3 },
            ],
            instructions: [
                'Descarte a água do demolho e enxágue as amêndoas.',
                'Bata no liquidificador com a água nova por 1-2 minutos.',
                'Coe com voal/pano, espremendo bem.',
                'Adoce se quiser. A polpa que sobra pode virar farinha ou patê.'
            ]
        },
        {
            title: 'Smoothie de Banana e Abacate',
            description: 'Um café da manhã líquido completo, com gorduras boas e proteína.',
            content: 'Cremoso e sustentável, perfeito para dias corridos.',
            prepTime: 5,
            cookTime: 0,
            servings: 1,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Banana madura', amount: '1 unidade', order: 1 },
                { name: 'Abacate maduro', amount: '1/4 unidade', order: 2 },
                { name: 'Ovo caipira cru (de alta qualidade)', amount: '1 unidade', order: 3 },
                { name: 'Leite cru/vegetal ou água de coco', amount: '1 xícara', order: 4 },
                { name: 'Mel e canela', amount: 'A gosto', order: 5 },
            ],
            instructions: [
                'Lave bem a casca do ovo antes de quebrar.',
                'Bata tudo no liquidificador até ficar cremoso.',
                'Sirva imediatamente.'
            ]
        },
        {
            title: 'Ovos Mexidos com Manteiga e Ervas',
            description: 'A forma clássica e nutritiva de preparar ovos, enriquecida com manteiga.',
            content: 'Simples, mas a técnica e os ingredientes de qualidade fazem toda a diferença.',
            prepTime: 5,
            cookTime: 5,
            servings: 1,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Ovos caipiras', amount: '2 a 3 unidades', order: 1 },
                { name: 'Manteiga', amount: '1 colher de sopa', order: 2 },
                { name: 'Sal grosso', amount: 'A gosto', order: 3 },
                { name: 'Ervas frescas (salsinha, cebolinha, etc)', amount: 'A gosto', order: 4 },
            ],
            instructions: [
                'Bata os ovos com um garfo.',
                'Aqueça a manteiga em fogo baixo (frigideira de ferro é ideal).',
                'Despeje os ovos e mexa delicadamente até o ponto desejado.',
                'Finalize com sal e ervas.'
            ]
        },
        {
            title: 'Omelete de Vegetais Sazonais',
            description: 'Refeição colorida para aproveitar os vegetais da estação.',
            content: 'Versátil e nutritiva, permite variar os vegetais conforme a disponibilidade.',
            prepTime: 10,
            cookTime: 10,
            servings: 1,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Ovos caipiras', amount: '3 unidades', order: 1 },
                { name: 'Abobrinha em cubos', amount: '1/2 unidade', order: 2 },
                { name: 'Cebola roxa fatiada', amount: '1/4 unidade', order: 3 },
                { name: 'Espinafre fresco', amount: '1 punhado', order: 4 },
                { name: 'Manteiga ou azeite', amount: '1 colher de sopa', order: 5 },
            ],
            instructions: [
                'Refogue a abobrinha e cebola na manteiga até amaciar.',
                'Adicione o espinafre e refogue por 1 min.',
                'Bata os ovos com sal/pimenta e despeje sobre os vegetais.',
                'Cozinhe em fogo baixo até firmar, vire para dourar.'
            ]
        },
        {
            title: 'Frittata de Carne Moída e Vegetais Fermentados',
            description: 'Um café da manhã robusto, rico em proteínas e probióticos.',
            content: 'Excelente opção para sustentar a saciedade até o almoço.',
            prepTime: 10,
            cookTime: 15,
            servings: 2,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Carne moída', amount: '200g', order: 1 },
                { name: 'Ovos caipiras', amount: '3 unidades', order: 2 },
                { name: 'Manteiga', amount: '1 colher de sopa', order: 3 },
                { name: 'Vegetais fermentados (chucrute/kimchi)', amount: '1/4 xícara', order: 4 },
            ],
            instructions: [
                'Refogue a carne na manteiga até dourar.',
                'Bata os ovos com sal e pimenta.',
                'Espalhe os fermentados sobre a carne e cubra com os ovos.',
                'Cozinhe em fogo baixo até firmar ou leve ao forno a 180°C por 10 min.'
            ]
        },
        {
            title: 'Ovos Mexidos com Coração de Galinha',
            description: 'Uma verdadeira refeição ancestral, rica em coenzima Q10 e ferro.',
            content: 'Vísceras como coração são superalimentos esquecidos que devem ser resgatados.',
            prepTime: 10,
            cookTime: 15,
            servings: 2,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Ovos caipiras', amount: '2 unidades', order: 1 },
                { name: 'Corações de galinha limpos', amount: '150g', order: 2 },
                { name: 'Alho picado', amount: '1 dente', order: 3 },
                { name: 'Cebola picada', amount: '1 colher de sopa', order: 4 },
                { name: 'Manteiga ou banha', amount: '1 colher de sopa', order: 5 },
                { name: 'Ervas frescas', amount: 'A gosto', order: 6 },
            ],
            instructions: [
                'Refogue cebola e alho na gordura.',
                'Adicione os corações temperados e cozinhe por 5-7 min.',
                'Bata os ovos e despeje sobre os corações.',
                'Mexa em fogo baixo até os ovos cozinharem mas ficarem cremosos.',
                'Finalize com ervas.'
            ]
        },
        {
            title: 'Pão de Queijo de Polvilho Azedo',
            description: 'Versão caseira e rica em gorduras boas do clássico brasileiro.',
            content: 'Feito com manteiga e gemas extras para maior densidade nutricional.',
            prepTime: 15,
            cookTime: 25,
            servings: 15,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Polvilho azedo', amount: '1 xícara', order: 1 },
                { name: 'Manteiga derretida', amount: '1/4 xícara', order: 2 },
                { name: 'Gemas caipiras', amount: '2 unidades', order: 3 },
                { name: 'Queijo ralado (meia cura/parmesão)', amount: '1/2 xícara', order: 4 },
                { name: 'Leite integral/cru', amount: '1/4 xícara', order: 5 },
            ],
            instructions: [
                'Misture tudo numa tigela até ficar homogêneo.',
                'Faça bolinhas.',
                'Asse em forno pré-aquecido a 180°C por 20-25 min até dourar.'
            ]
        },
        {
            title: 'Panquecas de Banana e Amêndoas',
            description: 'Sem glúten e naturalmente doces, ideais para um café rápido.',
            content: 'Apenas banana, ovos e farinha de amêndoas criam uma massa perfeita.',
            prepTime: 5,
            cookTime: 10,
            servings: 1,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Bananas maduras', amount: '2 unidades', order: 1 },
                { name: 'Ovos', amount: '2 unidades', order: 2 },
                { name: 'Farinha de amêndoas', amount: '1/4 xícara', order: 3 },
                { name: 'Canela', amount: '1 colher de chá', order: 4 },
            ],
            instructions: [
                'Amasse as bananas e misture com ovos, farinha e canela.',
                'Despeje porções em frigideira untada com óleo de coco.',
                'Doure dos dois lados em fogo baixo.'
            ]
        },
        {
            title: 'Mingau de Aveia Tradicional',
            description: 'O conforto do mingau feito com leite cru e mel.',
            content: 'Simples, quente e nutritivo.',
            prepTime: 2,
            cookTime: 7,
            servings: 1,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Aveia em flocos', amount: '1/2 xícara', order: 1 },
                { name: 'Leite cru ou integral', amount: '1 xícara', order: 2 },
                { name: 'Mel cru', amount: '1 colher de chá', order: 3 },
                { name: 'Sal', amount: '1 pitada', order: 4 },
            ],
            instructions: [
                'Aqueça leite, aveia e sal na panela.',
                'Cozinhe mexendo sempre por 5-7 min até engrossar.',
                'Sirva com mel.'
            ]
        },
        {
            title: 'Flatbread de Grãos Germinados',
            description: 'Pão de frigideira feito com grãos inteiros germinados e triturados.',
            content: 'Uma forma ancestral de comer grãos, sem farinha refinada.',
            prepTime: 10,
            cookTime: 10,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Grãos germinados (trigo/espelta/cevada)', amount: '2 xícaras', order: 1 },
                { name: 'Água filtrada', amount: '1/2 xícara', order: 2 },
                { name: 'Sal marinho', amount: '1 colher de chá', order: 3 },
            ],
            instructions: [
                'Processe os grãos germinados com água até virar uma massa.',
                'Adicione sal.',
                'Coloque porções na frigideira untada e espalhe.',
                'Cozinhe 2-3 min de cada lado até dourar.'
            ]
        },
        {
            title: 'Mingau de Tapioca com Coco',
            description: 'Opção sem glúten, cremosa e energética.',
            content: 'O leite de coco fornece gorduras que saciam e dão energia estável.',
            prepTime: 10,
            cookTime: 5,
            servings: 1,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Tapioca granulada', amount: '1/4 xícara', order: 1 },
                { name: 'Leite de coco caseiro', amount: '1 xícara', order: 2 },
                { name: 'Melado de cana', amount: '1 colher de sopa', order: 3 },
            ],
            instructions: [
                'Hidrate a tapioca no leite por 10 min.',
                'Leve ao fogo baixo mexendo até engrossar.',
                'Sirva com melado e canela.'
            ]
        },
        {
            title: 'Pão de Trigo Sarraceno Germinado',
            description: 'Pão fermentado naturalmente, sem glúten e de fácil digestão.',
            content: 'Sabor terroso e rico em fibras.',
            prepTime: 15,
            cookTime: 50,
            servings: 10,
            difficulty: RecipeDifficulty.HARD,
            ingredients: [
                { name: 'Trigo sarraceno germinado', amount: '2 xícaras', order: 1 },
                { name: 'Água', amount: '1/2 xícara', order: 2 },
                { name: 'Azeite', amount: '1 colher de sopa', order: 3 },
            ],
            instructions: [
                'Bata tudo no liquidificador.',
                'Coloque na forma e deixe fermentar por 8 horas (crescimento natural).',
                'Asse a 180°C por 40-50 min.'
            ]
        },
        {
            title: 'Bolo de Mandioca e Coco',
            description: 'Bolo úmido, sem farinha de trigo, à base de raiz.',
            content: 'Perfeito para acompanhar o café.',
            prepTime: 15,
            cookTime: 40,
            servings: 8,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Mandioca ralada', amount: '2 xícaras', order: 1 },
                { name: 'Leite de coco caseiro', amount: '1 xícara', order: 2 },
                { name: 'Açúcar mascavo/melado', amount: '1/2 xícara', order: 3 },
                { name: 'Ovos', amount: '2 unidades', order: 4 },
                { name: 'Óleo de coco', amount: '1/4 xícara', order: 5 },
            ],
            instructions: [
                'Misture tudo até ficar homogêneo.',
                'Asse em forma untada a 180°C por 40 min.'
            ]
        },
        {
            title: 'Queijo de Castanha Fermentado',
            description: 'Alternativa vegetal probiótica ao queijo convencional.',
            content: 'A fermentação traz acidez e complexidade de sabor.',
            prepTime: 20,
            cookTime: 0,
            servings: 6,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Castanha de caju crua (demolhada 8h)', amount: '2 xícaras', order: 1 },
                { name: 'Soro de leite (para fermentar)', amount: '2 colheres de sopa', order: 2 },
                { name: 'Limão', amount: '1 colher de sopa', order: 3 },
                { name: 'Água', amount: '1/4 xícara', order: 4 },
            ],
            instructions: [
                'Bata as castanhas com os líquidos e sal.',
                'Coloque num voal e pendure para drenar o excesso de líquido.',
                'Deixe fermentar em temperatura ambiente por 24-48h.',
                'Refrigere.'
            ]
        },
        {
            title: 'Hummus de Grão de Bico',
            description: 'Pasta nutritiva do Oriente Médio, rica em fibras.',
            content: 'O segredo é cozinhar bem o grão até desmanchar para ficar liso.',
            prepTime: 20,
            cookTime: 60,
            servings: 6,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Grão-de-bico cozido (bem macio)', amount: '2 xícaras', order: 1 },
                { name: 'Tahine', amount: '3/4 xícara', order: 2 },
                { name: 'Limão', amount: '3 colheres de sopa', order: 3 },
                { name: 'Alho', amount: '2 dentes', order: 4 },
                { name: 'Gelo (segredo da cremosidade)', amount: '3 cubos', order: 5 },
            ],
            instructions: [
                'Processe o grão-de-bico com alho, tahine, limão e temperos.',
                'Com o processador ligado, adicione o gelo e água do cozimento aos poucos.',
                'Bata até ficar muito sedoso. Sirva com azeite e páprica.'
            ]
        },
        {
            title: 'Shakshuka Ancestral',
            description: 'Ovos pochê em molho de tomate temperado.',
            content: 'Prato de uma panela só, cheio de sabor e conforto.',
            prepTime: 10,
            cookTime: 20,
            servings: 2,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Ovos caipiras', amount: '4-6 unidades', order: 1 },
                { name: 'Tomates maduros picados', amount: '4 unidades', order: 2 },
                { name: 'Cebola e alho', amount: '1 un / 3 dentes', order: 3 },
                { name: 'Páprica e Cominho', amount: '1 colher de chá cada', order: 4 },
            ],
            instructions: [
                'Refogue cebola e alho.',
                'Adicione tomate e temperos, cozinhe até formar molho espesso (15 min).',
                'Faça buracos no molho e quebre os ovos dentro.',
                'Tampe e cozinhe por 5 min (claras firmes, gemas moles).',
                'Sirva com coentro.'
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

    console.log('🏁 Seed do Capítulo 8 finalizado!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })