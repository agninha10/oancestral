'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Trash2,
    Reply,
    Loader2,
    CornerDownRight,
    ExternalLink,
    Send,
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { deleteComment, adminReplyComment, type PlatformComment } from '@/app/admin/comentarios/actions';

// ─── Avatar util ──────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
    'bg-amber-600', 'bg-orange-600', 'bg-teal-600', 'bg-sky-600',
    'bg-violet-600', 'bg-rose-600', 'bg-emerald-600', 'bg-indigo-600',
];

function avatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string) {
    return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

function Avatar({ name }: { name: string }) {
    return (
        <div
            className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white',
                avatarColor(name),
            )}
        >
            {initials(name)}
        </div>
    );
}

// ─── ReplyModal ───────────────────────────────────────────────────────────────

interface ReplyModalProps {
    comment: PlatformComment;
    open: boolean;
    onClose: () => void;
}

function ReplyModal({ comment, open, onClose }: ReplyModalProps) {
    const [text, setText] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;

        startTransition(async () => {
            const result = await adminReplyComment(comment.lesson.id, comment.id, trimmed);
            if (result.success) {
                toast.success('Resposta publicada.');
                setText('');
                onClose();
            } else {
                toast.error(result.error ?? 'Erro ao responder.');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v && !isPending) onClose(); }}>
            <DialogContent className="max-w-lg border-zinc-800 bg-zinc-950 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-zinc-100">
                        <CornerDownRight className="h-4 w-4 text-amber-500" />
                        Responder como Admin
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Respondendo ao comentário de{' '}
                        <span className="font-medium text-zinc-300">{comment.user.name}</span>
                        {' '}em{' '}
                        <span className="font-medium text-zinc-300">
                            {comment.lesson.module.course.title}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                {/* Original comment */}
                <div className="rounded-lg border border-zinc-800 bg-black/50 px-4 py-3">
                    <p className="text-sm leading-relaxed text-zinc-400 line-clamp-4">
                        {comment.text}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                        autoFocus
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Escreva sua resposta…"
                        disabled={isPending}
                        rows={4}
                        className={cn(
                            'w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3',
                            'text-sm text-zinc-200 placeholder:text-zinc-600',
                            'focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30',
                            'disabled:opacity-50 transition-colors',
                        )}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            disabled={isPending}
                            className="text-zinc-500 hover:text-zinc-300"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isPending || !text.trim()}
                            className="bg-amber-600 font-semibold text-white hover:bg-amber-500 disabled:opacity-40"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Send className="mr-1.5 h-3.5 w-3.5" />
                                    Publicar Resposta
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── CommentRow ───────────────────────────────────────────────────────────────

interface CommentRowProps {
    comment: PlatformComment;
    onReply: (comment: PlatformComment) => void;
    onDeleted: (id: string) => void;
}

function CommentRow({ comment, onReply, onDeleted }: CommentRowProps) {
    const [isDeleting, startDelete] = useTransition();

    const handleDelete = () => {
        startDelete(async () => {
            const result = await deleteComment(comment.id);
            if (result.success) {
                toast.success('Comentário apagado.');
                onDeleted(comment.id);
            } else {
                toast.error(result.error ?? 'Erro ao apagar comentário.');
            }
        });
    };

    const playerHref = `/play/${comment.lesson.module.course.slug}/aula/${comment.lesson.id}`;

    return (
        <div
            className={cn(
                'group flex flex-col gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4',
                'transition-colors hover:border-zinc-700/80 hover:bg-zinc-900/70',
                comment.parentId && 'border-l-2 border-l-amber-600/40',
            )}
        >
            {/* Top row: avatar + meta + actions */}
            <div className="flex items-start gap-3">
                <Avatar name={comment.user.name} />

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-200">
                            {comment.user.name}
                        </span>
                        {comment.parentId && (
                            <Badge
                                variant="secondary"
                                className="border-amber-600/20 bg-amber-600/10 px-1.5 py-0 text-[10px] text-amber-400"
                            >
                                resposta
                            </Badge>
                        )}
                        <span className="text-xs text-zinc-600">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                                locale: ptBR,
                            })}
                        </span>
                    </div>

                    {/* Course / lesson breadcrumb */}
                    <a
                        href={playerHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-amber-400"
                    >
                        <ExternalLink className="h-3 w-3" />
                        <span className="line-clamp-1">
                            {comment.lesson.module.course.title}
                            <span className="mx-1 text-zinc-700">/</span>
                            {comment.lesson.title}
                        </span>
                    </a>
                </div>

                {/* Action buttons */}
                <div className="flex shrink-0 items-center gap-1">
                    {/* Reply — only for root comments */}
                    {!comment.parentId && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onReply(comment)}
                            className="h-8 gap-1.5 px-2.5 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-amber-400"
                        >
                            <Reply className="h-3.5 w-3.5" />
                            Responder
                        </Button>
                    )}

                    {/* Delete */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                disabled={isDeleting}
                                className="h-8 w-8 p-0 text-zinc-600 hover:bg-red-900/50 hover:text-red-400"
                                aria-label="Apagar comentário"
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                )}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Apagar comentário?</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-500">
                                    Esta ação é irreversível. Respostas encadeadas também serão apagadas.
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

            {/* Comment text */}
            <p className="ml-11 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400 line-clamp-4">
                {comment.text}
            </p>

            {/* Reply count badge */}
            {comment._count.replies > 0 && (
                <div className="ml-11 flex items-center gap-1 text-xs text-zinc-600">
                    <CornerDownRight className="h-3 w-3" />
                    {comment._count.replies} resposta{comment._count.replies !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
}

// ─── CommentModerationTable ───────────────────────────────────────────────────

interface CommentModerationTableProps {
    initialComments: PlatformComment[];
}

export function CommentModerationTable({ initialComments }: CommentModerationTableProps) {
    const [comments, setComments] = useState<PlatformComment[]>(initialComments);
    const [replyTarget, setReplyTarget] = useState<PlatformComment | null>(null);

    const handleDeleted = (id: string) => {
        setComments((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <>
            {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-600">
                    <p className="text-sm">Nenhum comentário encontrado na plataforma.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <CommentRow
                            key={comment.id}
                            comment={comment}
                            onReply={setReplyTarget}
                            onDeleted={handleDeleted}
                        />
                    ))}
                </div>
            )}

            {replyTarget && (
                <ReplyModal
                    comment={replyTarget}
                    open={true}
                    onClose={() => setReplyTarget(null)}
                />
            )}
        </>
    );
}
