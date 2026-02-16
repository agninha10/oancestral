import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeatureCard } from "@/components/home/feature-card";
import { BlogCard } from "@/components/home/blog-card";
import { RecipeCard } from "@/components/recipe/recipe-card";
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
import { prisma } from "@/lib/prisma";

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

export default async function HomePage() {
  // Fetch latest recipes from database
  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  // Fetch latest blog posts from database
  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  });

  // Transform recipes data for RecipeCard component
  const recipesForDisplay = recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    slug: recipe.slug,
    description: recipe.description,
    coverImage: recipe.coverImage,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    category: recipe.category?.slug || 'OTHER',
  }));

  // Transform blog posts data for BlogCard component
  const blogPostsForDisplay = blogPosts.map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    category: post.category?.name || 'Nutrição',
    readTime: `${post.readTime} min`,
    imageUrl: post.coverImage || '/placeholder-blog-1.svg',
    slug: post.slug,
  }));

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

        {/* Featured Recipes Section */}
        {recipesForDisplay.length > 0 && (
          <section className="border-t border-border/40 bg-accent/5">
            <div className="container px-4 py-16 md:py-24">
              <div className="mx-auto max-w-6xl space-y-12">
                {/* Section Header */}
                <div className="flex items-end justify-between">
                  <div className="space-y-4">
                    <h2 className="font-serif text-3xl font-bold md:text-4xl">
                      Nutrição Ancestral
                    </h2>
                    <p className="max-w-2xl text-muted-foreground md:text-lg">
                      Receitas densas em nutrientes para alimentar seu corpo e mente.
                    </p>
                  </div>
                  <Button asChild variant="outline" className="hidden md:flex">
                    <Link href="/receitas">Ver todas as receitas</Link>
                  </Button>
                </div>

                {/* Recipes Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {recipesForDisplay.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                    />
                  ))}
                </div>

                <div className="flex md:hidden">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/receitas">Ver todas as receitas</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Highlights Section */}
        {blogPostsForDisplay.length > 0 && (
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
                  {blogPostsForDisplay.map((post) => (
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
        )}

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
