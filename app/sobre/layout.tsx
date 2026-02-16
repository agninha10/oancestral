import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre - O Manifesto",
  description:
    "Não é sobre voltar ao passado. É sobre sobreviver ao futuro. O Ancestral é o resgate da sua biologia original em um mundo artificial.",
  openGraph: {
    title: "Sobre O Ancestral - O Manifesto",
    description:
      "Declarando paz na guerra do mundo moderno contra nossa biologia. Nutrição real, corpo antifrágil, mente estoica e legado duradouro.",
    type: "website",
  },
};

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
