import { Metadata } from 'next';
import JejumContent from './jejum-content';
import { JejumProductSchema } from '@/lib/seo/jejum-schema';

const BASE_URL = 'https://oancestral.com.br';

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),

    // ── TITLE ────────────────────────────────────────────────────────────────
    // Primária keyword no início; marca no final para CTR no SERP
    title: 'Jejum Intermitente: Guia Definitivo para Ativar a Autofagia | O Ancestral',

    // ── DESCRIPTION ──────────────────────────────────────────────────────────
    // 155 caracteres. Inclui keyword + benefício + CTA implícito.
    description:
        'Aprenda jejum intermitente com o guia baseado no Prêmio Nobel de Medicina 2016. Protocolos 16/8, 24h e 72h+ para ativar autofagia, queimar gordura e desinchar. Ebook com acesso imediato.',

    // ── KEYWORDS (long-tail e alta intenção) ────────────────────────────────
    keywords: [
        // Termos de alto volume
        'jejum intermitente',
        'jejum intermitente como fazer',
        'jejum intermitente para iniciantes',
        'jejum intermitente emagrecer',
        'jejum intermitente resultados',
        'jejum intermitente cardápio',
        'jejum intermitente 16 8',
        'jejum intermitente 18 6',
        'jejum intermitente 24 horas',
        'jejum intermitente 72 horas',
        'jejum intermitente OMAD',
        'jejum prolongado',

        // Autofagia (entity cluster)
        'autofagia',
        'autofagia jejum',
        'como ativar autofagia',
        'autofagia Nobel',
        'Yoshinori Ohsumi autofagia',
        'Nobel de Medicina 2016',
        'autofagia benefícios',
        'limpeza celular jejum',

        // Benefícios (intenção informacional)
        'como desinchar rápido',
        'como desinflamar o corpo',
        'como desintoxicar o organismo',
        'queima de gordura jejum',
        'perder peso jejum intermitente',
        'emagrecer sem academia',
        'hormônio do crescimento jejum',
        'cetose jejum',
        'cetose como entrar',
        'cetonas jejum benefícios',

        // Dúvidas comuns (intenção de pergunta — GEO)
        'o que posso beber no jejum',
        'o que comer antes do jejum',
        'como quebrar o jejum',
        'caldo de ossos jejum',
        'jejum faz mal',
        'jejum seguro',
        'quanto tempo jejum para autofagia',

        // Dietas correlatas (cluster topical)
        'dieta ancestral',
        'dieta cetogênica e jejum',
        'low carb e jejum',
        'dieta carnívora jejum',
        'nutrição ancestral',
        'alimentação ancestral',

        // Condições de saúde (intenção de pesquisa)
        'jejum intermitente hipotireoidismo',
        'jejum intermitente diabetes',
        'jejum inflamação',
        'jejum sistema imune',
        'jejum e envelhecimento',
        'rejuvenescimento celular',

        // Produto
        'ebook jejum intermitente',
        'guia jejum intermitente pdf',
        'protocolo jejum ancestral',
        'curso jejum online',
    ],

    // ── AUTHORS / CREATOR ────────────────────────────────────────────────────
    authors: [{ name: 'O Ancestral', url: BASE_URL }],
    creator: 'O Ancestral',
    publisher: 'O Ancestral',

    // ── CANONICAL ────────────────────────────────────────────────────────────
    alternates: {
        canonical: '/jejum',
        languages: {
            'pt-BR': '/jejum',
        },
    },

    // ── OPEN GRAPH (Social + AI crawlers) ───────────────────────────────────
    openGraph: {
        title: 'Guia Definitivo do Jejum Intermitente — Ative a Autofagia e Queime Gordura',
        description:
            'O guia completo baseado no Prêmio Nobel de Medicina 2016. Protocolos 16/8, 24h, 48h e 72h+. Aprenda a ativar a autofagia, desinchar e recuperar sua energia.',
        type: 'website',
        url: `${BASE_URL}/jejum`,
        siteName: 'O Ancestral',
        locale: 'pt_BR',
        images: [
            {
                // Foto real de transformação — −25 kg em 90 dias
                url: `${BASE_URL}/images/fotos-antes-e-depois/depois.jpeg`,
                alt: 'Resultado real: −25 kg em 90 dias com jejum intermitente e dieta ancestral',
                type: 'image/jpeg',
            },
        ],
    },

    // ── TWITTER CARD ─────────────────────────────────────────────────────────
    twitter: {
        card: 'summary_large_image',
        site: '@oancestral',
        creator: '@oancestral',
        title: 'Guia Definitivo do Jejum Intermitente | Autofagia + 16/8 + 72h+',
        description:
            'Baseado no Nobel de Medicina 2016. Protocolos práticos para ativar autofagia, queimar gordura e desinchar. Ebook com acesso imediato.',
        images: {
            url: `${BASE_URL}/images/fotos-antes-e-depois/depois.jpeg`,
            alt: 'Resultado real: −25 kg em 90 dias com jejum intermitente',
        },
    },

    // ── ROBOTS ───────────────────────────────────────────────────────────────
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            // -1 = sem limite de snippet → mais espaço no SERP
            'max-snippet': -1,
        },
    },

    // ── CATEGORIA / CLASSIFICAÇÃO ─────────────────────────────────────────
    category: 'Saúde, Nutrição e Jejum Intermitente',

    // ── VERIFICAÇÃO ───────────────────────────────────────────────────────
    // Cole o código real do Google Search Console quando disponível:
    // verification: { google: 'SEU_CODIGO_AQUI' },
};

export default function JejumPage() {
    return (
        <>
            <JejumProductSchema price={29.90} priceCurrency="BRL" />
            <JejumContent />
        </>
    );
}
