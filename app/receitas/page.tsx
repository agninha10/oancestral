import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RecipeListClient } from './recipe-list-client';

const OG_IMAGE = '/images/og-receitas.png';

export const metadata: Metadata = {
    // Usa o template do layout → "Receitas Ancestrais | O Ancestral"
    title: 'Receitas Ancestrais',
    description:
        'Mais de 100 receitas baseadas em alimentos reais: carnívora, low-carb, cetogênica e paleo. Sem ultra-processados, sem inflamação — com sabor de verdade.',
    keywords: [
        'receitas ancestrais',
        'receitas low carb',
        'receitas carnívoras',
        'receitas cetogênicas',
        'receitas paleo',
        'receitas sem glúten',
        'receitas sem ultra-processados',
        'dieta ancestral receitas',
    ],
    alternates: { canonical: '/receitas' },
    openGraph: {
        title: 'Receitas Ancestrais | O Ancestral',
        description:
            'Mais de 100 receitas baseadas em alimentos reais: carnívora, low-carb, cetogênica e paleo. Sem ultra-processados, sem inflamação.',
        type: 'website',
        url: 'https://oancestral.com.br/receitas',
        images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Receitas Ancestrais — O Ancestral' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Receitas Ancestrais | O Ancestral',
        description:
            'Mais de 100 receitas baseadas em alimentos reais: carnívora, low-carb, cetogênica e paleo.',
        images: [OG_IMAGE],
    },
};

export default function ReceitasPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="border-b border-border/40 bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl text-center space-y-4">
                            <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl">
                                Receitas <span className="text-primary">Ancestrais</span>
                            </h1>
                            <p className="text-lg text-muted-foreground md:text-xl">
                                Nutrição de verdade, baseada em alimentos reais e princípios ancestrais
                            </p>
                        </div>
                    </div>
                </section>

                {/* Recipes Grid */}
                <section className="container px-4 md:px-6 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl">
                        <RecipeListClient />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
