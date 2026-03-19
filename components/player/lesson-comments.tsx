'use client';

import { useState, useTransition, useRef } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { postComment, type CommentWithUser } from '@/app/play/comment-actions';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ─── Avatar util ──────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
    'bg-amber-600',
    'bg-orange-600',
    'bg-teal-600',
    'bg-sky-600',
    'bg-violet-600',
    'bg-rose-600',
    'bg-emerald-600',
    'bg-indigo-600',
];

function avatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
    const sz = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm';
    return (
        <div
            className={cn(
                'flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white',
                sz,
                avatarColor(name),
            )}
        >
            {initials(name)}
        </div>
    );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonCommentsProps {
    lessonId: string;
    initialComments: CommentWithUser[];
    currentUser: { id: string; name: string };
}

// ─── LessonComments ───────────────────────────────────────────────────────────

export function LessonComments({
    lessonId,
    initialComments,
    currentUser,
}: LessonCommentsProps) {
    const [comments, setComments] = useState<CommentWithUser[]>(initialComments);
    const [text, setText] = useState('');
    const [isPending, startTransition] = useTransition();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;

        // Optimistic update
        const optimistic: CommentWithUser = {
            id: `optimistic-${Date.now()}`,
            text: trimmed,
            createdAt: new Date(),
            user: currentUser,
        };
        setComments((prev) => [...prev, optimistic]);
        setText('');

        startTransition(async () => {
            const result = await postComment(lessonId, trimmed);

            if (result.success) {
                // Replace optimistic entry with the real one from the server
                setComments((prev) =>
                    prev.map((c) => (c.id === optimistic.id ? result.comment : c)),
                );
            } else {
                // Roll back
                setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
                toast.error(result.error ?? 'Erro ao publicar comentário.');
                setText(trimmed);
                textareaRef.current?.focus();
            }
        });
    };

    return (
        <section className="mt-8 space-y-6">
            {/* Section header */}
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                <h2 className="text-base font-semibold text-zinc-200">
                    Comentários
                    {comments.length > 0 && (
                        <span className="ml-2 text-sm font-normal text-zinc-500">
                            ({comments.length})
                        </span>
                    )}
                </h2>
            </div>

            {/* Compose form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
                <Avatar name={currentUser.name} />
                <div className="flex flex-1 flex-col gap-2">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Compartilhe sua dúvida ou reflexão sobre esta aula…"
                        disabled={isPending}
                        rows={3}
                        className={cn(
                            'w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3',
                            'text-sm text-zinc-200 placeholder:text-zinc-600',
                            'focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30',
                            'disabled:opacity-50',
                            'transition-colors',
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isPending || !text.trim()}
                            className="bg-amber-600 font-semibold text-white hover:bg-amber-500 disabled:opacity-40"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Publicando…
                                </>
                            ) : (
                                <>
                                    <Send className="mr-1.5 h-3.5 w-3.5" />
                                    Publicar Comentário
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Comments list */}
            {comments.length === 0 ? (
                <p className="py-6 text-center text-sm text-zinc-600">
                    Seja o primeiro a comentar nesta aula.
                </p>
            ) : (
                <ul className="space-y-3">
                    {comments.map((comment) => {
                        const isOptimistic = comment.id.startsWith('optimistic-');
                        return (
                            <li
                                key={comment.id}
                                className={cn(
                                    'flex gap-3 rounded-xl bg-black/50 p-4 transition-opacity',
                                    isOptimistic && 'opacity-60',
                                )}
                            >
                                <Avatar name={comment.user.name} size="sm" />
                                <div className="flex-1 space-y-1">
                                    <div className="flex flex-wrap items-baseline gap-2">
                                        <span className="text-sm font-semibold text-zinc-200">
                                            {comment.user.name}
                                        </span>
                                        <span className="text-xs text-zinc-600">
                                            {formatDistanceToNow(new Date(comment.createdAt), {
                                                addSuffix: true,
                                                locale: ptBR,
                                            })}
                                        </span>
                                    </div>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
                                        {comment.text}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
