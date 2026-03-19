'use client';

import { useState, useTransition, useRef } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Send, Loader2, CornerDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { postComment, type CommentWithUser, type ReplyWithUser } from '@/app/play/comment-actions';
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

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'xs' }) {
    const sz =
        size === 'xs'
            ? 'h-6 w-6 text-[10px]'
            : size === 'sm'
              ? 'h-7 w-7 text-xs'
              : 'h-9 w-9 text-sm';
    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
                sz,
                avatarColor(name),
            )}
        >
            {initials(name)}
        </div>
    );
}

// ─── Timestamp ────────────────────────────────────────────────────────────────

function Timestamp({ date }: { date: Date }) {
    return (
        <span className="text-xs text-zinc-600">
            {formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })}
        </span>
    );
}

// ─── ReplyForm ────────────────────────────────────────────────────────────────

interface ReplyFormProps {
    lessonId: string;
    parentId: string;
    currentUser: { id: string; name: string };
    onSuccess: (reply: ReplyWithUser) => void;
    onCancel: () => void;
}

function ReplyForm({ lessonId, parentId, currentUser, onSuccess, onCancel }: ReplyFormProps) {
    const [text, setText] = useState('');
    const [isPending, startTransition] = useTransition();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;

        startTransition(async () => {
            const result = await postComment(lessonId, trimmed, parentId);
            if (result.success) {
                onSuccess({
                    id: result.comment.id,
                    text: result.comment.text,
                    createdAt: result.comment.createdAt,
                    parentId,
                    user: result.comment.user,
                });
                setText('');
            } else {
                toast.error(result.error ?? 'Erro ao publicar resposta.');
                textareaRef.current?.focus();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2.5 pt-2">
            <Avatar name={currentUser.name} size="xs" />
            <div className="flex flex-1 flex-col gap-2">
                <textarea
                    ref={textareaRef}
                    autoFocus
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Respondendo…`}
                    disabled={isPending}
                    rows={2}
                    className={cn(
                        'w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2',
                        'text-sm text-zinc-200 placeholder:text-zinc-600',
                        'focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30',
                        'disabled:opacity-50 transition-colors',
                    )}
                />
                <div className="flex items-center gap-2">
                    <Button
                        type="submit"
                        size="sm"
                        disabled={isPending || !text.trim()}
                        className="h-7 bg-amber-600 px-3 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-40"
                    >
                        {isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <>
                                <Send className="mr-1 h-3 w-3" />
                                Enviar
                            </>
                        )}
                    </Button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isPending}
                        className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
    );
}

// ─── CommentCard ──────────────────────────────────────────────────────────────

interface CommentCardProps {
    comment: CommentWithUser;
    lessonId: string;
    currentUser: { id: string; name: string };
    onReplyAdded: (parentId: string, reply: ReplyWithUser) => void;
}

function CommentCard({ comment, lessonId, currentUser, onReplyAdded }: CommentCardProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const isOptimistic = comment.id.startsWith('optimistic-');

    return (
        <li className={cn('space-y-2 transition-opacity', isOptimistic && 'opacity-60')}>
            {/* Main comment */}
            <div className="flex gap-3 rounded-xl bg-black/50 p-4">
                <Avatar name={comment.user.name} size="sm" />
                <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-semibold text-zinc-200">
                            {comment.user.name}
                        </span>
                        <Timestamp date={comment.createdAt} />
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
                        {comment.text}
                    </p>
                    {/* Reply trigger */}
                    {!isOptimistic && (
                        <button
                            onClick={() => setShowReplyForm((v) => !v)}
                            className="mt-1 flex items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-amber-400"
                        >
                            <CornerDownRight className="h-3 w-3" />
                            Responder
                        </button>
                    )}
                </div>
            </div>

            {/* Reply form */}
            {showReplyForm && (
                <div className="ml-8 pl-3 border-l-2 border-zinc-800">
                    <ReplyForm
                        lessonId={lessonId}
                        parentId={comment.id}
                        currentUser={currentUser}
                        onSuccess={(reply) => {
                            onReplyAdded(comment.id, reply);
                            setShowReplyForm(false);
                        }}
                        onCancel={() => setShowReplyForm(false)}
                    />
                </div>
            )}

            {/* Replies */}
            {comment.replies.length > 0 && (
                <ul className="ml-8 space-y-2 border-l-2 border-zinc-800 pl-4">
                    {comment.replies.map((reply) => {
                        const replyOptimistic = reply.id.startsWith('optimistic-');
                        return (
                            <li
                                key={reply.id}
                                className={cn(
                                    'flex gap-2.5 rounded-lg bg-zinc-900/60 p-3 transition-opacity',
                                    replyOptimistic && 'opacity-60',
                                )}
                            >
                                <Avatar name={reply.user.name} size="xs" />
                                <div className="flex-1 space-y-0.5 min-w-0">
                                    <div className="flex flex-wrap items-baseline gap-2">
                                        <span className="text-xs font-semibold text-zinc-200">
                                            {reply.user.name}
                                        </span>
                                        <Timestamp date={reply.createdAt} />
                                    </div>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
                                        {reply.text}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
}

// ─── LessonComments ───────────────────────────────────────────────────────────

interface LessonCommentsProps {
    lessonId: string;
    initialComments: CommentWithUser[];
    currentUser: { id: string; name: string };
}

export function LessonComments({ lessonId, initialComments, currentUser }: LessonCommentsProps) {
    const [comments, setComments] = useState<CommentWithUser[]>(initialComments);
    const [text, setText] = useState('');
    const [isPending, startTransition] = useTransition();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const totalCount = comments.reduce((sum, c) => sum + 1 + c.replies.length, 0);

    // Add a top-level optimistic comment
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;

        const optimistic: CommentWithUser = {
            id: `optimistic-${Date.now()}`,
            text: trimmed,
            createdAt: new Date(),
            parentId: null,
            user: currentUser,
            replies: [],
        };
        setComments((prev) => [...prev, optimistic]);
        setText('');

        startTransition(async () => {
            const result = await postComment(lessonId, trimmed);
            if (result.success) {
                setComments((prev) =>
                    prev.map((c) => (c.id === optimistic.id ? result.comment : c)),
                );
            } else {
                setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
                toast.error(result.error ?? 'Erro ao publicar comentário.');
                setText(trimmed);
                textareaRef.current?.focus();
            }
        });
    };

    // Append a confirmed reply to the correct parent
    const handleReplyAdded = (parentId: string, reply: ReplyWithUser) => {
        setComments((prev) =>
            prev.map((c) =>
                c.id === parentId ? { ...c, replies: [...c.replies, reply] } : c,
            ),
        );
    };

    return (
        <section className="mt-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                <h2 className="text-base font-semibold text-zinc-200">
                    Comentários
                    {totalCount > 0 && (
                        <span className="ml-2 text-sm font-normal text-zinc-500">
                            ({totalCount})
                        </span>
                    )}
                </h2>
            </div>

            {/* Compose */}
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
                            'disabled:opacity-50 transition-colors',
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

            {/* List */}
            {comments.length === 0 ? (
                <p className="py-6 text-center text-sm text-zinc-600">
                    Seja o primeiro a comentar nesta aula.
                </p>
            ) : (
                <ul className="space-y-4">
                    {comments.map((comment) => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            lessonId={lessonId}
                            currentUser={currentUser}
                            onReplyAdded={handleReplyAdded}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}
