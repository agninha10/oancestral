import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Eye, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPostDetails } from '@/app/actions/forum';
import { getSession } from '@/lib/auth/session';
import { Avatar } from '@/components/forum/post-card';
import { LikeButton } from '@/components/forum/like-button';
import { ReplyForm } from '@/components/forum/reply-form';
import { ReplyCard } from '@/components/forum/reply-card';
import { TeaserContent } from '@/components/forum/teaser-content';
import { PostDetailSkeleton } from '@/components/forum/skeletons';

export const dynamic = 'force-dynamic';

const TEASER_CHARS = 400;

interface PageProps {
    params: Promise<{ slug: string }>;
}

// ─── SEO Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostDetails(slug);
    if (!post) return {};

    const description = post.content.slice(0, 155).replace(/\s+/g, ' ');

    return {
        title: `${post.title} | A Forja — O Ancestral`,
        description,
        openGraph: {
            title: post.title,
            description,
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            authors: [post.author.name],
        },
        alternates: { canonical: `/comunidade/post/${post.slug}` },
    };
}

// ─── Post content ─────────────────────────────────────────────────────────────

async function PostContent({ slug }: { slug: string }) {
    const [post, session] = await Promise.all([
        getPostDetails(slug),
        getSession(),
    ]);

    if (!post) notFound();

    const isAuthenticated = !!session;
    const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR });
    const totalReplies = post.replies.reduce((acc, r) => acc + 1 + r.replies.length, 0);
    const showTeaser = !isAuthenticated && post.content.length > TEASER_CHARS;

    // Full content always served in JSON-LD — Googlebot reads it even if hidden by CSS
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'DiscussionForumPosting',
        headline: post.title,
        text: post.content,
        url: `https://oancestral.com.br/comunidade/post/${post.slug}`,
        author: { '@type': 'Person', name: post.author.name },
        datePublished: post.createdAt.toISOString(),
        interactionStatistic: [
            { '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: post._count.likes },
            { '@type': 'InteractionCounter', interactionType: 'https://schema.org/ReplyAction', userInteractionCount: totalReplies },
        ],
    };

    return (
        <>
            {/* JSON-LD — full content for crawlers regardless of auth state */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="space-y-6">
                {/* ── Main post ───────────────────────────────────────── */}
                <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
                    <Link
                        href={`/comunidade?category=${post.category.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        {post.category.icon} {post.category.name}
                    </Link>

                    <h1 className="font-serif text-2xl font-bold text-zinc-100 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-3">
                        <Avatar name={post.author.name} avatarUrl={post.author.avatarUrl} size={9} />
                        <div>
                            <Link href={`/u/${post.author.id}`} className="text-sm font-semibold text-zinc-200 hover:text-amber-400 transition-colors">
                                {post.author.name}
                            </Link>
                            <p className="text-xs text-zinc-500">{timeAgo}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-3 text-xs text-zinc-600">
                            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {totalReplies}</span>
                        </div>
                    </div>

                    <div className="border-t border-zinc-800" />

                    {showTeaser ? (
                        <TeaserContent content={post.content} />
                    ) : (
                        <>
                            <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </div>
                            <div className="pt-2 border-t border-zinc-800/60 flex items-center">
                                <LikeButton
                                    postId={post.id}
                                    initialCount={post._count.likes}
                                    initialLiked={post.likedByMe}
                                    isAuthenticated={isAuthenticated}
                                />
                            </div>
                        </>
                    )}
                </article>

                {/* ── Replies section — only if not teaser ────────────── */}
                {!showTeaser && (
                    <>
                        <div id="respostas" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                            <h3 className="font-serif text-base font-semibold text-zinc-300">
                                Adicionar resposta à Forja
                            </h3>
                            <ReplyForm postId={post.id} isAuthenticated={isAuthenticated} />
                        </div>

                        {post.replies.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-serif text-sm font-semibold text-zinc-500 uppercase tracking-widest px-1">
                                    {totalReplies} {totalReplies === 1 ? 'resposta' : 'respostas'}
                                </h3>
                                {post.replies.map((reply) => (
                                    <ReplyCard
                                        key={reply.id}
                                        reply={reply}
                                        postId={post.id}
                                        isAuthenticated={isAuthenticated}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params;

    return (
        <div className="space-y-4">
            <Link
                href="/comunidade"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-amber-400 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao fórum
            </Link>

            <Suspense fallback={<PostDetailSkeleton />}>
                <PostContent slug={slug} />
            </Suspense>
        </div>
    );
}
