import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BlogListClient } from './blog-list-client';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Conteúdos aprofundados sobre alimentação, treino e estilo de vida ancestral.',
};

export default function BlogPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="border-b border-border/40 bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl text-center space-y-4">
                            <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl">
                                Blog <span className="text-primary">Ancestral</span>
                            </h1>
                            <p className="text-lg text-muted-foreground md:text-xl">
                                Conhecimento sobre nutrição, jejum, treino e estilo de vida ancestral
                            </p>
                        </div>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="container px-4 md:px-6 py-12 md:py-16">
                    <div className="mx-auto max-w-7xl">
                        <BlogListClient />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
