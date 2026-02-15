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
    console.log('🌱 Iniciando seed do Capítulo 5: Caldos Nutritivos...')

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

    // 2. Criar Categoria do Capítulo 5
    const categoryName = 'Caldos Nutritivos'
    const categorySlug = slugify(categoryName)

    const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
            name: categoryName,
            slug: categorySlug,
            description: 'Caldos de ossos e carne ricos em colágeno e minerais. A base da culinária ancestral e curativa.',
            type: CategoryType.RECIPE,
        },
    })

    console.log(`📂 Categoria garantida: ${category.name}`)

    // 3. Dados das Receitas
    const recipesData = [
        {
            title: 'Caldo de Ossos Básico (Bone Broth)',
            description: 'O verdadeiro ouro líquido. Rico em colágeno e minerais, ideal para curar o intestino e fortalecer articulações.',
            content: 'Cozido por longas horas (12-24h), este caldo extrai toda a gelatina e nutrientes dos ossos. Tem sabor suave e é usado como base para outras receitas ou consumido como tônico.',
            prepTime: 20,
            cookTime: 1440, // 24 horas em minutos
            servings: 10,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Ossos (bovinos, suínos ou frango) com medula/cartilagem', amount: '1,5 kg', order: 1 },
                { name: 'Pés de galinha (para garantir a gelatina)', amount: '4 unidades', order: 2 },
                { name: 'Vinagre de maçã orgânico', amount: '2 colheres de sopa', order: 3 },
                { name: 'Água filtrada', amount: '3 litros', order: 4 },
                { name: 'Cebola cortada ao meio', amount: '1 unidade', order: 5 },
                { name: 'Alho com casca amassado', amount: '2 dentes', order: 6 },
                { name: 'Cenouras em pedaços', amount: '2 unidades', order: 7 },
                { name: 'Salsão', amount: '2 talos', order: 8 },
            ],
            instructions: [
                'Opcional: Asse os ossos a 200°C por 30min para mais sabor.',
                'Coloque os ossos e pés de galinha numa panela grande, adicione o vinagre e a água. Deixe descansar por 30min (ajuda a extrair minerais).',
                'Adicione os vegetais e leve ao fogo baixo.',
                'Cozinhe por 12 a 24 horas. Retire a espuma que subir no início.',
                'Coe e descarte os sólidos. Deixe esfriar até formar gelatina. Guarde na geladeira por 5 dias ou congele.'
            ]
        },
        {
            title: 'Caldo de Carne e Ossos (Meat Stock)',
            description: 'Mais rápido e saboroso que o Bone Broth, focado na proteína da carne e aminoácidos.',
            content: 'Ideal para quem está começando protocolos de cura intestinal (como GAPS), pois é mais suave para a digestão e rico em sabor.',
            prepTime: 15,
            cookTime: 240, // 4 horas em minutos
            servings: 8,
            difficulty: RecipeDifficulty.EASY,
            ingredients: [
                { name: 'Carne com osso (costela, pescoço, ossobuco)', amount: '1 kg', order: 1 },
                { name: 'Água filtrada', amount: '2 litros', order: 2 },
                { name: 'Cebola em pedaços', amount: '1 unidade', order: 3 },
                { name: 'Alho com casca', amount: '2 dentes', order: 4 },
                { name: 'Cenoura em rodelas', amount: '1 unidade', order: 5 },
                { name: 'Ervas frescas (tomilho, louro)', amount: 'A gosto', order: 6 },
            ],
            instructions: [
                'Lave a carne. Opcional: sele na panela para dourar.',
                'Adicione água, vegetais e temperos. Leve à fervura.',
                'Retire a espuma ("impurezas") que subir nos primeiros 30 minutos.',
                'Reduza o fogo e cozinhe por 3 a 6 horas.',
                'Coe o caldo. A carne pode ser desfiada e comida (diferente do Bone Broth onde a carne costuma perder o sabor).'
            ]
        },
        {
            title: 'Caldo de Frango Ancestral',
            description: 'O clássico "remédio de vó" feito da maneira correta para máxima nutrição e imunidade.',
            content: 'Feito com a carcaça inteira ou partes ósseas, rico em colágeno natural dos pés e pescoço.',
            prepTime: 20,
            cookTime: 480, // 8 horas
            servings: 12,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Frango inteiro ou carcaças/pescoços/asas', amount: '1,5 kg', order: 1 },
                { name: 'Pés de frango (essencial para colágeno)', amount: '2 a 4 unidades', order: 2 },
                { name: 'Vinagre de maçã', amount: '2 colheres de sopa', order: 3 },
                { name: 'Água filtrada fria', amount: '4 litros', order: 4 },
                { name: 'Vegetais aromáticos (cebola, cenoura, aipo)', amount: 'A gosto', order: 5 },
                { name: 'Salsinha fresca', amount: '1 maço', order: 6 },
            ],
            instructions: [
                'Coloque o frango/ossos na panela com água e vinagre. Deixe descansar por 30-60min.',
                'Leve à fervura e retire a espuma da superfície.',
                'Reduza para fogo mínimo, tampe e cozinhe por 6 a 8 horas.',
                'Adicione a salsinha apenas nos últimos 10 minutos (para preservar íons minerais).',
                'Retire o frango, coe o caldo e leve à geladeira. A gordura que solidificar em cima pode ser usada para cozinhar.'
            ]
        },
        {
            title: 'Caldo de Peixe Rápido',
            description: 'Uma variação rica em iodo e minerais do mar, feita com cabeças e espinhas de peixe.',
            content: 'Ao contrário dos caldos de carne, o caldo de peixe fica pronto rápido (1-2 horas) e é uma base excelente para sopas e moquecas.',
            prepTime: 15,
            cookTime: 90, // 1h30
            servings: 8,
            difficulty: RecipeDifficulty.MEDIUM,
            ingredients: [
                { name: 'Carcaça de peixe (cabeça, espinhas, pele)', amount: '1 kg', order: 1 },
                { name: 'Água filtrada', amount: '2 litros', order: 2 },
                { name: 'Vegetais (cebola, alho, cenoura)', amount: 'A gosto', order: 3 },
                { name: 'Vinagre de vinho branco ou limão', amount: '1 colher de sopa', order: 4 },
            ],
            instructions: [
                'Lave bem as carcaças e remova guelras (podem amargar).',
                'Coloque na panela com água, vegetais e o ácido (vinagre/limão).',
                'Ferva, reduza o fogo e cozinhe por apenas 1 a 2 horas.',
                'Coe imediatamente com uma peneira fina.'
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

    console.log('🏁 Seed do Capítulo 5 finalizado!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
