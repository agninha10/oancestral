import { Metadata } from 'next';
import JejumContent from './jejum-content';
import { JejumProductSchema } from '@/lib/seo/jejum-schema';

export const metadata: Metadata = {
    title: 'Protocolo Jejum Ancestral | Ative a Autofagia e Transforme Seu Corpo',
    description: 'Descubra o poder do jejum intermitente baseado no Prêmio Nobel de Medicina 2016. Aprenda a ativar a autofagia, queimar gordura e recuperar sua energia com o Protocolo Jejum Ancestral. E-book completo + Protocolos práticos + Receitas.',
    keywords: [
        'jejum intermitente',
        'autofagia',
        'jejum ancestral',
        'queima de gordura',
        'cetose',
        'Yoshinori Ohsumi',
        'Prêmio Nobel',
        'jejum 16/8',
        'jejum 24 horas',
        'jejum 72 horas',
        'desinflamar',
        'desinchar',
        'desintoxicar',
        'caldo de ossos',
        'dieta cetogênica',
        'protocolo de jejum',
        'nutrição ancestral'
    ],
    openGraph: {
        title: 'Liberte-se da Escravidão Alimentar | Protocolo Jejum Ancestral',
        description: 'A tecnologia biológica que a indústria escondeu de você. Baseado no Prêmio Nobel de Medicina 2016. Aprenda a ativar a autofagia e transforme seu corpo em 72 horas.',
        type: 'website',
        url: 'https://oancestral.com.br/jejum',
        siteName: 'O Ancestral',
        locale: 'pt_BR',
        images: [
            {
                url: '/images/jejum-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Protocolo Jejum Ancestral - Ative a Autofagia',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Protocolo Jejum Ancestral | Ative a Autofagia',
        description: 'Descubra o poder do jejum baseado no Nobel de Medicina. Desinchar, Desinflamar, Desintoxicar.',
        images: ['/images/jejum-og.jpg'],
    },
    alternates: {
        canonical: 'https://oancestral.com.br/jejum',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function JejumPage() {
    return (
        <>
            <JejumProductSchema price={97.90} priceCurrency="BRL" />
            <JejumContent />
        </>
    );
}
