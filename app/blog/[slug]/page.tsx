import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArticleSchemaScript } from '@/lib/seo/article-schema';
import { ReadingProgressBar } from '@/components/content/reading-progress-bar';
import { NewsletterBox } from '@/components/newsletter/newsletter-box';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Suspense } from 'react';
import { RelatedContent, RelatedContentSkeleton } from '@/components/shared/related-content';
import { LivroPromoBanner } from '@/components/promo/livro-promo-banner';
import { JejumPromoBanner } from '@/components/promo/jejum-promo-banner';
import { MembershipPromoBanner } from '@/components/promo/membership-promo-banner';
import { ShareButtons } from '@/components/ui/share-buttons';
import { LeadMagnetModal } from '@/components/newsletter/lead-magnet-modal';

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

    const ogImage = post.coverImage ?? '/images/og-blog.png';

    return {
        title: post.title,  // template → "Título do Post | O Ancestral"
        description: post.excerpt,
        alternates: { canonical: `/blog/${slug}` },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            url: `https://oancestral.com.br/blog/${slug}`,
            images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
            publishedTime: post.publishedAt?.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [ogImage],
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
    const content = rawContent.trim();
    if (!content) return '';

    // If the content looks like HTML (from Tiptap editor), return as-is
    if (/<\/?[a-z][\s\S]*>/i.test(content)) {
        return content;
    }

    // Plain text fallback - wrap paragraphs
    return content
        .split(/\n\s*\n/)
        .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
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

    // Resolve qual banner de oferta exibir
    const resolveOffer = (): 'LIVRO' | 'JEJUM' | 'MEMBERSHIP' | 'NONE' => {
        if (post.offerBanner === 'AUTO') {
            // Detecção automática pela categoria/tags (comportamento legado)
            const fastingKeywords = ['jejum', 'fasting', 'jejum-intermitente', 'intermittent-fasting'];
            const isFasting =
                post.category?.slug === 'FASTING' ||
                post.tags.some((tag: string) =>
                    fastingKeywords.some((kw) => tag.toLowerCase().includes(kw))
                );
            return isFasting ? 'JEJUM' : 'LIVRO';
        }
        return post.offerBanner as 'LIVRO' | 'JEJUM' | 'MEMBERSHIP' | 'NONE';
    };
    const offerBanner = resolveOffer();

    return (
        <div className="flex min-h-screen flex-col">
            <LeadMagnetModal />
            <Header />
            <ArticleSchemaScript post={post} baseUrl={baseUrl} />
            <ReadingProgressBar />

            <main className="flex-1">
                <article className="bg-background">
                    {/* Cover Image */}
                    {post.coverImage && (
                        <div className="relative w-full h-[55vh] min-h-[360px] max-h-[560px]">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Header */}
                    <section className="container mx-auto max-w-4xl px-4 pt-10 pb-6 border-b border-border/40">
                        <div className="flex items-center gap-3 mb-5">
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

                        {/* Share — topo do post */}
                        <div className="mt-6 pt-6 border-t border-border/40">
                            <ShareButtons title={post.title} description={post.excerpt} />
                        </div>
                    </section>

                    {/* Content */}
                    <section className="container mx-auto max-w-4xl px-4 py-12">
                        {/* Article Content */}
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: normalizeContent(post.content) }}
                        />

                        {/* Oferta contextual — controlada pelo admin */}
                        {offerBanner !== 'NONE' && (
                            <div className="my-10">
                                {offerBanner === 'JEJUM'      && <JejumPromoBanner      variant="inline" />}
                                {offerBanner === 'LIVRO'      && <LivroPromoBanner      variant="inline" />}
                                {offerBanner === 'MEMBERSHIP' && <MembershipPromoBanner variant="inline" />}
                            </div>
                        )}

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

                        {/* Share — rodapé do post (pós-leitura, maior conversão) */}
                        <div className="mt-12 pt-8 border-t border-border/40">
                            <p className="text-base font-semibold text-foreground mb-4">
                                Gostou? Compartilhe com alguém que precisa disso 👇
                            </p>
                            <ShareButtons title={post.title} description={post.excerpt} />
                        </div>

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

            <Suspense fallback={<RelatedContentSkeleton />}>
                <RelatedContent
                    currentId={post.id}
                    category={post.categoryId ?? ''}
                    type="post"
                />
            </Suspense>

            <Footer />
        </div>
    );
}
