import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Assinatura | O Ancestral',
    description: 'Assine o plano O Ancestral e tenha acesso ilimitado a receitas, cursos, protocolos de jejum e muito mais.',
    alternates: {
        canonical: '/assinatura',
    },
};

export default function AssinaturaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
