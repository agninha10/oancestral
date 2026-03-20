'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Trash2,
    Pin,
    PinOff,
    Loader2,
    ExternalLink,
    ChevronDown,
    ChevronRight,
    MessageCircle,
    Heart,
    Eye,
    CornerDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    adminDeletePost,
    adminDeleteReply,
    adminTogglePin,
    type AdminForumPost,
    type AdminForumReply,
} from '@/app/admin/forum/actions';

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
    'bg-amber-600', 'bg-orange-600', 'bg-teal-600', 'bg-sky-600',
    'bg-violet-600', 'bg-rose-600', 'bg-emerald-600', 'bg-indigo-600',
];

function avatarColor(name: string | null) {
    if (!name) return AVATAR_COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string | null) {
    return (name ?? '?').split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

function Avatar({ name, url }: { name: string | null; url: string | null }) {
    if (url) {
        return <img src={url} alt={name ?? ''} className="h-8 w-8 shrink-0 rounded-full object-cover" />;
    }
    return (
        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white', avatarColor(name))}>
            {initials(name)}
        </div>
    );
}

// ─── PostRow ──────────────────────────────────────────────────────────────────

interface PostRowProps {
    post: AdminForumPost;
    replies: AdminForumReply[];
    onDeleted: (id: string) => void;
    onPinToggled: (id: string, pinned: boolean) => void;
    onReplyDeleted: (id: string) => void;
}

function PostRow({ post, replies, onDeleted, onPinToggled, onReplyDeleted }: PostRowProps) {
    const [expanded, setExpanded] = useState(false);
    const [isDeleting, startDelete] = useTransition();
    const [isPinning, startPin] = useTransition();

    const postReplies = replies.filter((r) => r.postId === post.id);
    const postHref = `/comunidade/post/${post.slug ?? post.id}`;

    const handleDelete = () => {
        startDelete(async () => {
            const res = await adminDeletePost(post.id);
            if (res.success) {
                toast.success('Post apagado.');
                onDeleted(post.id);
            } else {
                toast.error(res.error);
            }
        });
    };

    const handlePin = () => {
        startPin(async () => {
            const res = await adminTogglePin(post.id, !post.pinned);
            if (res.success) {
                toast.success(post.pinned ? 'Post desafixado.' : 'Post fixado.');
                onPinToggled(post.id, !post.pinned);
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40">
            {/* Post header */}
            <div className="flex items-start gap-3 p-4">
                <Avatar name={post.author.name} url={post.author.avatarUrl} />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start gap-2">
                        <span className="text-sm font-semibold text-zinc-200">{post.author.name}</span>
                        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-px text-[11px] text-zinc-400">
                            {post.category.icon} {post.category.name}
                        </span>
                        {post.pinned && (
                            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-px text-[11px] font-semibold text-amber-400">
                                📌 Fixado
                            </span>
                        )}
                        <span className="text-xs text-zinc-600">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                        </span>
                    </div>

                    <Link
                        href={postHref}
                        target="_blank"
                        className="mt-1 flex items-center gap-1 text-sm font-medium text-zinc-100 hover:text-amber-400 transition-colors line-clamp-2"
                    >
                        {post.title}
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                    </Link>

                    <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {post.content}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-xs text-zinc-600">
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post._count.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{post._count.replies}</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                    {postReplies.length > 0 && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpanded((v) => !v)}
                            className="h-8 gap-1 px-2 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                        >
                            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                            {postReplies.length}
                        </Button>
                    )}

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handlePin}
                        disabled={isPinning}
                        title={post.pinned ? 'Desafixar' : 'Fixar post'}
                        className="h-8 w-8 p-0 text-zinc-500 hover:bg-zinc-800 hover:text-amber-400"
                    >
                        {isPinning
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : post.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />
                        }
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                disabled={isDeleting}
                                className="h-8 w-8 p-0 text-zinc-600 hover:bg-red-900/50 hover:text-red-400"
                                aria-label="Apagar post"
                            >
                                {isDeleting
                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    : <Trash2 className="h-3.5 w-3.5" />
                                }
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Apagar este post?</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-500">
                                    Todas as respostas e curtidas também serão apagadas. Ação irreversível.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800">
                                    Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-700 text-white hover:bg-red-600"
                                >
                                    Sim, apagar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Replies (expandable) */}
            {expanded && postReplies.length > 0 && (
                <div className="border-t border-zinc-800 px-4 pb-3 pt-2 space-y-2">
                    {postReplies.map((reply) => (
                        <ReplyRow
                            key={reply.id}
                            reply={reply}
                            onDeleted={onReplyDeleted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── ReplyRow ─────────────────────────────────────────────────────────────────

function ReplyRow({ reply, onDeleted }: { reply: AdminForumReply; onDeleted: (id: string) => void }) {
    const [isDeleting, startDelete] = useTransition();

    const handleDelete = () => {
        startDelete(async () => {
            const res = await adminDeleteReply(reply.id);
            if (res.success) {
                toast.success('Resposta apagada.');
                onDeleted(reply.id);
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <div className={cn(
            'flex items-start gap-2 rounded-lg bg-zinc-900/60 p-3',
            reply.parentId && 'ml-6 border-l-2 border-zinc-700',
        )}>
            {reply.parentId && <CornerDownRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-zinc-600" />}
            <Avatar name={reply.author.name} url={reply.author.avatarUrl} />

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-300">{reply.author.name}</span>
                    <span className="text-xs text-zinc-600">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: ptBR })}
                    </span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-500 leading-relaxed line-clamp-3">
                    {reply.content}
                </p>
            </div>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        size="sm"
                        variant="ghost"
                        disabled={isDeleting}
                        className="h-7 w-7 shrink-0 p-0 text-zinc-700 hover:bg-red-900/40 hover:text-red-400"
                        aria-label="Apagar resposta"
                    >
                        {isDeleting
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : <Trash2 className="h-3 w-3" />
                        }
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apagar esta resposta?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500">
                            Sub-respostas encadeadas também serão apagadas. Ação irreversível.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-700 text-white hover:bg-red-600"
                        >
                            Sim, apagar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// ─── ForumModerationTable ─────────────────────────────────────────────────────

interface ForumModerationTableProps {
    initialPosts: AdminForumPost[];
    initialReplies: AdminForumReply[];
}

export function ForumModerationTable({ initialPosts, initialReplies }: ForumModerationTableProps) {
    const [posts, setPosts] = useState<AdminForumPost[]>(initialPosts);
    const [replies, setReplies] = useState<AdminForumReply[]>(initialReplies);

    const handlePostDeleted = (id: string) => {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setReplies((prev) => prev.filter((r) => r.postId !== id));
    };

    const handlePinToggled = (id: string, pinned: boolean) => {
        setPosts((prev) => prev.map((p) => p.id === id ? { ...p, pinned } : p));
    };

    const handleReplyDeleted = (id: string) => {
        setReplies((prev) => prev.filter((r) => r.id !== id));
    };

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-600">
                <p className="text-sm">Nenhum post no fórum ainda.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {posts.map((post) => (
                <PostRow
                    key={post.id}
                    post={post}
                    replies={replies}
                    onDeleted={handlePostDeleted}
                    onPinToggled={handlePinToggled}
                    onReplyDeleted={handleReplyDeleted}
                />
            ))}
        </div>
    );
}
