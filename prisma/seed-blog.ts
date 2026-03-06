/**
 * SEED DE POSTS DO BLOG — O Ancestral
 *
 * Como usar com IA:
 *  1. Copie a estrutura do array `blogPostsData` abaixo.
 *  2. Peça à IA para preencher posts com o tema desejado.
 *  3. Execute: npx tsx prisma/seed-blog.ts
 *
 * Campos obrigatórios:    title, excerpt, content, readTime, categorySlug
 * Campos recomendados:    tags, metaTitle, metaDescription, coverImageAlt
 * Campos opcionais:       coverImage, featured, isPremium
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        .replace(/-+$/, '');
}

// ─────────────────────────────────────────────────────────────
// ESTRUTURA DE UM POST — copie e peça à IA para preencher
// ─────────────────────────────────────────────────────────────
//
// categorySlug deve ser um dos valores abaixo (já existem no banco):
//   "nutricao" | "jejum-blog" | "treino" | "mindset" | "estilo-de-vida" | "outros-blog"
//
// content aceita HTML rico (gerado pelo RichTextEditor / TipTap):
//   <h2>, <h3>, <p>, <strong>, <em>, <ul>, <ol>, <li>, <blockquote>, <hr>

interface BlogPostData {
    title: string;           // Título completo do post
    excerpt: string;         // Resumo curto (1–2 frases) usado na listagem e como meta description fallback
    content: string;         // HTML completo do artigo
    readTime: number;        // Tempo estimado de leitura em minutos
    categorySlug: string;    // Slug da categoria (ver lista acima)
    tags: string[];          // Palavras-chave relevantes
    coverImage?: string;     // URL da imagem de capa (pode deixar vazio para definir depois)
    coverImageAlt?: string;  // Texto alternativo da imagem (SEO + acessibilidade)
    metaTitle?: string;      // Título SEO (max 60 chars). Se vazio, usa o título do post
    metaDescription?: string;// Descrição SEO (max 160 chars). Se vazio, usa o excerpt
    featured?: boolean;      // true = aparece em destaque na home
    isPremium?: boolean;     // true = requer assinatura ativa para ler
    published?: boolean;     // false = rascunho (padrão: true no seed)
}

// ─────────────────────────────────────────────────────────────
// ADICIONE OS POSTS AQUI ↓
// ─────────────────────────────────────────────────────────────
const blogPostsData: BlogPostData[] = [
    {
        title: 'Dieta da Selva: O Guia Definitivo da Bioquímica Ancestral e Performance Masculina',
        excerpt: 'Entenda a ciência por trás do protocolo de carnes e frutas. Como otimizar o eixo hormonal, reduzir a inflamação e recuperar a energia que o mundo moderno roubou de você.',
        content: `
<h2>A Crise da Biologia Masculina no Século XXI</h2>
<p>O homem moderno está operando em "modo de segurança". Níveis de testosterona caíram 1% ao ano desde os anos 80, a contagem de espermatozoides despencou e a gordura visceral tornou-se a norma. O culpado? A <strong>Neantropia</strong>: um ambiente artificial que bombardeia nossa biologia com antinutrientes, óleos vegetais inflamatórios e disruptores endócrinos.</p>

<h3>O Erro do Keto Convencional e da Carnívora Estrita</h3>
<p>Muitos buscam a dieta cetogênica para emagrecer, mas o erro comum é o estresse adrenal. O corte total de carboidratos por longos períodos pode elevar o cortisol e reduzir a conversão de T4 em T3 (tireoide), deixando o homem apático. A <strong>Dieta da Selva</strong> resolve isso unindo a densidade nutricional máxima das carnes com o suporte metabólico das frutas.</p>

<h2>Os Pilares da Dieta da Selva</h2>
<h3>1. Densidade Nutricional Animal (O Motor)</h3>
<p>Carnes vermelhas, vísceras (fígado, coração) e ovos não são apenas proteína. São complexos de micronutrientes: ferro heme, zinco, creatina, carnitina e vitamina B12. Sem o colesterol dessas fontes, seu corpo não tem o substrato básico para produzir testosterona.</p>

<h3>2. Frutas Estratégicas (O Combustível)</h3>
<p>As frutas fornecem glicose e frutose que sinalizam abundância ao hipotálamo. Isso mantém o metabolismo acelerado e a insulina controlada, sem os picos desastrosos causados por grãos e açúcares processados. Priorizamos frutas de fácil digestão: mamão, melão, banana madura e frutas cítricas.</p>

<h2>Protocolo Prático: O Dia de um Soberano</h2>
<ul>
  <li><strong>Primeira Refeição (Quebra do Jejum):</strong> 3 a 4 ovos caipiras, 200g de carne moída ou bife de fígado e uma porção de frutas como mamão ou abacaxi (ajuda na digestão proteica).</li>
  <li><strong>Segunda Refeição:</strong> Corte gordo de carne bovina (picanha, costela ou acém) e frutas da estação.</li>
  <li><strong>O que eliminar:</strong> Óleos de soja/canola, sementes, grãos, glúten e qualquer alimento com mais de 3 ingredientes no rótulo.</li>
</ul>

<blockquote>
  <p>"Soberania física começa no prato. Um homem inflamado é um homem facilmente manipulável."</p>
</blockquote>

<h2>Conclusão e Próximos Passos</h2>
<p>A Dieta da Selva não é sobre perder peso; é sobre <strong>ganhar vida</strong>. É o alicerce para quem busca alta performance no trabalho, nos treinos e na liderança da sua família. Comece eliminando os processados hoje e sinta a diferença na sua clareza mental em apenas 7 dias.</p>
        `.trim(),
        readTime: 15,
        categorySlug: 'nutricao',
        tags: ['dieta da selva', 'testosterona', 'performance masculina', 'biohacking', 'nutrição ancestral'],
        coverImageAlt: 'Composição de carne bovina crua de alta qualidade e frutas tropicais frescas',
        metaTitle: 'Dieta da Selva: Nutrição Ancestral para Alta Performance',
        metaDescription: 'O guia completo sobre a Dieta da Selva. Aprenda a combinar carnes e frutas para otimizar hormônios e queimar gordura visceral de forma natural.',
        featured: true,
    },
    {
        title: 'A Forja da Vontade: O Protocolo de Jejum de 72 Horas e o Reset Dopaminérgico',
        excerpt: 'Mais que autofagia, o jejum prolongado é um rito de passagem. Aprenda a fisiologia do jejum de 3 dias e como ele reconstrói sua disciplina e sistema imunológico.',
        content: `
<h2>O Conforto é a Prisão do Homem Moderno</h2>
<p>Vivemos em uma era de hiperestimulação. Comida, pornografia, redes sociais e dopamina barata. O resultado é um homem com a vontade "mole". O jejum de 72 horas é a ferramenta definitiva para quebrar essa escravidão e realizar um <strong>reset sistêmico</strong>.</p>

<h3>A Fisiologia da Regeneração (A Ciência do Jejum)</h3>
<p>O que acontece no seu corpo quando você para de comer por 3 dias?</p>
<ul>
  <li><strong>Autofagia Profunda (24-48h):</strong> Suas células começam a identificar e reciclar proteínas defeituosas e mitocôndrias doentes. É uma limpeza pesada que previne doenças degenerativas.</li>
  <li><strong>Aumento do HGH (Hormônio do Crescimento):</strong> O corpo dispara a produção de HGH em até 5x para preservar a massa magra e as densidades ósseas enquanto busca energia na gordura estocada.</li>
  <li><strong>Células-Tronco (72h):</strong> Estudos mostram que após 72 horas, ocorre um "reset" no sistema imunológico, forçando a produção de novos glóbulos brancos a partir de células-tronco.</li>
</ul>

<h2>O Protocolo de Execução</h2>
<h3>Preparação (24h antes)</h3>
<p>Não entre em jejum após uma "orgia alimentar". Sua última refeição deve ser rica em gorduras e proteínas (Dieta da Selva estrita) para facilitar a transição para a cetose.</p>

<h3>Durante o Jejum: O Kit de Sobrevivência</h3>
<ol>
  <li><strong>Hidratação com Eletrólitos:</strong> Água pura não basta. Você precisa de sal integral (sódio), cloreto de magnésio e potássio para evitar a "gripe do jejum".</li>
  <li><strong>Foco Cognitivo:</strong> Use as janelas de clareza mental para trabalhar em projetos complexos ou estudar textos densos (como as Meditações de Marco Aurélio).</li>
</ol>

<h3>A Reintrodução (O Erro Fatal)</h3>
<p>Muitos quebram o jejum com carboidratos pesados, causando um pico de insulina que gera mal-estar. A quebra deve ser feita com <strong>caldo de ossos</strong> ou um ovo cozido. Espere 1 hora antes de fazer uma refeição sólida.</p>

<blockquote>
  <p>"O jejum ensina que você é o mestre dos seus impulsos, não o escravo deles."</p>
</blockquote>

<h2>Conclusão: O Homem Soberano</h2>
<p>Ao finalizar 72 horas, você terá provado a si mesmo que tem o controle. A clareza mental e a resiliência adquiridas são transportadas para seus negócios e sua vida pessoal. Você não apenas limpou suas células; você forjou seu caráter.</p>
        `.trim(),
        readTime: 20,
        categorySlug: 'jejum-blog',
        tags: ['jejum 72 horas', 'autofagia', 'disciplina', 'estoicismo', 'saúde imunológica'],
        coverImageAlt: 'Homem em silêncio e jejum em ambiente de montanha, focado e resiliente',
        metaTitle: 'Jejum de 72 Horas: O Guia Completo da Autofagia e Disciplina',
        metaDescription: 'Aprenda o passo a passo científico para um jejum de 72 horas. Benefícios para o sistema imunológico, autofagia e força mental.',
        featured: true,
    },
    {
        title: 'Arquétipos e a Sombra: O Mapa Psicológico para a Soberania Masculina',
        excerpt: 'Por que você se sente travado? Entenda como integrar sua Sombra e equilibrar os arquétipos do Rei, Guerreiro, Mago e Amante para dominar sua realidade.',
        content: `
<h2>A Patologia do "Homem Bonzinho"</h2>
<p>A sociedade moderna treina homens para serem inofensivos, passivos e agradáveis. Mas a virtude não é a ausência de força; virtude é ter a força e saber como governá-la. Quando um homem nega sua natureza agressiva e competitiva, ele a empurra para a <strong>Sombra</strong>, onde ela se transforma em vício, depressão ou explosões de raiva incontroláveis.</p>

<h3>Carl Jung e a Integração da Sombra</h3>
<p>Integrar a Sombra não significa tornar-se um vilão. Significa reconhecer seu potencial para a destruição e canalizá-lo para a construção. Um homem que integrou sua sombra é capaz de dizer "não", de proteger sua família e de competir no mercado com ferocidade, sem perder a honra.</p>

<h2>O Quadrante da Soberania Masculina</h2>
<p>Para sair da apatia, você deve amadurecer os quatro arquétipos fundamentais:</p>

<h3>1. O Rei (O Eixo da Ordem)</h3>
<p>O Rei provê a visão e a segurança. Ele é o "Life OS" da sua vida. Quando o seu Rei está fraco, sua vida é desorganizada e você não tem direção. O Rei abençoa os outros e cria um ambiente onde todos prosperam.</p>

<h3>2. O Guerreiro (A Força da Execução)</h3>
<p>O Guerreiro é quem faz o trabalho. Ele acorda cedo, treina pesado e executa as tarefas difíceis do seu SaaS. Ele é focado, impessoal e resiliente. Sem o Guerreiro, você é apenas um sonhador.</p>

<h3>3. O Mago (A Tecnologia e o Conhecimento)</h3>
<p>O Mago é o domínio da técnica. É a sua capacidade de programar, de entender a geopolítica e de biohackear seu próprio corpo. O Mago transforma informação em poder.</p>

<h3>4. O Amante (A Conexão com o Belo)</h3>
<p>O Amante é o que dá cor à vida. É a paixão pela sua esposa, o cuidado com seus filhos e a apreciação pela arte e pela natureza. Sem o Amante, você se torna uma máquina fria e seca.</p>

<h2>Como Começar a Integração Hoje?</h2>
<ul>
  <li><strong>Identifique a Fraqueza:</strong> Onde você está falhando? No excesso de agressividade (Guerreiro tirano) ou na falta de limites (Rei ausente)?</li>
  <li><strong>Enfrente o Desconforto:</strong> A Sombra se esconde onde você tem medo de olhar. Enfrente sua rotina, suas falhas financeiras e suas fraquezas físicas.</li>
  <li><strong>Crie sua Alcateia:</strong> Homens não amadurecem no isolamento. Você precisa de outros homens que busquem a soberania para espelhar sua evolução.</li>
</ul>

<blockquote>
  <p>"Até que você torne o inconsciente consciente, ele direcionará sua vida e você o chamará de destino." — Carl Jung</p>
</blockquote>
        `.trim(),
        readTime: 18,
        categorySlug: 'mindset',
        tags: ['jung', 'arquétipos', 'sombra', 'masculinidade', 'soberania', 'psicologia masculina'],
        coverImageAlt: 'Quatro estátuas clássicas representando as energias de Rei, Guerreiro, Mago e Amante',
        metaTitle: 'Arquétipos Masculinos e Integração da Sombra: O Guia Junguiano',
        metaDescription: 'Recupere sua força masculina através da psicologia analítica. Aprenda a equilibrar o Rei, Guerreiro, Mago e Amante na sua vida.',
        featured: false,
    },
];

// ─────────────────────────────────────────────────────────────
// RUNNER — não precisa alterar
// ─────────────────────────────────────────────────────────────
async function main() {
    // Busca o autor admin
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true, email: true },
    });

    if (!admin) {
        throw new Error(
            '❌ Nenhum usuário ADMIN encontrado. Rode "npx tsx prisma/seed.ts" primeiro.'
        );
    }

    console.log(`👤 Autor: ${admin.email}`);

    let created = 0;
    let skipped = 0;

    for (const post of blogPostsData) {
        const slug = slugify(post.title);

        // Busca a categoria pelo slug
        const category = await prisma.category.findUnique({
            where: { slug: post.categorySlug },
        });

        if (!category) {
            console.warn(
                `⚠️  Categoria "${post.categorySlug}" não encontrada. Post "${post.title}" ignorado.`
            );
            skipped++;
            continue;
        }

        const existing = await prisma.blogPost.findUnique({ where: { slug } });

        if (existing) {
            console.log(`⏭  Já existe: "${post.title}"`);
            skipped++;
            continue;
        }

        await prisma.blogPost.create({
            data: {
                title: post.title,
                slug,
                excerpt: post.excerpt,
                content: post.content,
                coverImage: post.coverImage || null,
                coverImageAlt: post.coverImageAlt || null,
                tags: post.tags ?? [],
                readTime: post.readTime,
                published: post.published ?? true,
                publishedAt: post.published !== false ? new Date() : null,
                featured: post.featured ?? false,
                isPremium: post.isPremium ?? false,
                metaTitle: post.metaTitle || null,
                metaDescription: post.metaDescription || null,
                authorId: admin.id,
                categoryId: category.id,
            },
        });

        console.log(`✅ Criado: "${post.title}"`);
        created++;
    }

    console.log(`\n🏁 Seed finalizado! ${created} criados, ${skipped} ignorados.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
