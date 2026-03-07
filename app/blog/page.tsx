import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BlogListClient } from './blog-list-client';

const OG_IMAGE = '/images/og-blog.png';

export const metadata: Metadata = {
    // Usa o template do layout → "Blog Ancestral | O Ancestral"
    title: 'Blog Ancestral',
    description:
        'Artigos aprofundados sobre alimentação ancestral, jejum intermitente, treino e longevidade. Ciência aplicada ao estilo de vida que a evolução moldou.',
    keywords: [
        'blog ancestral',
        'alimentação ancestral',
        'jejum intermitente',
        'dieta carnívora',
        'longevidade',
        'saúde ancestral',
        'nutrição real',
        'low carb ciência',
    ],
    alternates: { canonical: '/blog' },
    openGraph: {
        title: 'Blog Ancestral | O Ancestral',
        description:
            'Artigos aprofundados sobre alimentação ancestral, jejum intermitente, treino e longevidade.',
        type: 'website',
        url: 'https://oancestral.com.br/blog',
        images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Blog Ancestral — O Ancestral' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog Ancestral | O Ancestral',
        description:
            'Artigos aprofundados sobre alimentação ancestral, jejum intermitente, treino e longevidade.',
        images: [OG_IMAGE],
    },
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
