import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clã Ancestral | O Ancestral',
  description:
    'Entre para o Clã Ancestral e tenha acesso ilimitado a receitas, cursos, protocolos de jejum e muito mais.',
  alternates: {
    canonical: '/cla-ancestral',
  },
};

export default function ClaAncestralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
