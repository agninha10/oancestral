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
    console.log('🌱 Iniciando seed do Capítulo 10: Carnes - A Essência Nutritiva...')

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

    // 2. Criar Categoria do Capítulo 10
    const categoryName = 'Carnes e Pratos Principais Ancestrais'
    const categorySlug = slugify(categoryName)

    const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: categoryName,
            slug: categorySlug,
            description: 'Pratos principais focados em carnes densas em nutrientes, cortes com osso e órgãos.',
            type: CategoryType.RECIPE,
        },
    })

    console.log(`📂 Categoria garantida: ${category.name}`)

    // 3. Dados das Receitas
    const recipesData = [
        {
            title: 'Costela Bovina Assada com Ervas e Alho',
            description: 'Carne macia que solta do osso, assada lentamente para preservar o colágeno.',
            content: 'A costela é um corte ancestral por excelência, rica em gorduras saudáveis e gelatina.',
            prepTime: 15,
            cookTime: 240, // 4 horas
            servings: 6,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Costela bovina', amount: '1,5 kg', order: 1 },
                { name: 'Alho amassado', amount: '4 dentes', order: 2 },
                { name: 'Azeite, manteiga ou banha', amount: '2 colheres de sopa', order: 3 },
                { name: 'Alecrim e tomilho frescos', amount: '1 colher de sopa cada', order: 4 },
                { name: 'Caldo de ossos', amount: '1/2 xícara', order: 5 },
                { name: 'Sal e pimenta', amount: 'A gosto', order: 6 },
            ],
            instructions: [
                'Tempere a costela e deixe marinar por 2h (opcional).',
                'Pré-aqueça o forno a 160°C.',
                'Coloque na assadeira, regue com gordura e caldo.',
                'Cubra com papel alumínio (sem tocar na carne) e asse por 3 a 4 horas.',
                'Remova o papel nos últimos 30 min para dourar.'
            ]
        },
        {
            title: 'Carne de Panela com Ossos e Legumes',
            description: 'O clássico reconfortante, enriquecido com o tutano dos ossos.',
            content: 'Cozimento lento que extrai nutrientes dos ossos e deixa os vegetais saborosos.',
            prepTime: 20,
            cookTime: 120, // 2 horas
            servings: 6,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Carne com osso (acém/músculo/costela)', amount: '1 kg', order: 1 },
                { name: 'Banha, manteiga ou azeite', amount: '2 colheres de sopa', order: 2 },
                { name: 'Cebola e alho picados', amount: '1 un / 3 dentes', order: 3 },
                { name: 'Cenouras e batatas/mandioca', amount: '2 unidades de cada', order: 4 },
                { name: 'Caldo de ossos ou água', amount: '2 xícaras', order: 5 },
                { name: 'Louro', amount: '1 folha', order: 6 },
            ],
            instructions: [
                'Sele a carne na gordura até dourar. Reserve.',
                'Refogue cebola e alho na mesma panela.',
                'Volte a carne, adicione legumes, caldo e louro.',
                'Cozinhe em fogo baixo tampado por 2 horas até amaciar.'
            ]
        },
        {
            title: 'Ensopado de Rabo de Boi com Batatas e Cenouras',
            description: 'Uma das carnes mais ricas em colágeno, perfeita para a saúde das articulações.',
            content: 'A rabada é um corte barato e extremamente nutritivo quando preparado corretamente.',
            prepTime: 20,
            cookTime: 60, // 1h na pressão
            servings: 5,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Rabo de boi em pedaços', amount: '1 kg', order: 1 },
                { name: 'Azeite ou banha', amount: '2 colheres de sopa', order: 2 },
                { name: 'Cebola e alho', amount: '1 un / 2 dentes', order: 3 },
                { name: 'Vinho tinto seco', amount: '1 xícara', order: 4 },
                { name: 'Caldo de ossos', amount: '2 xícaras', order: 5 },
                { name: 'Batatas e cenouras', amount: '3 un / 2 un', order: 6 },
            ],
            instructions: [
                'Sele os pedaços de rabo na pressão com azeite.',
                'Refogue cebola e alho. Deglaceie com vinho.',
                'Adicione caldo, louro e vegetais.',
                'Cozinhe na pressão por 45min a 1h.'
            ]
        },
        {
            title: 'Almôndegas de Carne Moída com Fígado',
            description: 'A maneira perfeita de incluir vísceras na dieta de forma "disfarçada".',
            content: 'O fígado é o alimento mais denso em nutrientes do planeta. Aqui ele fica suave misturado à carne.',
            prepTime: 20,
            cookTime: 15,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Carne moída', amount: '300 g', order: 1 },
                { name: 'Fígado bovino limpo', amount: '200 g', order: 2 },
                { name: 'Cebola ralada e alho picado', amount: '1 un / 2 dentes', order: 3 },
                { name: 'Ovo caipira', amount: '1 unidade', order: 4 },
                { name: 'Páprica e salsa', amount: 'A gosto', order: 5 },
            ],
            instructions: [
                'Processe o fígado até virar uma pasta.',
                'Misture com a carne moída e temperos.',
                'Modele bolinhas.',
                'Frite em banha ou manteiga até dourar e cozinhar por dentro.'
            ]
        },
        {
            title: 'Carne Cozida Lentamente com Vinho Tinto e Ervas',
            description: 'Estilo "Boeuf Bourguignon", rico e aromático.',
            content: 'O vinho ajuda a amaciar as fibras da carne e adiciona antioxidantes (resveratrol).',
            prepTime: 20,
            cookTime: 240, // 4 horas
            servings: 6,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Carne bovina (músculo/acém) em cubos grandes', amount: '1,5 kg', order: 1 },
                { name: 'Vinho tinto seco', amount: '1 xícara', order: 2 },
                { name: 'Caldo de ossos', amount: '2 xícaras', order: 3 },
                { name: 'Vegetais (cenoura, salsão, cebola)', amount: 'A gosto', order: 4 },
                { name: 'Ervas (tomilho, alecrim, louro)', amount: 'A gosto', order: 5 },
            ],
            instructions: [
                'Sele a carne e reserve. Refogue os vegetais.',
                'Volte a carne e adicione o vinho (deixe evaporar o álcool).',
                'Cubra com caldo e ervas.',
                'Cozinhe em fogo baixo (panela comum ou ferro) por 3 a 4 horas até desmanchar.'
            ]
        },
        {
            title: 'Músculo com Molho de Tomate e Vinho',
            description: 'Corte rico em colágeno, cozido até ficar gelatinoso e macio.',
            content: 'O músculo é uma das melhores carnes para a saúde da pele e articulações.',
            prepTime: 15,
            cookTime: 180, // 3 horas
            servings: 5,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Músculo em pedaços', amount: '1 kg', order: 1 },
                { name: 'Tomates maduros', amount: '4 unidades', order: 2 },
                { name: 'Vinho tinto', amount: '1 xícara', order: 3 },
                { name: 'Caldo de ossos', amount: '2 xícaras', order: 4 },
            ],
            instructions: [
                'Sele a carne. Refogue cebola, alho e tomates.',
                'Deglaceie com vinho.',
                'Adicione carne e caldo.',
                'Cozinhe por 2 a 3 horas em fogo baixo.'
            ]
        },
        {
            title: 'Ragu de Carne com Purê de Batata-Doce',
            description: 'Carne desfiada servida sobre um purê nutritivo de raiz.',
            content: 'Comfort food ancestral, ideal para recuperação pós-treino ou dias frios.',
            prepTime: 20,
            cookTime: 60,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Carne bovina desfiada (já cozida ou crua para cozinhar)', amount: '1 kg', order: 1 },
                { name: 'Caldo de ossos', amount: '2 xícaras', order: 2 },
                { name: 'Tomates', amount: '4 unidades', order: 3 },
                { name: 'Batata-doce cozida (para o purê)', amount: '4 unidades', order: 4 },
                { name: 'Manteiga', amount: '4 colheres (total)', order: 5 },
            ],
            instructions: [
                'Refogue a carne com tomates e caldo por 1h até reduzir e formar molho grosso.',
                'Amasse as batatas com manteiga e sal.',
                'Sirva o ragu sobre o purê.'
            ]
        },
        {
            title: 'Hambúrguer Ancestral com Cebolas Caramelizadas',
            description: 'Sem pão, focado na qualidade da carne e gordura boa.',
            content: 'Simples e direto: carne, sal e cebolas doces caramelizadas na manteiga.',
            prepTime: 10,
            cookTime: 15,
            servings: 4,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Carne moída (acém/patinho)', amount: '500 g', order: 1 },
                { name: 'Ghee ou manteiga', amount: '2 colheres de sopa', order: 2 },
                { name: 'Cebola grande em rodelas', amount: '1 unidade', order: 3 },
            ],
            instructions: [
                'Modele os hambúrgueres apenas com carne, sal e pimenta.',
                'Grelhe no Ghee (3-4 min cada lado). Reserve.',
                'Na mesma frigideira, caramelize as cebolas no Ghee restante.',
                'Sirva a carne coberta pelas cebolas.'
            ]
        },
        {
            title: 'Bife de Fígado Acebolado com Salsa Fresca',
            description: 'O "multivitamínico" da natureza. Rico em ferro, B12 e Vitamina A.',
            content: 'O segredo é não cozinhar demais para não ficar duro e amargo. O limão ajuda a suavizar.',
            prepTime: 10,
            cookTime: 10,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Fígado bovino em fatias finas', amount: '500 g', order: 1 },
                { name: 'Manteiga ou banha', amount: '2 colheres de sopa', order: 2 },
                { name: 'Cebola em rodelas', amount: '1 grande', order: 3 },
                { name: 'Suco de limão', amount: '1 unidade', order: 4 },
                { name: 'Salsa fresca', amount: 'A gosto', order: 5 },
            ],
            instructions: [
                'Tempere o fígado com limão, sal e pimenta.',
                'Refogue as cebolas na gordura até dourarem. Reserve.',
                'Sele o fígado rapidamente (1-2 min cada lado). Não passe do ponto.',
                'Misture as cebolas e finalize com salsa.'
            ]
        },
        {
            title: 'Almôndegas de Carne e Fígado ao Molho Rústico',
            description: 'Variação das almôndegas cozidas diretamente no molho de tomate caseiro.',
            content: 'Mantém a umidade e enriquece o molho com os nutrientes da carne.',
            prepTime: 20,
            cookTime: 30,
            servings: 4,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Carne moída', amount: '300 g', order: 1 },
                { name: 'Fígado moído/processado', amount: '200 g', order: 2 },
                { name: 'Tomates picados', amount: '4 unidades', order: 3 },
                { name: 'Caldo de ossos', amount: '1 xícara', order: 4 },
                { name: 'Banha ou manteiga', amount: '2 colheres', order: 5 },
            ],
            instructions: [
                'Modele as almôndegas (carne + fígado + ovo + temperos).',
                'Sele na gordura. Reserve.',
                'Faça o molho na mesma panela com alho, tomate e caldo.',
                'Cozinhe as almôndegas dentro do molho por 15 min.'
            ]
        },
        {
            title: 'Ensopado de Carne do Dia Todo',
            description: 'Receita "Set and Forget" para panela de cozimento lento (Slow Cooker).',
            content: 'Ideal para rotinas corridas. Você chega em casa e o jantar está pronto e nutritivo.',
            prepTime: 15,
            cookTime: 720, // 12 horas
            servings: 8,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Carne para ensopado', amount: '1,3 kg', order: 1 },
                { name: 'Vinho tinto', amount: '1 xícara', order: 2 },
                { name: 'Caldo de carne/ossos', amount: '4 xícaras', order: 3 },
                { name: 'Tomates pelados', amount: '1 lata', order: 4 },
                { name: 'Especiarias (cravo, casca de laranja)', amount: 'A gosto', order: 5 },
                { name: 'Cenouras', amount: '450 g', order: 6 },
            ],
            instructions: [
                'Coloque tudo na Slow Cooker ou forno baixo (exceto vegetais moles).',
                'Cozinhe por 12 horas.',
                'Adicione cenouras/batatas nas últimas 2 horas para não desmancharem demais.'
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

    console.log('🏁 Seed do Capítulo 10 finalizado!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })