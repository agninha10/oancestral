import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPostDetails } from '@/app/actions/forum';
import { Avatar } from '@/components/forum/post-card';
import { LikeButton } from '@/components/forum/like-button';
import { ReplyForm } from '@/components/forum/reply-form';
import { PostDetailSkeleton } from '@/components/forum/skeletons';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function PostContent({ id }: { id: string }) {
    const post = await getPostDetails(id);
    if (!post) notFound();

    const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: ptBR,
    });

    return (
        <div className="space-y-6">
            {/* ── Main post ───────────────────────────────────────────── */}
            <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
                {/* Category badge */}
                <div>
                    <Link
                        href={`/comunidade?category=${post.category.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        {post.category.icon} {post.category.name}
                    </Link>
                </div>

                {/* Title */}
                <h1 className="font-serif text-2xl font-bold text-zinc-100 leading-tight">
                    {post.title}
                </h1>

                {/* Author + meta */}
                <div className="flex items-center gap-3">
                    <Avatar name={post.author.name} avatarUrl={post.author.avatarUrl} size={9} />
                    <div>
                        <p className="text-sm font-semibold text-zinc-200">{post.author.name}</p>
                        <p className="text-xs text-zinc-500">{timeAgo}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-3 text-xs text-zinc-600">
                        <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" /> {post._count.replies}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-800" />

                {/* Content */}
                <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>

                {/* Like */}
                <div className="pt-2 border-t border-zinc-800/60 flex items-center">
                    <LikeButton
                        postId={post.id}
                        initialCount={post._count.likes}
                        initialLiked={post.likedByMe}
                    />
                </div>
            </article>

            {/* ── Reply form ──────────────────────────────────────────── */}
            <div id="respostas" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                <h3 className="font-serif text-base font-semibold text-zinc-300">
                    Adicionar resposta à Forja
                </h3>
                <ReplyForm postId={post.id} />
            </div>

            {/* ── Replies ─────────────────────────────────────────────── */}
            {post.replies.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-serif text-sm font-semibold text-zinc-500 uppercase tracking-widest px-1">
                        {post.replies.length} {post.replies.length === 1 ? 'resposta' : 'respostas'}
                    </h3>
                    {post.replies.map((reply) => {
                        const replyTime = formatDistanceToNow(new Date(reply.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                        });
                        return (
                            <div
                                key={reply.id}
                                className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 space-y-3"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar name={reply.author.name} avatarUrl={reply.author.avatarUrl} />
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-200">{reply.author.name}</p>
                                        <p className="text-xs text-zinc-500">{replyTime}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap pl-11">
                                    {reply.content}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default async function PostPage({ params }: PageProps) {
    const { id } = await params;

    return (
        <div className="space-y-4">
            {/* Back nav */}
            <Link
                href="/comunidade"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-amber-400 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao fórum
            </Link>

            <Suspense fallback={<PostDetailSkeleton />}>
                <PostContent id={id} />
            </Suspense>
        </div>
    );
}
