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
                emailVerified: new Date()
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
            metaTitle: 'Leite de Coco Caseiro Puro e Cremoso',
            metaDescription: 'Receita de leite de coco caseiro feito com coco fresco. Rico em gorduras boas, sem aditivos, perfeito para receitas e café ancestral.',
            coverImageAlt: 'Copo de leite de coco caseiro cremoso ao lado de coco fresco',
            tags: ['leite de coco', 'leite vegetal', 'gorduras boas', 'sem lactose', 'low carb', 'dieta da selva', 'dieta ancestral'],
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
            metaTitle: 'Chai Ancestral com Especiarias Anti-inflamatórias',
            metaDescription: 'Chai caseiro com cúrcuma, gengibre, canela e cardamomo. Bebida termogênica anti-inflamatória inspirada na medicina Ayurveda.',
            coverImageAlt: 'Xícara de chai ancestral fumegante com especiarias ao redor',
            tags: ['chai', 'especiarias', 'anti-inflamatorio', 'termogenico', 'curcuma', 'gengibre', 'dieta ancestral', 'dieta da selva'],
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
            metaTitle: 'Golden Milk: Leite Dourado Anti-inflamatório',
            metaDescription: 'Leite dourado (golden milk) com cúrcuma, gengibre e pimenta preta. Tônico anti-inflamatório ancestral para imunidade e articulações.',
            coverImageAlt: 'Xícara de golden milk dourado cremoso com cúrcuma e canela',
            tags: ['golden milk', 'leite dourado', 'curcuma', 'anti-inflamatorio', 'imunidade', 'low carb', 'dieta da selva', 'dieta ancestral'],
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
            metaTitle: 'Leite de Amêndoas Germinadas sem Antinutrientes',
            metaDescription: 'Leite de amêndoas germinadas caseiro, livre de antinutrientes. Mais digestivo e nutritivo que os leites vegetais industriais.',
            coverImageAlt: 'Copo de leite de amêndoas caseiro com amêndoas germinadas ao lado',
            tags: ['leite de amendoas', 'germinacao', 'leite vegetal', 'sem antinutrientes', 'sem lactose', 'low carb', 'dieta da selva'],
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
            metaTitle: 'Smoothie de Banana e Abacate com Proteína',
            metaDescription: 'Smoothie cremoso de banana e abacate com ovo caipira. Café da manhã líquido completo com gorduras boas e proteína natural.',
            coverImageAlt: 'Copo de smoothie cremoso de banana e abacate com canela',
            tags: ['smoothie', 'banana', 'abacate', 'cafe da manha', 'gorduras boas', 'proteina', 'dieta da selva', 'low carb'],
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
            metaTitle: 'Ovos Mexidos na Manteiga: Receita Perfeita',
            metaDescription: 'Ovos mexidos cremosos na manteiga com ervas frescas. Técnica simples para o café da manhã perfeito na dieta ancestral e carnívora.',
            coverImageAlt: 'Prato de ovos mexidos cremosos com manteiga e ervas frescas',
            tags: ['ovos mexidos', 'manteiga', 'cafe da manha', 'carnivora', 'low carb', 'dieta ancestral', 'dieta da selva', 'proteina'],
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
            metaTitle: 'Omelete de Vegetais Sazonais Ancestral',
            metaDescription: 'Omelete nutritiva com vegetais da estação, preparada com manteiga ou azeite. Café da manhã versátil, low carb e rico em vitaminas.',
            coverImageAlt: 'Omelete dourada recheada com abobrinha, espinafre e cebola roxa',
            tags: ['omelete', 'vegetais sazonais', 'cafe da manha', 'low carb', 'proteina', 'dieta ancestral', 'dieta da selva'],
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
            metaTitle: 'Frittata de Carne com Fermentados Probióticos',
            metaDescription: 'Frittata de carne moída com chucrute ou kimchi. Café da manhã rico em proteína e probióticos que sustenta até o almoço.',
            coverImageAlt: 'Frittata dourada de carne moída com chucrute e ovos caipiras',
            tags: ['frittata', 'carne moida', 'fermentados', 'probioticos', 'cafe da manha', 'carnivora', 'low carb', 'dieta da selva'],
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
            metaTitle: 'Ovos com Coração de Galinha: Coenzima Q10',
            metaDescription: 'Ovos mexidos com coração de galinha, ricos em coenzima Q10 e ferro. Receita ancestral que resgata vísceras como superalimentos.',
            coverImageAlt: 'Prato de ovos mexidos cremosos com corações de galinha e ervas',
            tags: ['coracao de galinha', 'visceras', 'coenzima q10', 'ferro', 'cafe da manha', 'carnivora', 'dieta ancestral', 'dieta da selva'],
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
            metaTitle: 'Pão de Queijo Caseiro com Polvilho Azedo',
            metaDescription: 'Pão de queijo caseiro com polvilho azedo, manteiga e gemas extras. Sem glúten, rico em gorduras boas e densidade nutricional.',
            coverImageAlt: 'Pães de queijo caseiros dourados e crocantes em assadeira',
            tags: ['pao de queijo', 'polvilho azedo', 'sem gluten', 'cafe da manha', 'gorduras boas', 'dieta ancestral', 'dieta da selva'],
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
            metaTitle: 'Panquecas de Banana e Amêndoas sem Glúten',
            metaDescription: 'Panquecas sem glúten com banana, ovos e farinha de amêndoas. Naturalmente doces, fáceis e perfeitas para café da manhã low carb.',
            coverImageAlt: 'Pilha de panquecas douradas de banana com amêndoas e mel',
            tags: ['panquecas', 'banana', 'amendoas', 'sem gluten', 'cafe da manha', 'low carb', 'dieta da selva'],
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
            metaTitle: 'Mingau de Aveia com Leite Cru e Mel',
            metaDescription: 'Mingau de aveia caseiro com leite cru e mel. Café da manhã quente, reconfortante e nutritivo na tradição ancestral.',
            coverImageAlt: 'Tigela de mingau de aveia cremoso com mel e canela',
            tags: ['mingau de aveia', 'leite cru', 'mel', 'cafe da manha', 'conforto', 'dieta ancestral', 'dieta da selva'],
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
            metaTitle: 'Flatbread de Grãos Germinados sem Farinha',
            metaDescription: 'Flatbread ancestral feito com grãos germinados triturados, sem farinha refinada. Pão de frigideira nutritivo e de fácil digestão.',
            coverImageAlt: 'Flatbread dourado de grãos germinados em frigideira de ferro',
            tags: ['flatbread', 'graos germinados', 'sem farinha', 'pao ancestral', 'germinacao', 'cafe da manha', 'dieta da selva'],
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
            metaTitle: 'Mingau de Tapioca com Leite de Coco',
            metaDescription: 'Mingau cremoso de tapioca com leite de coco caseiro. Sem glúten, energético e saciente com gorduras boas do coco.',
            coverImageAlt: 'Tigela de mingau de tapioca cremoso com leite de coco e melado',
            tags: ['mingau de tapioca', 'leite de coco', 'sem gluten', 'cafe da manha', 'energia', 'gorduras boas', 'dieta da selva'],
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
            metaTitle: 'Pão de Trigo Sarraceno Germinado sem Glúten',
            metaDescription: 'Pão de trigo sarraceno germinado, fermentado naturalmente e sem glúten. Sabor terroso, rico em fibras e de fácil digestão.',
            coverImageAlt: 'Pão rústico de trigo sarraceno germinado fatiado',
            tags: ['trigo sarraceno', 'pao germinado', 'sem gluten', 'fermentacao natural', 'fibras', 'dieta ancestral', 'dieta da selva'],
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
            metaTitle: 'Bolo de Mandioca e Coco sem Farinha de Trigo',
            metaDescription: 'Bolo úmido de mandioca com coco caseiro, sem farinha de trigo. Receita ancestral brasileira perfeita para o café da manhã.',
            coverImageAlt: 'Fatia de bolo de mandioca úmido com coco dourado',
            tags: ['bolo de mandioca', 'coco', 'sem trigo', 'sem gluten', 'cafe da manha', 'receita brasileira', 'dieta da selva'],
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
            metaTitle: 'Queijo de Castanha Fermentado Probiótico',
            metaDescription: 'Queijo vegetal de castanha de caju fermentado com soro de leite. Alternativa probiótica cremosa com acidez e complexidade de sabor.',
            coverImageAlt: 'Queijo de castanha de caju fermentado cremoso em prato rústico',
            tags: ['queijo de castanha', 'fermentacao', 'probioticos', 'vegetal', 'sem lactose', 'dieta ancestral', 'dieta da selva'],
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
            metaTitle: 'Hummus Caseiro: Receita Cremosa e Nutritiva',
            metaDescription: 'Hummus caseiro cremoso de grão de bico com tahine. O segredo do gelo para textura sedosa. Rico em fibras e proteína vegetal.',
            coverImageAlt: 'Tigela de hummus cremoso com azeite, páprica e grão de bico',
            tags: ['hummus', 'grao de bico', 'tahine', 'fibras', 'proteina vegetal', 'dieta ancestral', 'dieta da selva'],
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
            metaTitle: 'Shakshuka Ancestral: Ovos no Molho de Tomate',
            metaDescription: 'Shakshuka ancestral com ovos pochê em molho de tomate temperado. Prato rápido de uma panela, rico em proteína e licopeno.',
            coverImageAlt: 'Frigideira com shakshuka de ovos pochê em molho de tomate com coentro',
            tags: ['shakshuka', 'ovos', 'molho de tomate', 'cafe da manha', 'proteina', 'low carb', 'dieta ancestral', 'dieta da selva'],
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