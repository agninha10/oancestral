import Script from 'next/script';

interface JejumSchemaProps {
  price: number;
  priceCurrency: string;
}

export function JejumProductSchema({ price, priceCurrency }: JejumSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Protocolo Jejum Ancestral',
    description: 'E-book completo + Protocolos práticos + Receitas + Bônus Cetogênico. Aprenda a ativar a autofagia e transformar seu corpo baseado no Prêmio Nobel de Medicina 2016.',
    image: 'https://oancestral.com.br/images/jejum-og.jpg',
    brand: {
      '@type': 'Brand',
      name: 'O Ancestral'
    },
    offers: {
      '@type': 'Offer',
      url: 'https://oancestral.com.br/jejum',
      priceCurrency: priceCurrency,
      price: price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'O Ancestral'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127'
    }
  };

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Protocolo Jejum Ancestral',
    description: 'Aprenda jejum intermitente e autofagia baseado no Prêmio Nobel de Medicina. Protocolos passo a passo do 12/12 ao 72h+.',
    provider: {
      '@type': 'Organization',
      name: 'O Ancestral',
      sameAs: 'https://oancestral.com.br'
    },
    educationalLevel: 'Beginner to Advanced',
    about: [
      {
        '@type': 'Thing',
        name: 'Jejum Intermitente'
      },
      {
        '@type': 'Thing',
        name: 'Autofagia'
      },
      {
        '@type': 'Thing',
        name: 'Nutrição Ancestral'
      }
    ],
    teaches: [
      'Como ativar a autofagia naturalmente',
      'Protocolos de jejum do iniciante ao avançado',
      'Queima de gordura através do jejum',
      'Alimentação cetogênica e jejum'
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'O que é autofagia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Autofagia é o processo de reciclagem celular descoberto por Yoshinori Ohsumi, que ganhou o Prêmio Nobel de Medicina em 2016. Durante o jejum, suas células começam a "limpar" componentes danificados, promovendo regeneração e longevidade.'
        }
      },
      {
        '@type': 'Question',
        name: 'Quanto tempo de jejum para ativar a autofagia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A autofagia começa a ser ativada significativamente após 24-36 horas de jejum, mas benefícios relacionados à queima de gordura e cetose começam já nas primeiras 12-16 horas.'
        }
      },
      {
        '@type': 'Question',
        name: 'Jejum intermitente é seguro?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, o jejum intermitente é uma prática ancestral segura para a maioria das pessoas saudáveis. Nosso protocolo ensina como começar gradualmente, do 12/12 até protocolos mais avançados.'
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="jejum-product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id="jejum-course-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <Script
        id="jejum-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
