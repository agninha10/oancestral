import type { Metadata } from "next";
import LivroContent from "./livro-content";

export const metadata: Metadata = {
  title: "E-book: +100 Receitas Ancestrais | Dieta da Selva, Carnívora e Cetogênica",
  description:
    "Mais de 100 receitas focadas em carnes, órgãos e gorduras naturais para explodir seus níveis hormonais, derreter gordura e recuperar o vigor ancestral.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Manual da Cozinha Ancestral — +100 Receitas Carnívoras e Cetogênicas",
    description:
      "Desbloqueie sua biologia com receitas ancestrais de carnes, órgãos e gorduras naturais.",
    type: "website",
  },
};

export default function LivroPage() {
  return <LivroContent />;
}
