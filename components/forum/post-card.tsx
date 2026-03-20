import Link from 'next/link';
import { MessageCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LikeButton } from '@/components/forum/like-button';
import type { PostSummary } from '@/app/actions/forum';

interface PostCardProps {
    post: PostSummary;
}

function Avatar({ name, avatarUrl, size = 8 }: { name: string; avatarUrl: string | null; size?: number }) {
    const initials = name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
    const cls = `h-${size} w-${size} shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-amber-500/20 text-amber-400 text-xs font-bold`;
    return (
        <div className={cls}>
            {avatarUrl
                ? <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                : initials
            }
        </div>
    );
}

export { Avatar };

export function PostCard({ post }: PostCardProps) {
    const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: ptBR,
    });

    const preview = post.content.length > 180
        ? post.content.slice(0, 180).trimEnd() + '…'
        : post.content;

    return (
        <article className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-500/30">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <Avatar name={post.author.name} avatarUrl={post.author.avatarUrl} />
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-zinc-200">{post.author.name}</span>
                    <span className="mx-1.5 text-zinc-600">·</span>
                    <span className="text-xs text-zinc-500">{timeAgo}</span>
                </div>
                <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
                    {post.category.icon} {post.category.name}
                </span>
            </div>

            {/* Title + preview */}
            <Link href={`/comunidade/post/${post.id}`} className="block">
                <h2 className="font-serif text-lg font-bold text-zinc-100 leading-snug mb-1.5 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {post.pinned && <span className="mr-1.5 text-amber-500" title="Fixado">📌</span>}
                    {post.title}
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{preview}</p>
            </Link>

            {/* Footer */}
            <div className="mt-4 flex items-center gap-1">
                <LikeButton
                    postId={post.id}
                    initialCount={post._count.likes}
                    initialLiked={post.likedByMe}
                />
                <Link
                    href={`/comunidade/post/${post.id}#respostas`}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post._count.replies}</span>
                </Link>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-zinc-600">
                    <Eye className="h-3.5 w-3.5" />
                    {post.views}
                </div>
            </div>
        </article>
    );
}
