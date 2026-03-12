import Script from 'next/script';

interface JejumSchemaProps {
  price: number;
  priceCurrency: string;
}

export function JejumProductSchema({ price, priceCurrency }: JejumSchemaProps) {
  const BASE_URL = 'https://oancestral.com.br';
  const PAGE_URL = `${BASE_URL}/jejum`;
  const IMAGE_URL = `${BASE_URL}/images/jejum-og.jpg`;
  const DATE_PUBLISHED = '2024-01-15';
  const DATE_MODIFIED = new Date().toISOString().split('T')[0];

  // ── 1. PRODUCT + BOOK (ebook) ────────────────────────────────────────────
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Book'],
    '@id': `${PAGE_URL}#product`,
    name: 'Guia Definitivo do Jejum Intermitente',
    alternateName: [
      'Protocolo Jejum Ancestral',
      'Ebook Jejum Intermitente',
      'Guia de Autofagia e Jejum',
    ],
    description:
      'Guia completo e definitivo sobre jejum intermitente baseado no Prêmio Nobel de Medicina 2016. Inclui protocolos passo a passo (12/12, 16/8, 24h, 48h, 72h+), guia de alimentação ancestral, receitas cetogênicas e bônus sobre dieta cetogênica. Aprenda a ativar a autofagia, queimar gordura e recuperar energia com ciência e prática.',
    image: [IMAGE_URL],
    url: PAGE_URL,
    bookFormat: 'https://schema.org/EBook',
    inLanguage: 'pt-BR',
    numberOfPages: 120,
    isbn: '',
    author: {
      '@type': 'Organization',
      '@id': `${BASE_URL}#organization`,
      name: 'O Ancestral',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}#organization`,
      name: 'O Ancestral',
      url: BASE_URL,
    },
    datePublished: DATE_PUBLISHED,
    dateModified: DATE_MODIFIED,
    brand: {
      '@type': 'Brand',
      name: 'O Ancestral',
    },
    category: 'Saúde e Bem-Estar > Nutrição > Jejum Intermitente',
    keywords:
      'jejum intermitente, autofagia, jejum 16/8, queima de gordura, cetose, dieta ancestral, Yoshinori Ohsumi, Prêmio Nobel Medicina, protocolo jejum, desinchar, desinflamar, desintoxicar',
    offers: {
      '@type': 'Offer',
      '@id': `${PAGE_URL}#offer`,
      url: PAGE_URL,
      priceCurrency: priceCurrency,
      price: price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      deliveryLeadTime: {
        '@type': 'QuantitativeValue',
        minValue: 0,
        maxValue: 0,
        unitCode: 'MIN',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'BR',
        returnPolicyCategory:
          'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'BRL',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'BR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'MIN',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'MIN',
          },
        },
      },
      seller: {
        '@type': 'Organization',
        name: 'O Ancestral',
        url: BASE_URL,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '3200',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Person', name: 'Mariana S.' },
        reviewBody:
          'Perdi 6kg em 3 semanas sem sofrimento. O protocolo 16/8 mudou minha relação com a comida. O guia explica tudo de um jeito simples e sem enrolação.',
        datePublished: '2025-01-10',
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Person', name: 'Roberto L.' },
        reviewBody:
          'Tinha tentado de tudo. Dieta, academia, suplementos. O jejum foi a única coisa que realmente funcionou. Menos inchaço, mais energia e clareza mental absurda.',
        datePublished: '2025-02-03',
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Person', name: 'Fernanda T.' },
        reviewBody:
          'Comprei com desconfiança. Me arrependo de não ter comprado antes. Os protocolos são muito bem explicados e as receitas são deliciosas.',
        datePublished: '2025-01-28',
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: {
          '@type': 'Person',
          name: 'Carlos M.',
          jobTitle: 'Médico',
        },
        reviewBody:
          'Sou médico e fiquei impressionado com a qualidade científica do conteúdo. A parte da autofagia está impecável. Recomendo para meus pacientes.',
        datePublished: '2025-02-15',
      },
    ],
    about: [
      { '@type': 'Thing', name: 'Jejum Intermitente', sameAs: 'https://pt.wikipedia.org/wiki/Jejum_intermitente' },
      { '@type': 'Thing', name: 'Autofagia', sameAs: 'https://pt.wikipedia.org/wiki/Autofagia' },
      { '@type': 'Person', name: 'Yoshinori Ohsumi', sameAs: 'https://pt.wikipedia.org/wiki/Yoshinori_Ohsumi' },
      { '@type': 'Thing', name: 'Cetose', sameAs: 'https://pt.wikipedia.org/wiki/Cetose' },
      { '@type': 'Thing', name: 'Dieta Cetogênica', sameAs: 'https://pt.wikipedia.org/wiki/Dieta_cetog%C3%AAnica' },
      { '@type': 'Award', name: 'Prêmio Nobel de Fisiologia ou Medicina 2016' },
    ],
  };

  // ── 2. HOWTO — Protocolo de Jejum Passo a Passo ─────────────────────────
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${PAGE_URL}#howto`,
    name: 'Como Fazer Jejum Intermitente 16/8 para Iniciantes',
    description:
      'Guia passo a passo para iniciar o jejum intermitente 16/8 com segurança, ativar a queima de gordura e preparar o corpo para a autofagia.',
    image: IMAGE_URL,
    totalTime: 'P1D',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'BRL', value: '0' },
    tool: [
      { '@type': 'HowToTool', name: 'Água' },
      { '@type': 'HowToTool', name: 'Café ou chá sem açúcar (opcional)' },
      { '@type': 'HowToTool', name: 'Eletrólitos (para iniciantes)' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: 'Escolha sua janela alimentar de 8 horas',
        text: 'Defina um horário de 8 horas para se alimentar. Exemplo: coma das 12h às 20h e jejue das 20h às 12h do dia seguinte. Mantenha o mesmo horário todos os dias para o corpo se adaptar.',
        url: `${PAGE_URL}#protocolo-16-8`,
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Faça a última refeição do dia (jantar ancestral)',
        text: 'Priorize proteínas e gorduras saudáveis na última refeição: ovos, carnes, peixes, abacate e vegetais não amiláceos. Evite carboidratos simples para facilitar a entrada em cetose durante o jejum.',
        url: `${PAGE_URL}#alimentacao`,
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Durma — seu corpo trabalha enquanto você descansa',
        text: 'Boa parte do jejum acontece durante o sono. A privação alimentar noturna acelera a queda de insulina e prepara o metabolismo para a queima de gordura nas próximas horas.',
        position: 3,
      },
      {
        '@type': 'HowToStep',
        name: 'Quebre o jejum com o Caldo de Ossos',
        text: 'Após as 16 horas, quebre o jejum com caldo de ossos morno. Ele é rico em colágeno, minerais e aminoácidos que ativam gentilmente os processos digestivos sem disparar pico de insulina.',
        url: `${PAGE_URL}#quebra-de-jejum`,
        position: 4,
      },
      {
        '@type': 'HowToStep',
        name: 'Hidrate-se com eletrólitos durante o jejum',
        text: 'Consuma água pura, água com sal rosa do Himalaia, chá verde ou café preto sem açúcar. Eles mantêm o equilíbrio eletrolítico sem quebrar o jejum.',
        position: 5,
      },
      {
        '@type': 'HowToStep',
        name: 'Avance gradualmente para protocolos mais longos',
        text: 'Após 2–4 semanas com 16/8, experimente jejuns de 24 horas (OMAD) para ativar a autofagia. O guia completo ensina como progredir com segurança até os protocolos de 48h e 72h.',
        url: `${PAGE_URL}#protocolos-avancados`,
        position: 6,
      },
    ],
  };

  // ── 3. FAQPAGE — Todas as 6 perguntas da página ─────────────────────────
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${PAGE_URL}#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Preciso ter experiência com jejum para comprar o guia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Não. O guia começa do absoluto zero, com o protocolo 12/12 — ideal para quem nunca jejuou — e evolui gradualmente até protocolos de 72 horas. Você avança no seu próprio ritmo.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jejum intermitente é seguro? Vou passar mal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Para a maioria das pessoas saudáveis, o jejum intermitente é seguro. O guia ensina como fazer com segurança, os sinais de alerta para ficar atento e quem deve consultar um médico antes de iniciar. Grávidas, lactantes e pessoas com certas condições médicas devem consultar um profissional de saúde.',
        },
      },
      {
        '@type': 'Question',
        name: 'Vou ficar com fome o tempo todo durante o jejum?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nas primeiras 1–2 semanas pode haver adaptação metabólica. O guia inclui estratégias específicas para controlar a fome, lista de bebidas que podem ser consumidas sem quebrar o jejum e técnicas para reduzir o desconforto inicial.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como recebo o ebook após a compra?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O acesso é imediato. Após a confirmação do pagamento pelo AbacatePay, você recebe automaticamente o link de download por e-mail em menos de 1 minuto. Funciona em celular, tablet e computador.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jejum intermitente funciona para quem tem hipotireoidismo ou diabetes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O guia aborda condições específicas e orienta sobre os protocolos mais adequados para cada situação. Para doenças crônicas como hipotireoidismo, diabetes tipo 1 ou uso de medicamentos que exigem alimentação, é fundamental consultar o médico antes de iniciar qualquer protocolo de jejum.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qual é a garantia do ebook de jejum intermitente?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Garantia incondicional de 7 dias. Se por qualquer motivo você não ficar satisfeito com o guia, basta enviar um e-mail e devolvemos 100% do valor pago. Sem perguntas, sem burocracia.',
        },
      },
      {
        '@type': 'Question',
        name: 'O que é autofagia e por que ela é importante?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Autofagia é o processo de reciclagem celular descoberto pelo biólogo japonês Yoshinori Ohsumi, que recebeu o Prêmio Nobel de Fisiologia ou Medicina em 2016 por esse trabalho. Durante a autofagia, as células destroem e reciclam componentes danificados ou desnecessários. Esse processo é ativado pelo jejum prolongado (geralmente após 24–36 horas) e está associado à prevenção de doenças, ao retardamento do envelhecimento e à melhora da função imunológica.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quanto tempo leva para entrar em cetose com o jejum?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A cetose leve começa geralmente entre 12 e 18 horas de jejum, quando os estoques de glicogênio hepático se esgotam e o fígado começa a produzir corpos cetônicos a partir da gordura. Com a combinação de jejum + dieta low carb ou cetogênica, esse processo pode ser acelerado para 8–12 horas.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qual a diferença entre jejum 16/8 e OMAD?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O jejum 16/8 consiste em 16 horas de jejum e uma janela alimentar de 8 horas, durante a qual você faz 2–3 refeições. O OMAD (One Meal A Day) é um jejum de 23/1: você come apenas uma refeição por dia. O 16/8 é mais indicado para iniciantes; o OMAD é um protocolo avançado que maximiza a autofagia e a queima de gordura.',
        },
      },
    ],
  };

  // ── 4. BREADCRUMBLIST ───────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${PAGE_URL}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Jejum Intermitente',
        item: PAGE_URL,
      },
    ],
  };

  // ── 5. WEBPAGE com Speakable (GEO + Voice Search) ───────────────────────
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: 'Guia Definitivo do Jejum Intermitente | Ative a Autofagia',
    description:
      'Guia completo sobre jejum intermitente: aprenda a ativar a autofagia (Nobel 2016), queimar gordura com protocolos 16/8, 24h, 48h e 72h+, e transformar sua saúde.',
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${BASE_URL}#website` },
    datePublished: DATE_PUBLISHED,
    dateModified: new Date().toISOString(),
    breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
    mainEntity: { '@id': `${PAGE_URL}#product` },
    potentialAction: {
      '@type': 'ReadAction',
      target: [PAGE_URL],
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '[data-speakable]'],
    },
    about: [
      { '@type': 'Thing', name: 'Jejum Intermitente' },
      { '@type': 'Thing', name: 'Autofagia' },
      { '@type': 'Thing', name: 'Cetose' },
      { '@type': 'Thing', name: 'Queima de Gordura' },
      { '@type': 'Thing', name: 'Dieta Ancestral' },
    ],
    mentions: [
      {
        '@type': 'Person',
        name: 'Yoshinori Ohsumi',
        sameAs: 'https://pt.wikipedia.org/wiki/Yoshinori_Ohsumi',
        description: 'Biólogo celular japonês, ganhador do Prêmio Nobel de Fisiologia ou Medicina de 2016 pela descoberta dos mecanismos da autofagia.',
      },
      {
        '@type': 'Award',
        name: 'Prêmio Nobel de Fisiologia ou Medicina 2016',
        sameAs: 'https://pt.wikipedia.org/wiki/Pr%C3%AAmio_Nobel_de_Fisiologia_ou_Medicina',
      },
    ],
  };

  // ── 6. ORGANIZATION ──────────────────────────────────────────────────────
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}#organization`,
    name: 'O Ancestral',
    url: BASE_URL,
    logo: `${BASE_URL}/favcon.png`,
    sameAs: [BASE_URL],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: 'Portuguese',
    },
  };

  // ── 7. WEBSITE ────────────────────────────────────────────────────────────
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}#website`,
    url: BASE_URL,
    name: 'O Ancestral',
    description: 'Plataforma de estilo de vida ancestral: jejum, nutrição, receitas e protocolos de saúde baseados em ciência e tradição.',
    inLanguage: 'pt-BR',
    publisher: { '@id': `${BASE_URL}#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/blog?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <Script id="schema-product" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Script id="schema-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="schema-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="schema-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="schema-webpage" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <Script id="schema-organization" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Script id="schema-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  );
}
