import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Home, Search, BookOpen, Utensils, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 number */}
          <div className="relative mb-8">
            <span className="text-[10rem] md:text-[14rem] font-serif font-bold leading-none text-amber-500/10 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Search className="h-9 w-9 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Página não encontrada
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
            Parece que essa trilha ancestral ainda não foi desbravada. 
            A página que você procura não existe ou foi movida.
          </p>

          {/* Primary action */}
          <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl px-8 py-6 text-base mb-10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Link>
          </Button>

          {/* Quick links */}
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-5 uppercase tracking-wider font-semibold">
              Ou explore nosso conteúdo
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" asChild className="rounded-xl border-border hover:border-amber-500/40 hover:bg-amber-500/5">
                <Link href="/receitas">
                  <Utensils className="h-4 w-4 mr-2 text-amber-500" />
                  Receitas
                </Link>
              </Button>
              <Button variant="outline" asChild className="rounded-xl border-border hover:border-amber-500/40 hover:bg-amber-500/5">
                <Link href="/blog">
                  <BookOpen className="h-4 w-4 mr-2 text-amber-500" />
                  Blog
                </Link>
              </Button>
              <Button variant="outline" asChild className="rounded-xl border-border hover:border-amber-500/40 hover:bg-amber-500/5">
                <Link href="/cursos">
                  <Home className="h-4 w-4 mr-2 text-amber-500" />
                  Cursos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
