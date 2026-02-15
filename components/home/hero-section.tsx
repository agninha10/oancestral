import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />

            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container relative px-4 py-24 md:py-32 lg:py-40">
                <div className="mx-auto max-w-4xl text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                        <Sparkles className="h-4 w-4" />
                        <span>Transforme sua saúde com sabedoria ancestral</span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        Viva como seus{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            ancestrais
                        </span>
                        , prospere no mundo moderno
                    </h1>

                    {/* Subheadline */}
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                        Descubra o poder da alimentação ancestral, jejum intermitente e
                        treinos funcionais. Uma plataforma completa para transformar seu
                        corpo e mente.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button asChild size="lg" className="w-full sm:w-auto group">
                            <Link href="/cadastro">
                                Começar Grátis
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            <Link href="/sobre">Saiba Mais</Link>
                        </Button>
                    </div>

                    {/* Social Proof */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent"
                                    />
                                ))}
                            </div>
                            <span>+5.000 membros ativos</span>
                        </div>
                        <div className="hidden sm:block h-4 w-px bg-border" />
                        <div>⭐⭐⭐⭐⭐ 4.9/5 de avaliação</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
