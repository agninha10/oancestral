import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeatureCard } from "@/components/home/feature-card";
import { BlogCard } from "@/components/home/blog-card";
import {
  Utensils,
  Dumbbell,
  Clock3,
  Brain,
  BookOpen,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Utensils,
    title: "Receitas Ancestrais",
    description:
      "Centenas de receitas nutritivas e deliciosas, alinhadas com princípios ancestrais: carnívora, low carb, cetogênica e muito mais.",
  },
  {
    icon: Dumbbell,
    title: "Treinos Funcionais",
    description:
      "Programas de treino baseados em movimentos naturais do corpo humano, desenvolvidos para força, mobilidade e longevidade.",
  },
  {
    icon: Clock3,
    title: "Protocolos de Jejum",
    description:
      "Guias completos de jejum intermitente e prolongado, com acompanhamento e estratégias personalizadas para seus objetivos.",
  },
  {
    icon: Brain,
    title: "Saúde Mental",
    description:
      "Práticas ancestrais de meditação, respiração e mindfulness para equilibrar corpo e mente no mundo moderno.",
  },
  {
    icon: BookOpen,
    title: "Cursos Exclusivos",
    description:
      "Aprenda com especialistas através de cursos em vídeo, e-books e materiais didáticos de alta qualidade.",
  },
  {
    icon: Users,
    title: "Comunidade Ativa",
    description:
      "Conecte-se com milhares de pessoas na mesma jornada, compartilhe experiências e evolua junto com a comunidade.",
  },
];

const blogPosts = [
  {
    title: "Guia Completo da Dieta Carnívora: Benefícios e Como Começar",
    excerpt:
      "Descubra como a dieta carnívora pode transformar sua saúde, aumentar energia e melhorar composição corporal através da alimentação ancestral.",
    category: "Alimentação",
    readTime: "8 min",
    imageUrl: "/placeholder-blog-1.svg",
    slug: "guia-completo-dieta-carnivora",
  },
  {
    title: "Jejum Intermitente: Protocolos Práticos para Iniciantes",
    excerpt:
      "Aprenda os diferentes protocolos de jejum intermitente, seus benefícios científicos e como implementar de forma segura e eficaz.",
    category: "Jejum",
    readTime: "6 min",
    imageUrl: "/placeholder-blog-2.svg",
    slug: "jejum-intermitente-protocolos-praticos",
  },
  {
    title: "Treino Funcional em Casa: 5 Exercícios Essenciais",
    excerpt:
      "Desenvolva força e mobilidade com exercícios funcionais que você pode fazer em qualquer lugar, sem equipamentos caros.",
    category: "Treino",
    readTime: "5 min",
    imageUrl: "/placeholder-blog-3.svg",
    slug: "treino-funcional-casa-exercicios",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                Tudo que você precisa para{" "}
                <span className="text-primary">prosperar</span>
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
                Uma plataforma completa com ferramentas, conteúdos e comunidade
                para transformar seu estilo de vida.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Blog Highlights Section */}
        <section className="border-t border-border/40 bg-muted/30">
          <div className="container px-4 py-16 md:py-24">
            <div className="mx-auto max-w-6xl space-y-12">
              {/* Section Header */}
              <div className="flex items-end justify-between">
                <div className="space-y-4">
                  <h2 className="font-serif text-3xl font-bold md:text-4xl">
                    Últimos do Blog
                  </h2>
                  <p className="max-w-2xl text-muted-foreground md:text-lg">
                    Conteúdos aprofundados sobre alimentação, treino e estilo de
                    vida ancestral.
                  </p>
                </div>
                <Button asChild variant="outline" className="hidden md:flex">
                  <Link href="/blog">Ver todos os artigos</Link>
                </Button>
              </div>

              {/* Blog Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post) => (
                  <BlogCard key={post.slug} {...post} />
                ))}
              </div>

              <div className="flex md:hidden">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/blog">Ver todos os artigos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 md:p-12 lg:p-16">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

              <div className="relative space-y-6 text-center">
                <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                  Pronto para transformar sua vida?
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Junte-se a milhares de pessoas que já estão vivendo com mais
                  energia, saúde e vitalidade.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button asChild size="lg">
                    <Link href="/cadastro">Começar Grátis Agora</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/contato">Falar com Especialista</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
