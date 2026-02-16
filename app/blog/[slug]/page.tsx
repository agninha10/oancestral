import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArticleSchemaScript } from '@/lib/seo/article-schema';
import { ReadingProgressBar } from '@/components/content/reading-progress-bar';
import { NewsletterBox } from '@/components/newsletter/newsletter-box';
import { InlineCTA } from '@/components/newsletter/inline-cta';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug, published: true },
    });

    if (!post) {
        return {
            title: 'Post não encontrado',
        };
    }

    return {
        title: `${post.title} | Blog O Ancestral`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            images: post.coverImage ? [{ url: post.coverImage }] : [],
            publishedTime: post.publishedAt?.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            tags: post.tags,
        },
    };
}

const categoryLabels = {
    NUTRITION: 'Nutrição',
    FASTING: 'Jejum',
    TRAINING: 'Treino',
    MINDSET: 'Mindset',
    LIFESTYLE: 'Estilo de Vida',
    SCIENCE: 'Ciência',
    OTHER: 'Outros',
};

const categoryColors = {
    NUTRITION: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    FASTING: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    TRAINING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    MINDSET: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    LIFESTYLE: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    SCIENCE: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    OTHER: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
};

const normalizeContent = (rawContent: string) => {
    const trimmed = rawContent.trim();
    if (!trimmed) {
        return '';
    }

    const decodeHtml = (value: string) =>
        value
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&');

    // Check for HTML tags (either raw or encoded)
    const hasHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
    const hasEncodedHtml = /&lt;|&gt;/.test(trimmed);

    // If we have encoded HTML, decode it
    if (hasEncodedHtml && !hasHtml) {
        return decodeHtml(trimmed);
    }

    // If we have raw HTML, return as-is
    if (hasHtml) {
        return trimmed;
    }

    // Plain text - wrap in paragraphs
    const escaped = trimmed
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    return escaped
        .split(/\n\s*\n/)
        .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
        .join('');
};

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: {
            slug,
            published: true,
        },
        include: {
            author: {
                select: {
                    name: true,
                },
            },
            category: true,
        },
    });

    if (!post) {
        notFound();
    }

    const publishDate = post.publishedAt || post.createdAt;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://oancestral.com.br';

    // Fallback for color mapping based on simple hashing or default
    const getCategoryColor = (catName?: string) => {
        if (!catName) return categoryColors.OTHER;
        // Try to map based on common terms if needed, otherwise default
        // For now, simpler to just return a default or random from the set if we don't have exact mapping
        return categoryColors.OTHER;
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <ArticleSchemaScript post={post} baseUrl={baseUrl} />
            <ReadingProgressBar />

            <main className="flex-1">
                <article className="bg-background">
                    {/* Hero Section */}
                    <section className="relative h-[50vh] min-h-[400px] max-h-[500px] border-b border-border/40">
                        {post.coverImage ? (
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="container mx-auto max-w-4xl">
                                <div className="flex items-center gap-3 mb-4">
                                    {post.category && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors.OTHER}`}>
                                            {post.category.name}
                                        </span>
                                    )}
                                </div>

                                <h1 className="font-serif text-4xl font-bold md:text-5xl mb-4">
                                    {post.title}
                                </h1>

                                <p className="text-lg text-muted-foreground mb-6">
                                    {post.excerpt}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{post.author.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{format(publishDate, "d 'de' MMMM, yyyy", { locale: ptBR })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{post.readTime} min de leitura</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Content */}
                    <section className="container mx-auto max-w-4xl px-4 py-12">
                        {/* Article Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                            <div
                                className="leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: normalizeContent(post.content) }}
                            />
                        </div>

                        {/* Inline CTA */}
                        <InlineCTA />

                        {/* Tags */}
                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-12 pt-8 border-t border-border/40">
                                <span className="text-sm text-muted-foreground font-semibold">Tags:</span>
                                {post.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground border border-border"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Newsletter */}
                        <div className="mt-16">
                            <NewsletterBox
                                source="BLOG_FOOTER"
                                title="Gostou do artigo?"
                                description="Receba mais conteúdo sobre nutrição ancestral direto no seu email."
                            />
                        </div>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    );
}
