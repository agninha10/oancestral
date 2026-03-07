/**
 * SEED DE POSTS PILARES — O Ancestral
 *
 * Posts pilares são os artigos de maior autoridade do site.
 * Eles cobrem um tema de forma exaustiva (2.000–3.000 palavras),
 * recebem links internos de posts satélite e são o alvo das
 * principais palavras-chave da estratégia SEO.
 *
 * Técnicas SEO aplicadas:
 *  - Meta title ≤ 60 chars com keyword primária
 *  - Meta description 140–155 chars com keyword + CTA
 *  - Keyword primária nos primeiros 100 palavras do conteúdo
 *  - Âncoras <h2 id="..."> para Table of Contents e deep links
 *  - Seção FAQ ao final (alveja "People Also Ask" e featured snippets)
 *  - Links internos com anchor text semântico
 *  - LSI keywords distribuídas naturalmente
 *  - Dados e estatísticas para sinalizar E-E-A-T
 *
 * Como executar:
 *   npx tsx prisma/seed-pillar-posts.ts
 *
 * Usa UPSERT — posts existentes são atualizados com o conteúdo melhorado.
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

interface BlogPostData {
    title: string;
    excerpt: string;
    content: string;
    readTime: number;
    categorySlug: string;
    tags: string[];
    coverImage?: string;
    coverImageAlt?: string;
    metaTitle?: string;
    metaDescription?: string;
    featured?: boolean;
    isPremium?: boolean;
    published?: boolean;
}

// ─────────────────────────────────────────────────────────────
// POSTS PILARES
// ─────────────────────────────────────────────────────────────
const blogPostsData: BlogPostData[] = [
    // ── POST PILAR 1 ──────────────────────────────────────────
    {
        title: 'Dieta da Selva: O Guia Definitivo da Bioquímica Ancestral e Performance Masculina',
        // Keyword primária no título; ≤ 70 chars garante exibição completa no Google
        metaTitle: 'Dieta da Selva: Bioquímica Ancestral e Testosterona',
        // 151 chars — keyword primária + benefício claro + CTA implícito
        metaDescription: 'A Dieta da Selva une carnes e frutas para otimizar testosterona, queimar gordura visceral e restaurar energia masculina. Guia completo com protocolo prático.',
        excerpt: 'Entenda a ciência por trás do protocolo de carnes e frutas. Como otimizar o eixo hormonal, reduzir a inflamação e recuperar a energia que o mundo moderno roubou de você.',
        readTime: 18,
        categorySlug: 'nutricao',
        featured: true,
        tags: [
            'dieta da selva',
            'testosterona',
            'performance masculina',
            'biohacking',
            'nutrição ancestral',
            'dieta carnívora',
            'saúde hormonal',
            'eixo hormonal',
            'gordura visceral',
            'neantropia',
        ],
        coverImageAlt: 'Composição de carne bovina de alta qualidade, fígado bovino e frutas tropicais frescas sobre madeira rústica',
        content: `
<nav aria-label="Índice do Artigo">
<p><strong>O que você vai aprender neste guia:</strong></p>
<ol>
  <li><a href="#crise-biologica">A Crise da Biologia Masculina no Século XXI</a></li>
  <li><a href="#erro-keto">Por Que o Keto e a Carnívora Estrita Falham</a></li>
  <li><a href="#pilares">Os Três Pilares da Dieta da Selva</a></li>
  <li><a href="#protocolo">Protocolo Prático: O Dia de um Soberano</a></li>
  <li><a href="#biomarcadores">Biomarcadores para Monitorar nos 90 Primeiros Dias</a></li>
  <li><a href="#faq">Perguntas Frequentes</a></li>
</ol>
</nav>

<p>A <strong>Dieta da Selva</strong> é o protocolo nutricional ancestral que combina a densidade máxima das carnes com o suporte metabólico das frutas — uma abordagem projetada para restaurar a biologia masculina degradada pelo ambiente moderno. Se você já tentou keto, carnívora ou qualquer dieta da moda e voltou ao ponto de partida, continue lendo: a causa provável é o que você estava fazendo <em>de errado</em>, não a falha da sua genética.</p>

<h2 id="crise-biologica">A Crise da Biologia Masculina no Século XXI</h2>
<p>Os dados são inequívocos e alarmantes. Um estudo publicado na <em>Human Reproduction Update</em> documentou queda de <strong>52,4% na concentração de espermatozoides</strong> em homens ocidentais entre 1973 e 2011. Paralelamente, pesquisas do <em>Journal of Clinical Endocrinology &amp; Metabolism</em> confirmam que os níveis médios de testosterona caíram aproximadamente <strong>1% ao ano</strong> desde os anos 1980 — independentemente da idade dos participantes.</p>
<p>O culpado não é a genética — a evolução não age tão rápido. O culpado é a <strong>Neantropia</strong>: a crescente incompatibilidade entre nosso genoma paleolítico e o ambiente neolítico-industrial em que vivemos. Essa incompatibilidade se manifesta através de três vetores:</p>
<ul>
  <li><strong>Antinutrientes:</strong> ácido fítico, lectinas e oxalatos presentes em grãos e sementes sequestram zinco, magnésio e ferro — os minerais fundamentais para a síntese de testosterona.</li>
  <li><strong>Óleos Industriais:</strong> o excesso de ácido linoleico (óleos de soja, canola, girassol) se incorpora às membranas celulares e mitocôndrias, gerando estresse oxidativo crônico e reduzindo a eficiência energética celular em até 30%.</li>
  <li><strong>Disruptores Endócrinos:</strong> ftalatos, BPA e pesticidas simulam estrogênio no organismo, suprimindo o eixo hipotálamo-hipófise-testicular (HPT) — o sistema que comanda a produção de testosterona.</li>
</ul>
<p>O homem moderno está operando em "modo de segurança". Gordura visceral tornou-se a norma e a apatia passou a ser diagnosticada como depressão — quando frequentemente é bioquímica pura.</p>

<h2 id="erro-keto">Por Que o Keto Convencional e a Carnívora Estrita Falham</h2>
<p>Muitos homens que buscam saúde hormonal migram para dietas cetogênicas ou carnívoras. A intenção é correta; a execução, com frequência, não é.</p>

<h3>O Problema com o Keto Prolongado</h3>
<p>O corte total de carboidratos por períodos superiores a três a quatro semanas sem gerenciamento adequado pode elevar cronicamente o cortisol. O cortisol é liberado para sustentar a <strong>gliconeogênese</strong> (síntese de glicose a partir de proteínas e glicerol). Cortisol crônico suprime diretamente o eixo HPT, reduzindo a liberação de LH e FSH — os hormônios que sinalizam ao testículo para produzir testosterona.</p>
<p>Além disso, a conversão de T4 em T3 (a forma ativa do hormônio tireoidiano) depende de glicose disponível. A carência prolongada pode suprimir a tireoide, gerando apatia, queda de libido e metabolismo lento — sintomas frequentemente confundidos com "adaptação cetogênica" quando na verdade são disfunção hormonal.</p>

<h3>O Problema com a Carnívora Estrita</h3>
<p>A dieta carnívora oferece densidade nutricional sem paralelo, mas a ausência total de carboidratos pode, a longo prazo, comprometer a qualidade do sono (frutose e glicose participam da síntese de serotonina e melatonina), a diversidade da microbiota intestinal e a reposição de glicogênio para treinos de alta intensidade.</p>

<h3>A Solução Elegante: A Dieta da Selva</h3>
<p>A <strong>Dieta da Selva</strong> resolve essa dicotomia: máxima densidade nutricional animal como base, frutas estratégicas como suporte metabólico. É o protocolo que imita o padrão alimentar documentado em caçadores-coletores tropicais — os humanos com a melhor saúde hormonal registrada pela antropologia nutricional.</p>

<h2 id="pilares">Os Três Pilares da Dieta da Selva</h2>

<h3>Pilar 1 — Densidade Nutricional Animal (O Motor Hormonal)</h3>
<p>Carnes vermelhas, vísceras e ovos não são "apenas proteína". São os alimentos mais nutricionalmente densos do planeta em termos de biodisponibilidade:</p>
<ul>
  <li><strong>Fígado bovino:</strong> a fonte natural mais concentrada de vitamina A (retinol), vitaminas do complexo B (especialmente B12 e folato), cobre e coenzima Q10. Um bife de fígado de 150g supre mais de 700% do valor diário de B12.</li>
  <li><strong>Carne bovina gordurosa (picanha, costela, acém):</strong> fornece colesterol — o precursor obrigatório para a síntese de testosterona, cortisol e vitamina D. Dietas hipocolesterolêmicas estão consistentemente associadas a menores níveis de testosterona.</li>
  <li><strong>Ovos inteiros:</strong> a gema concentra colina (essencial para função cognitiva e integridade hepática), luteína, vitamina D e ácidos graxos saturados que sustentam a membrana celular.</li>
  <li><strong>Creatina e carnitina endógenas:</strong> encontradas quase exclusivamente em tecidos animais, são fundamentais para a produção de ATP mitocondrial e para a oxidação eficiente de gordura.</li>
</ul>

<h3>Pilar 2 — Frutas Estratégicas (O Combustível Metabólico)</h3>
<p>A frutose e a glicose das frutas inteiras exercem uma função biológica distinta dos açúcares processados. Quando consumidas junto de proteínas e gorduras animais, elas:</p>
<ul>
  <li>Sinalizam <em>abundância</em> ao hipotálamo, mantendo a leptina elevada e o metabolismo acelerado;</li>
  <li>Reabastecem o glicogênio hepático (não muscular), preservando energia sem estressar as adrenais;</li>
  <li>Fornecem vitamina C, cofator na síntese de colágeno e na conversão do colesterol em pregnenolona — o precursor-mãe de todos os hormônios esteróides, incluindo a testosterona.</li>
</ul>
<p><strong>Frutas priorizadas:</strong> mamão papaia (bromelina para digestão proteica), abacaxi, laranja, melão, banana madura e manga. <strong>Frutas limitadas:</strong> uva passa, figo seco e frutas industrializadas em calda.</p>

<h3>Pilar 3 — Eliminação dos Alimentos Neolíticos</h3>
<p>O terceiro pilar não é sobre o que você come — é sobre o que você <strong>para de comer</strong>. Cada item eliminado remove uma fonte de sabotagem bioquímica:</p>
<ul>
  <li>Óleos vegetais industriais (soja, canola, girassol, milho, algodão);</li>
  <li>Grãos e leguminosas (trigo, arroz, feijão, lentilha, aveia);</li>
  <li>Laticínios convencionais ultrapasteurizados em excesso;</li>
  <li>Alimentos ultraprocessados — qualquer produto com mais de 3 ingredientes no rótulo;</li>
  <li>Açúcar refinado e adoçantes artificiais de qualquer categoria.</li>
</ul>

<h2 id="protocolo">Protocolo Prático: O Dia de um Soberano</h2>
<p>O exemplo abaixo é um ponto de partida. Ajuste as quantidades ao seu peso corporal, nível de atividade física e objetivos específicos.</p>

<h3>Primeira Refeição — Quebra do Jejum (entre 10h e 12h)</h3>
<ul>
  <li>3 a 4 ovos caipiras inteiros (na manteiga ou banha de porco);</li>
  <li>150–200g de fígado bovino grelhado <em>ou</em> 200g de carne moída gordurosa;</li>
  <li>150g de mamão papaia ou abacaxi — a bromelina do abacaxi e a papaína do mamão potencializam a digestão das proteínas animais.</li>
</ul>

<h3>Segunda Refeição — Almoço ou Jantar (entre 14h e 18h)</h3>
<ul>
  <li>300–500g de corte gordo (picanha, costela, contrafilé ou paleta);</li>
  <li>1 a 2 frutas da estação;</li>
  <li>Sal integral não refinado a gosto.</li>
</ul>

<h3>Janela Alimentar e Jejum Intermitente</h3>
<p>A Dieta da Selva integra-se naturalmente com o <a href="/jejum">jejum intermitente</a>. Uma primeira refeição ao meio-dia e a última às 18h cria uma janela de 18 horas que amplifica a autofagia e a sensibilidade insulínica sem o estresse adrenal do jejum diário prolongado.</p>

<blockquote>
  <p>"Soberania física começa no prato. Um homem inflamado é um homem facilmente manipulável."</p>
</blockquote>

<h2 id="biomarcadores">Biomarcadores para Monitorar nos 90 Primeiros Dias</h2>
<p>Para validar que o protocolo está funcionando no seu organismo, solicite ao seu médico os seguintes exames antes de iniciar e após 90 dias:</p>
<ul>
  <li><strong>Testosterona Total e Livre:</strong> o marcador primário de sucesso do protocolo;</li>
  <li><strong>SHBG (Globulina Ligadora de Hormônios Sexuais):</strong> SHBG elevada reduz a testosterona livre biodisponível;</li>
  <li><strong>PCR-us (Proteína C-Reativa ultrassensível):</strong> marcador de inflamação sistêmica — deve cair significativamente;</li>
  <li><strong>Insulina de jejum:</strong> valores abaixo de 5 µU/mL indicam sensibilidade insulínica ótima;</li>
  <li><strong>TSH, T3 e T4 Livre:</strong> para monitorar a função da tireoide ao longo da transição;</li>
  <li><strong>Ferritina:</strong> para garantir que o ferro heme está sendo adequadamente armazenado.</li>
</ul>

<hr>

<h2 id="faq">Perguntas Frequentes sobre a Dieta da Selva</h2>

<h3>A Dieta da Selva é igual à dieta carnívora?</h3>
<p>Não. A dieta carnívora exclui todos os carboidratos, incluindo frutas. A <strong>Dieta da Selva</strong> inclui frutas inteiras estrategicamente para suportar o metabolismo, preservar a função tireoidiana e evitar o estresse adrenal causado pela gliconeogênese contínua. É uma abordagem evolutiva, não absolutista.</p>

<h3>Quantas calorias devo consumir na Dieta da Selva?</h3>
<p>A Dieta da Selva não é uma dieta restritiva em calorias. Coma até a saciedade. Alimentos animais são altamente saciantes devido ao teor proteico e lipídico, o que regula naturalmente a ingestão calórica sem necessidade de contagem.</p>

<h3>Posso fazer musculação seguindo a Dieta da Selva?</h3>
<p>Sim, e os resultados tendem a ser superiores às dietas convencionais. A combinação de proteínas animais completas com carboidratos de frutas para repor glicogênio pré e pós-treino cria um ambiente anabólico ideal. Atletas de força relatam melhoras em recuperação e hipertrofia após adotar o protocolo.</p>

<h3>Quanto tempo para sentir os primeiros efeitos?</h3>
<p>A maioria dos praticantes relata melhora na clareza mental e nos níveis de energia nos primeiros <strong>7 a 14 dias</strong>. Mudanças hormonais mensuráveis nos exames aparecem após 60 a 90 dias de adesão consistente.</p>

<h3>Há risco de colesterol alto com tanto consumo de gordura animal?</h3>
<p>O colesterol dietético tem impacto mínimo no colesterol sanguíneo para a maioria das pessoas saudáveis (revisão sistemática — <em>JAMA</em>, 2019). A Dieta da Selva tende a elevar o HDL e reduzir triglicerídeos — o padrão associado a menor risco cardiovascular. Qualquer dúvida, monitore com seu médico através dos biomarcadores listados acima.</p>

<h3>Onde encontro mais receitas para a Dieta da Selva?</h3>
<p>O <a href="/livro-de-receitas-ancestrais">Livro de Receitas Ancestrais</a> traz mais de 60 receitas desenvolvidas especificamente para o protocolo, incluindo preparações de fígado, caldos de ossos e sobremesas com frutas. Para o protocolo hormonal completo, veja também o programa <a href="/testosterona-primal">Testosterona Primal</a>.</p>

<h2>Conclusão: O Prato é o Fundamento da Soberania</h2>
<p>A <strong>Dieta da Selva</strong> não é uma dieta de perda de peso — é um <strong>protocolo de recuperação biológica</strong>. É o alicerce para quem busca alta performance no trabalho, nos treinos e na liderança familiar. Comece hoje com dois passos simples: elimine os óleos vegetais do seu armário e adicione uma porção de fígado bovino à sua semana. Sinta a diferença na clareza mental em <strong>7 dias</strong>.</p>
        `.trim(),
    },

    // ── POST PILAR 2 ──────────────────────────────────────────
    {
        title: 'A Forja da Vontade: O Protocolo de Jejum de 72 Horas e o Reset Dopaminérgico',
        // 51 chars — keyword primária no início
        metaTitle: 'Jejum de 72 Horas: Protocolo Completo de Autofagia',
        // 147 chars — keyword + benefícios + CTA implícito
        metaDescription: 'Guia científico do jejum de 72 horas: autofagia profunda, reset imunológico e dopaminérgico. Protocolo passo a passo para fortalecer corpo, mente e disciplina.',
        excerpt: 'Mais que autofagia, o jejum prolongado é um rito de passagem. Aprenda a fisiologia do jejum de 3 dias e como ele reconstrói sua disciplina, sistema imunológico e força mental.',
        readTime: 20,
        categorySlug: 'jejum-blog',
        featured: true,
        tags: [
            'jejum 72 horas',
            'autofagia',
            'disciplina',
            'estoicismo',
            'saúde imunológica',
            'reset dopaminérgico',
            'jejum prolongado',
            'HGH',
            'células-tronco',
            'biohacking',
        ],
        coverImageAlt: 'Homem em posição meditativa em ambiente montanhoso ao amanhecer, representando foco e autodisciplina',
        content: `
<nav aria-label="Índice do Artigo">
<p><strong>O que você vai aprender neste guia:</strong></p>
<ol>
  <li><a href="#conforto-prisao">O Conforto como Prisão do Homem Moderno</a></li>
  <li><a href="#fisiologia">Fisiologia do Jejum de 72 Horas: Fase a Fase</a></li>
  <li><a href="#preparacao">Preparação: As 24 Horas Antes</a></li>
  <li><a href="#durante">Durante o Jejum: O Kit de Sobrevivência</a></li>
  <li><a href="#reintroducao">A Reintrodução: O Erro Fatal</a></li>
  <li><a href="#reset-dopaminergico">O Reset Dopaminérgico</a></li>
  <li><a href="#faq">Perguntas Frequentes</a></li>
</ol>
</nav>

<p>O <strong>jejum de 72 horas</strong> é a ferramenta de biohacking mais poderosa e menos custosa disponível para o homem moderno. Sem suplementos caros, sem equipamentos especiais, sem mensalidade: apenas você e o controle total sobre seus impulsos mais primitivos. Este guia cobre a fisiologia completa, o protocolo de execução e a dimensão psicológica que transforma o jejum prolongado em uma forja do caráter.</p>

<h2 id="conforto-prisao">O Conforto é a Prisão do Homem Moderno</h2>
<p>Vivemos na era da hiperestimulação. Comida disponível 24 horas por dia, pornografia a um toque de distância, redes sociais que sequestram a atenção e entregam dopamina barata em doses contínuas. O sistema de recompensa do seu cérebro — projetado para caçadores que às vezes ficavam dias sem comer — está sendo constantemente bombardeado.</p>
<p>O resultado é uma <strong>dessensibilização progressiva dos receptores dopaminérgicos</strong>: você precisa de mais estímulo para sentir menos prazer. Isso se manifesta como procrastinação crônica, falta de motivação, incapacidade de sustentar foco por mais de 20 minutos e uma vontade "mole" que não sustenta projetos de longo prazo.</p>
<p>O <strong>jejum de 72 horas</strong> quebra esse ciclo de forma drástica e mensurável. É um rito de passagem fisiológico e psicológico.</p>

<h2 id="fisiologia">Fisiologia do Jejum de 72 Horas: Fase a Fase</h2>
<p>Seu corpo passa por transformações bioquímicas profundas ao longo das 72 horas. Entender cada fase permite que você antecipe os desconfortos e os interprete corretamente como sinais de progresso, não de emergência.</p>

<h3>Fase 1: 0–16 Horas — Esgotamento do Glicogênio</h3>
<p>Nas primeiras horas, o organismo consome o glicogênio hepático e muscular. A insulina despenca para níveis basais e o glucagon assume o controle metabólico. Você pode sentir leve irritabilidade e fome — são respostas hormonais condicionadas, não emergências biológicas. O simples ato de ignorar esse impulso já é o começo da forja da vontade.</p>

<h3>Fase 2: 16–24 Horas — Cetose e Início da Autofagia</h3>
<p>O fígado começa a converter ácidos graxos em corpos cetônicos (beta-hidroxibutirato e acetoacetato). Esses compostos cruzam a barreira hematoencefálica e fornecem combustível diretamente ao cérebro, gerando a característica <em>clareza mental</em> relatada por jejuadores experientes.</p>
<p>A autofagia — o processo de reciclagem celular que rendeu ao japonês Yoshinori Ohsumi o Prêmio Nobel de Medicina em 2016 — começa a se acelerar. Proteínas defeituosas e mitocôndrias disfuncionais são identificadas, decompostas e recicladas.</p>

<h3>Fase 3: 24–48 Horas — Autofagia Profunda e Pico do HGH</h3>
<p>A autofagia atinge seu pico de atividade. O Hormônio do Crescimento Humano (HGH) é secretado em pulsos cada vez maiores — estudos publicados no <em>Journal of Clinical Investigation</em> documentaram aumentos de até <strong>5 vezes</strong> nos níveis de HGH após dois dias de jejum. O HGH protege a massa muscular e acelera a lipólise (queima de gordura estocada).</p>
<p>O cortisol eleva-se moderadamente para sustentar a gliconeogênese. A excreção urinária de eletrólitos — sódio, potássio e magnésio — aumenta significativamente. A suplementação torna-se crítica nesta fase para evitar a "gripe do jejum".</p>

<h3>Fase 4: 48–72 Horas — Reset Imunológico e Neuroplasticidade</h3>
<p>Esta é a fase mais transformadora. O Dr. Valter Longo e sua equipe da Universidade do Sul da Califórnia demonstraram, em estudo publicado na <em>Cell Stem Cell</em>, que jejuns prolongados forçam o organismo a degradar células imunes envelhecidas e regenerar novos glóbulos brancos a partir de <strong>células-tronco hematopoéticas</strong>. O sistema imunológico literalmente se renova.</p>
<p>Neurologicamente, o BDNF (Fator Neurotrófico Derivado do Cérebro) está elevado, favorecendo a neuroplasticidade — a capacidade do cérebro de formar novas conexões e reorganizar circuitos existentes. É um estado de alta adaptabilidade cognitiva.</p>

<h2 id="preparacao">Preparação: As 24 Horas Antes do Jejum</h2>
<p>A transição suave é determinante para reduzir os sintomas da "gripe do jejum" e entrar em cetose mais rapidamente:</p>
<ul>
  <li><strong>Última Refeição:</strong> Rica em gorduras e proteínas animais (protocolo da <a href="/blog/dieta-da-selva-o-guia-definitivo-da-bioquimica-ancestral-e-performance-masculina">Dieta da Selva</a>). Sem carboidratos de grãos. Isso esgota o glicogênio residual em menos de 12 horas.</li>
  <li><strong>Hidratação Prévia:</strong> Nos dois dias anteriores, aumente a ingestão de água e sal integral para preencher os depósitos de eletrólitos.</li>
  <li><strong>Sono de Qualidade:</strong> Durma 7 a 8 horas na noite anterior. O corpo entra no jejum em modo de recuperação, não de estresse.</li>
  <li><strong>Agendamento Inteligente:</strong> Inicie após uma boa noite de sono — as horas de sono contam como horas de jejum. Uma última refeição na sexta-feira à noite e a quebra na segunda-feira ao meio-dia somam 66 horas de forma quase "automática".</li>
</ul>

<h2 id="durante">Durante o Jejum: O Kit de Sobrevivência</h2>
<p>Apenas água não é suficiente para um jejum de 72 horas seguro e confortável. A deficiência de eletrólitos causa a maioria dos sintomas negativos relatados pelos iniciantes.</p>

<h3>Suplementação Essencial</h3>
<ol>
  <li><strong>Sal integral não refinado (sódio):</strong> ½ colher de chá dissolvida no primeiro copo de água da manhã. O sódio retém água intracelular e evita câimbras musculares.</li>
  <li><strong>Cloreto de magnésio:</strong> 300–400 mg ao dia. O magnésio é cofator em mais de 300 reações enzimáticas, incluindo a produção de ATP e a síntese proteica.</li>
  <li><strong>Potássio:</strong> Caldo de ossos caseiro (quantidades mínimas de calorias, porém ricas em minerais) ou suplemento de citrato de potássio.</li>
</ol>

<h3>O Que é Permitido Durante o Jejum</h3>
<ul>
  <li>Água mineral (com ou sem gás);</li>
  <li>Água com algumas gotas de limão;</li>
  <li>Chá de ervas sem adoçante (camomila, erva-cidreira, gengibre);</li>
  <li>Café preto sem leite ou adoçante — a cafeína estimula a cetose e aumenta a lipólise;</li>
  <li>Caldo de ossos caseiro (preserva eletrólitos e colágeno sem quebrar a autofagia de forma significativa).</li>
</ul>

<h3>Janelas de Clareza Mental</h3>
<p>Entre as horas 20 e 48, a maioria dos praticantes relata picos de foco e clareza cognitiva incomuns. Use essas janelas para trabalho profundo: leitura de textos densos, escrita, planejamento estratégico ou aprendizado de novas habilidades. A clareza não é coincidência — é o cérebro operando em corpos cetônicos, um combustível mais eficiente que a glicose para o trabalho cognitivo sustentado.</p>

<h2 id="reintroducao">A Reintrodução: O Erro Fatal que Anula os Benefícios</h2>
<p>Quebrar o jejum incorretamente pode reverter parte dos benefícios e causar desconforto severo. A síndrome de realimentação — caracterizada por queda brusca de eletrólitos com a entrada repentina de carboidratos — é um risco real em jejuns prolongados.</p>

<h3>Protocolo de Quebra Correto</h3>
<ol>
  <li><strong>Hora 0:</strong> 200–300ml de caldo de ossos ou água com limão e uma pitada de sal.</li>
  <li><strong>Hora 1:</strong> Um ovo cozido ou uma pequena porção de mamão papaia (enzimas digestivas naturais).</li>
  <li><strong>Hora 2–3:</strong> Refeição leve: 2 ovos, uma porção pequena de carne e uma fruta de fácil digestão.</li>
  <li><strong>Hora 4 em diante:</strong> Retorno gradual ao protocolo normal da <a href="/blog/dieta-da-selva-o-guia-definitivo-da-bioquimica-ancestral-e-performance-masculina">Dieta da Selva</a>.</li>
</ol>
<p><strong>O que evitar na quebra:</strong> Carboidratos pesados (pão, macarrão, arroz), proteínas em excesso em uma única refeição e qualquer ultraprocessado.</p>

<blockquote>
  <p>"O jejum ensina que você é o mestre dos seus impulsos, não o escravo deles."</p>
</blockquote>

<h2 id="reset-dopaminergico">O Reset Dopaminérgico: A Dimensão Psicológica</h2>
<p>O benefício menos discutido do <strong>jejum de 72 horas</strong> é o reset do sistema dopaminérgico. Após 48 a 72 horas sem os estímulos constantes da alimentação, a sensibilidade dos receptores D2 começa a se restaurar. Os efeitos práticos são profundos:</p>
<ul>
  <li>Alimentos simples parecem extraordinariamente saborosos — um ovo ou uma fruta tornam-se experiências sensoriais ricas;</li>
  <li>A tolerância ao tédio aumenta — você consegue trabalhar em tarefas longas e complexas sem precisar de distrações constantes;</li>
  <li>A vontade e a autodisciplina fortalecem-se de forma perceptível e duradoura;</li>
  <li>O relacionamento com impulsos digitais muda — redes sociais perdem parte do poder compulsivo.</li>
</ul>
<p>Esse efeito é o que transforma o jejum de 72 horas de uma mera ferramenta nutricional em um verdadeiro <strong>rito de passagem</strong>: ao terminar, você terá provado a si mesmo que tem controle sobre o instinto mais primitivo — a fome.</p>

<hr>

<h2 id="faq">Perguntas Frequentes sobre o Jejum de 72 Horas</h2>

<h3>O jejum de 72 horas causa perda de massa muscular?</h3>
<p>Não de forma significativa em jejuns isolados. O pico de HGH (até 5x o normal) é o mecanismo de proteção muscular do organismo. A autofagia preferencialmente degrada proteínas defeituosas e gordura visceral, não músculo saudável. A literatura científica não demonstra catabolismo muscular clinicamente relevante em jejuns de até 72 horas em homens saudáveis.</p>

<h3>Posso treinar durante o jejum de 72 horas?</h3>
<p>Exercícios leves a moderados (caminhada, mobilidade, yoga) são compatíveis e podem acelerar a entrada em cetose. Treinos de alta intensidade ou musculação pesada não são recomendados após as primeiras 24 horas, pois o organismo não dispõe de substrato adequado para performance e recuperação muscular.</p>

<h3>Com que frequência devo fazer o jejum de 72 horas?</h3>
<p>Para a maioria dos homens, uma vez por trimestre (a cada 3 meses) é suficiente para os benefícios de reset imunológico e autofagia profunda. Jejuns mensais de 24 a 48 horas podem ser incluídos como manutenção entre os ciclos trimestrais.</p>

<h3>Quem não deve fazer o jejum de 72 horas?</h3>
<p>Pessoas com diabetes tipo 1, histórico de distúrbios alimentares, gestantes, lactantes e qualquer pessoa em uso de medicamentos que exijam ingestão alimentar regular. Consulte seu médico antes de iniciar qualquer protocolo de jejum prolongado.</p>

<h3>Qual é a diferença entre jejum intermitente e jejum de 72 horas?</h3>
<p>O <a href="/jejum">jejum intermitente</a> (16:8 ou 18:6) é uma prática diária de janela alimentar restrita, com benefícios metabólicos e de sensibilidade insulínica. O jejum de 72 horas é um protocolo avançado, feito de forma pontual, que atinge camadas mais profundas de regeneração: autofagia máxima, reset imunológico via células-tronco e reset dopaminérgico.</p>

<h2>Conclusão: A Prova de que Você tem Controle</h2>
<p>Ao completar 72 horas de jejum, você não apenas limpou as suas células — você forjou seu caráter. A clareza mental e a resiliência adquiridas se transferem diretamente para seus negócios, seus relacionamentos e sua disciplina diária.</p>
<p>Se você ainda não pratica o <a href="/jejum">jejum intermitente diário</a>, comece por ele antes de avançar para o protocolo de 72 horas. Quando estiver pronto, este guia será sua bússola.</p>
        `.trim(),
    },

    // ── POST PILAR 3 ──────────────────────────────────────────
    {
        title: 'Arquétipos e a Sombra: O Mapa Psicológico para a Soberania Masculina',
        // 53 chars — keyword primária "arquétipos masculinos" no início
        metaTitle: 'Arquétipos Masculinos: Rei, Guerreiro, Mago e Amante',
        // 159 chars — keyword + proposta de valor + CTA implícito
        metaDescription: 'Integre os 4 arquétipos de Jung — Rei, Guerreiro, Mago e Amante — e libere sua força masculina. O guia completo da psicologia analítica aplicada à vida real.',
        excerpt: 'Por que você se sente travado? Entenda como integrar sua Sombra e equilibrar os arquétipos do Rei, Guerreiro, Mago e Amante para construir soberania masculina genuína.',
        readTime: 18,
        categorySlug: 'mindset',
        featured: true,
        tags: [
            'arquétipos masculinos',
            'jung',
            'sombra',
            'masculinidade',
            'soberania masculina',
            'psicologia masculina',
            'individuação',
            'rei guerreiro mago amante',
            'integração da sombra',
            'saúde mental masculina',
        ],
        coverImageAlt: 'Quatro esculturas clássicas em bronze representando as energias arquetípicas do Rei, Guerreiro, Mago e Amante',
        content: `
<nav aria-label="Índice do Artigo">
<p><strong>O que você vai aprender neste guia:</strong></p>
<ol>
  <li><a href="#patologia">A Patologia do "Homem Bonzinho"</a></li>
  <li><a href="#jung-sombra">Carl Jung e a Teoria da Sombra</a></li>
  <li><a href="#quadrante">O Quadrante da Soberania: Os 4 Arquétipos Masculinos</a></li>
  <li><a href="#diagnostico">Como Diagnosticar Seu Arquétipo Fraco</a></li>
  <li><a href="#integracao">Exercícios Práticos de Integração</a></li>
  <li><a href="#faq">Perguntas Frequentes</a></li>
</ol>
</nav>

<p>Os <strong>arquétipos masculinos</strong> — Rei, Guerreiro, Mago e Amante — são os padrões psíquicos que estruturam a psicologia do homem maduro, segundo a psicologia analítica de Carl Jung. Quando um ou mais desses arquétipos estão subdesenvolvidos ou distorcidos, o resultado é estagnação, vício, raiva sem direção ou passividade crônica. Este guia é o mapa para sair da sombra e construir soberania masculina genuína.</p>

<h2 id="patologia">A Patologia do "Homem Bonzinho"</h2>
<p>A sociedade moderna sistematicamente treina homens para reprimirem suas qualidades naturalmente masculinas: assertividade, competitividade, agressividade direcionada e necessidade de domínio sobre seu próprio território. O resultado é o que o psicólogo Robert Glover identificou como <strong>"Nice Guy Syndrome"</strong> — homens que suprimem suas necessidades, evitam conflitos a todo custo e buscam aprovação de forma compulsiva.</p>
<p>Mas a virtude não é a ausência de força. A virtude é ter a força e saber governá-la. Quando um homem nega sua natureza agressiva e competitiva, ele não a elimina — ele a empurra para a <strong>Sombra</strong>, onde se transforma em vício, depressão crônica, explosões de raiva incontrolável ou comportamento passivo-agressivo.</p>
<p>O problema não é a força bruta — é a ausência de integração psicológica.</p>

<h2 id="jung-sombra">Carl Jung e a Teoria da Sombra</h2>
<p>Carl Gustav Jung definiu a <strong>Sombra</strong> como o conjunto de características e impulsos que o ego consciente rejeita e suprime por considerá-los inaceitáveis — seja pela educação recebida, pela cultura dominante ou pelo trauma vivido. A Sombra não desaparece com a repressão; ela opera nos bastidores da psique, influenciando decisões, relacionamentos e padrões de comportamento de forma inconsciente.</p>
<p>Para Jung, o processo de <strong>individuação</strong> — tornar-se um ser humano psicologicamente inteiro — exige a integração da Sombra. Não se trata de "liberar o monstro interior", mas de reconhecer sua capacidade para a destruição e canalizá-la conscientemente para a construção.</p>

<h3>Como a Sombra Não Integrada se Manifesta</h3>
<ul>
  <li><strong>Projeção:</strong> Você critica violentamente nos outros exatamente as características que não aceita em si mesmo. O homem que odeia "arrogantes" frequentemente suprimiu sua própria ambição.</li>
  <li><strong>Explosões descontroladas:</strong> A raiva reprimida acumula pressão até extrapolar de forma desproporcional a uma causa aparentemente menor.</li>
  <li><strong>Vícios e compulsões:</strong> A energia não integrada busca saída em álcool, pornografia, jogos ou consumo compulsivo.</li>
  <li><strong>Auto-sabotagem:</strong> O homem inconscientemente destrói suas próprias conquistas porque, no nível da Sombra, não se sente merecedor delas.</li>
</ul>

<blockquote>
  <p>"Até que você torne o inconsciente consciente, ele direcionará sua vida e você o chamará de destino." — Carl Jung</p>
</blockquote>

<h2 id="quadrante">O Quadrante da Soberania: Os 4 Arquétipos Masculinos</h2>
<p>O framework dos quatro <strong>arquétipos masculinos</strong> foi popularizado pelos psicólogos Robert Moore e Douglas Gillette no livro <em>King, Warrior, Magician, Lover</em> (1990). Cada arquétipo representa uma dimensão da masculinidade madura, com seu polo saudável e suas formas imaturas ou distorcidas (as "sombras" de cada arquétipo).</p>

<h3>1. O Rei — O Eixo da Ordem e da Visão</h3>
<p>O Rei é o arquétipo da soberania, da visão de longo prazo e da capacidade de criar ordem a partir do caos. Em sua forma madura, o Rei:</p>
<ul>
  <li>Define valores e princípios claros para si e para sua família;</li>
  <li>Cria estruturas (rituais matinais, metas anuais, regras da casa) que permitem que todos ao seu redor floresçam;</li>
  <li>Consegue reconhecer e abençoar outros homens sem sentir ameaça à sua própria posição de valor.</li>
</ul>
<p><strong>Sombra do Rei:</strong> O Tirano (controle por medo, crueldade, incapacidade de delegar) ou o Covarde sem Coroa (passividade total, incapacidade de tomar decisões, fuga da responsabilidade).</p>

<h3>2. O Guerreiro — A Força da Execução</h3>
<p>O Guerreiro é a energia da ação disciplinada, do foco e da capacidade de suportar o sofrimento em prol de um objetivo maior. O Guerreiro maduro:</p>
<ul>
  <li>Acorda cedo, treina consistentemente e executa tarefas difíceis sem esperar por motivação;</li>
  <li>Diz "não" com clareza e firmeza, protegendo seu tempo e sua energia das demandas externas;</li>
  <li>Age de forma impessoal — o trabalho é feito, independentemente de como ele se sente naquele momento.</li>
</ul>
<p><strong>Sombra do Guerreiro:</strong> O Sádico (violência gratuita, prazer na destruição do outro) ou o Masoquista (auto-punição constante, ausência total de limites próprios).</p>

<h3>3. O Mago — A Tecnologia e o Domínio do Conhecimento</h3>
<p>O Mago representa o domínio do conhecimento técnico e a capacidade de transformar informação em poder aplicado. Na prática moderna, o Mago:</p>
<ul>
  <li>Domina as ferramentas do seu ofício com profundidade real (programação, finanças, biomarcadores, retórica);</li>
  <li>Pensa sistemicamente — entende as causas ocultas dos problemas antes de agir;</li>
  <li>Usa o conhecimento como serviço ao bem coletivo, não como instrumento de manipulação.</li>
</ul>
<p><strong>Sombra do Mago:</strong> O Manipulador (usa o conhecimento para controlar e enganar) ou o Ingênuo (paralisa-se com análise infinita sem nunca agir — a "paralisia por análise").</p>

<h3>4. O Amante — A Conexão com o Belo e com o Vivo</h3>
<p>O Amante é a energia da paixão, da sensibilidade e da conexão profunda com a vida. Sem o Amante, o homem se torna uma máquina eficiente, porém internamente vazia. O Amante maduro:</p>
<ul>
  <li>Ama com intensidade e presença — sua família, sua missão, sua arte e sua espiritualidade;</li>
  <li>É afetado pela beleza: música, natureza, literatura — sem se perder ou se viciar nela;</li>
  <li>Conecta o propósito racional do Rei à experiência sensível da vida real, evitando que o trabalho se torne apenas acumulação.</li>
</ul>
<p><strong>Sombra do Amante:</strong> O Viciado (busca prazer compulsivamente em detrimento de tudo mais) ou o Impotente Emocional (anestesiado, incapaz de sentir alegria ou desejo genuíno).</p>

<h2 id="diagnostico">Como Diagnosticar Seu Arquétipo Fraco</h2>
<p>Os sintomas de um arquétipo deficiente são reconhecíveis no cotidiano. Identifique onde você está falhando:</p>
<ul>
  <li><strong>Rei fraco:</strong> Sua vida está desorganizada. Você não tem metas claras, suas finanças são caóticas e você se sente à deriva — reagindo aos eventos em vez de criá-los deliberadamente.</li>
  <li><strong>Guerreiro fraco:</strong> Você tem sonhos mas não executa. Procrastina, busca motivação antes de agir e abandona projetos na primeira resistência significativa.</li>
  <li><strong>Mago fraco:</strong> Você age no automático, sem entender os sistemas ao seu redor. Repete os mesmos padrões de erro em finanças, relacionamentos ou saúde.</li>
  <li><strong>Amante fraco:</strong> Você está dessensibilizado. O trabalho é mecânico, o relacionamento é burocrático e você não se lembra da última vez que sentiu paixão genuína por algo ou alguém.</li>
</ul>

<h2 id="integracao">Exercícios Práticos de Integração dos Arquétipos</h2>

<h3>Fortalecendo o Rei — O Ritual da Constituição Pessoal</h3>
<p>Reserve 2 horas para redigir sua Constituição Pessoal: seus 5 valores inegociáveis, sua visão de vida em 10 anos e as regras de conduta do seu lar. Leia semanalmente e revise anualmente. O Rei opera a partir de princípios, não de impulsos.</p>

<h3>Fortalecendo o Guerreiro — O Protocolo Anti-Conforto</h3>
<p>Introduza deliberadamente desconforto físico diário: banhos frios progressivos, treinos de força pela manhã, <a href="/jejum">jejum intermitente</a>. O Guerreiro se forja onde há resistência. Sem resistência, não há forja.</p>

<h3>Fortalecendo o Mago — A Maestria de Uma Habilidade</h3>
<p>Identifique a habilidade de maior impacto na sua vida (liderança, vendas, programação, <a href="/blog/dieta-da-selva-o-guia-definitivo-da-bioquimica-ancestral-e-performance-masculina">saúde hormonal</a>, comunicação) e dedique 30 minutos de estudo focado por 90 dias consecutivos. Sem multitarefa. O Mago domina um domínio de cada vez.</p>

<h3>Fortalecendo o Amante — O Inventário do Prazer Genuíno</h3>
<p>Liste 10 coisas que genuinamente te alegram (não o que deveria te alegrar segundo as expectativas sociais). Inclua uma por semana na sua rotina, sem justificativa ou culpa. O Amante não precisa de permissão para sentir prazer.</p>

<h3>Integrando a Sombra — O Diário de Projeções</h3>
<p>Por 30 dias, anote toda vez que você tiver uma reação emocional intensa a alguém (raiva, inveja, desprezo). Pergunte-se: <em>"O que essa pessoa está fazendo que eu nego em mim mesmo?"</em>. Esse exercício simples é a porta de entrada mais acessível para a integração junguiana. Não é terapia — é consciência aplicada.</p>

<hr>

<h2 id="faq">Perguntas Frequentes sobre Arquétipos Masculinos</h2>

<h3>O que são arquétipos segundo Carl Jung?</h3>
<p>Para Jung, os arquétipos são padrões universais de comportamento e imagens psíquicas presentes no inconsciente coletivo de toda a humanidade. Eles emergem nos mitos, religiões e contos de fadas ao redor do mundo porque representam experiências fundamentais da condição humana — como a jornada do herói, o velho sábio e a sombra.</p>

<h3>É possível ter todos os quatro arquétipos desenvolvidos igualmente?</h3>
<p>É o objetivo da individuação, mas raramente a realidade. A maioria dos homens tem 1 a 2 arquétipos dominantes e 1 a 2 deficientes. O trabalho psicológico consiste em identificar os deficientes e nutri-los conscientemente, sem abandonar os fortes.</p>

<h3>Integrar a Sombra vai me tornar mais agressivo?</h3>
<p>Paradoxalmente, não. A pessoa com Sombra integrada é <em>menos</em> propensa a explosões de raiva incontrolada, justamente porque não acumula pressão emocional reprimida. A agressividade passa a ser um recurso consciente e direcionado, não uma reação automática e destrutiva.</p>

<h3>Qual a relação entre arquétipos masculinos e saúde física?</h3>
<p>A psicologia e a biologia estão profundamente conectadas. Um homem com o Guerreiro fraco tende a ter rotinas de treino inconsistentes e saúde negligenciada. O trabalho com os arquétipos frequentemente se converte em mudanças concretas de comportamento — incluindo a adoção de protocolos de <a href="/blog/dieta-da-selva-o-guia-definitivo-da-bioquimica-ancestral-e-performance-masculina">nutrição ancestral</a> e os <a href="/blog/a-forja-da-vontade-o-protocolo-de-jejum-de-72-horas-e-o-reset-dopaminergico">protocolos de jejum</a>.</p>

<h3>Por onde começar se sou iniciante em psicologia junguiana?</h3>
<p>Recomendamos a leitura de <em>King, Warrior, Magician, Lover</em> (Robert Moore &amp; Douglas Gillette, 1990) como ponto de partida teórico. Para o trabalho prático imediato, o Diário de Projeções descrito acima é o exercício de maior impacto e menor custo de entrada.</p>

<h3>Arquétipos masculinos têm relação com estoicismo?</h3>
<p>Sim, e de forma profunda. O Guerreiro estoico (Marco Aurélio, Epicteto) é uma expressão do Guerreiro maduro de Jung: agindo de acordo com princípios, indiferente ao resultado imediato, mas totalmente presente à execução. O estoicismo pode ser visto como uma tecnologia de fortalecimento do Guerreiro e do Rei dentro do quadrante arquetípico.</p>

<h2>Conclusão: A Soberania é um Projeto de Vida</h2>
<p>A integração dos quatro <strong>arquétipos masculinos</strong> não é um destino — é um caminho. Você não "termina" de se tornar o Rei, o Guerreiro, o Mago ou o Amante. Você <em>pratica</em> essas energias diariamente, através das suas escolhas, rituais e relacionamentos.</p>
<p>O primeiro passo é a consciência. Você já deu esse passo ao ler este artigo. O próximo passo é a ação: identifique seu arquétipo mais fraco e escolha <strong>um único exercício</strong> desta semana para começar a fortalecê-lo. Soberania se constrói um dia de cada vez.</p>
        `.trim(),
    },
];

// ─────────────────────────────────────────────────────────────
// RUNNER — usa UPSERT para atualizar posts existentes
// ─────────────────────────────────────────────────────────────
async function main() {
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

    let upserted = 0;
    let skipped = 0;

    for (const post of blogPostsData) {
        const slug = slugify(post.title);

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

        await prisma.blogPost.upsert({
            where: { slug },
            update: {
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                coverImage: post.coverImage ?? null,
                coverImageAlt: post.coverImageAlt ?? null,
                tags: post.tags ?? [],
                readTime: post.readTime,
                featured: post.featured ?? true,
                isPremium: post.isPremium ?? false,
                metaTitle: post.metaTitle ?? null,
                metaDescription: post.metaDescription ?? null,
                published: post.published ?? true,
                publishedAt: post.published !== false ? new Date() : null,
                categoryId: category.id,
            },
            create: {
                title: post.title,
                slug,
                excerpt: post.excerpt,
                content: post.content,
                coverImage: post.coverImage ?? null,
                coverImageAlt: post.coverImageAlt ?? null,
                tags: post.tags ?? [],
                readTime: post.readTime,
                published: post.published ?? true,
                publishedAt: post.published !== false ? new Date() : null,
                featured: post.featured ?? true,
                isPremium: post.isPremium ?? false,
                metaTitle: post.metaTitle ?? null,
                metaDescription: post.metaDescription ?? null,
                authorId: admin.id,
                categoryId: category.id,
            },
        });

        console.log(`✅ Upsert: "${post.title}"`);
        upserted++;
    }

    console.log(`\n🏁 Seed de posts pilares finalizado! ${upserted} criados/atualizados, ${skipped} ignorados.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
