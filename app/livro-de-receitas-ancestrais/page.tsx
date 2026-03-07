import type { Metadata } from "next";
import LivroContent from "./livro-content";

const OG_IMAGE = '/images/capa-livro-de-receitas.png';

export const metadata: Metadata = {
  title: "E-book: +100 Receitas Ancestrais | Dieta da Selva, Carnívora e Cetogênica",
  description:
    "Mais de 100 receitas focadas em carnes, órgãos e gorduras naturais para explodir seus níveis hormonais, derreter gordura e recuperar o vigor ancestral.",
  keywords: [
    "livro receitas ancestrais",
    "ebook receitas carnívoras",
    "receitas cetogênicas pdf",
    "dieta carnívora receitas",
    "manual cozinha ancestral",
    "receitas low carb download",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: '/livro-de-receitas-ancestrais' },
  openGraph: {
    title: "Manual da Cozinha Ancestral — +100 Receitas Carnívoras e Cetogênicas",
    description:
      "Desbloqueie sua biologia com receitas ancestrais de carnes, órgãos e gorduras naturais.",
    type: "website",
    url: "https://oancestral.com.br/livro-de-receitas-ancestrais",
    images: [{ url: OG_IMAGE, width: 800, height: 600, alt: "Manual da Cozinha Ancestral" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manual da Cozinha Ancestral — +100 Receitas Carnívoras e Cetogênicas",
    description:
      "Desbloqueie sua biologia com receitas ancestrais de carnes, órgãos e gorduras naturais.",
    images: [OG_IMAGE],
  },
};

export default function LivroPage() {
  return <LivroContent />;
}
