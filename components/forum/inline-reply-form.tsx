'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Loader2, Send, X } from 'lucide-react';
import { createReply } from '@/app/actions/forum';

interface InlineReplyFormProps {
    postId: string;
    parentId: string;
    replyingTo: string;
    onClose: () => void;
}

export function InlineReplyForm({ postId, parentId, replyingTo, onClose }: InlineReplyFormProps) {
    const [content,  setContent]  = useState('');
    const [isPending, startT]     = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        startT(async () => {
            const res = await createReply({ postId, content, parentId });
            if (res.success) {
                toast.success('Resposta adicionada.');
                onClose();
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                <span>Respondendo a <span className="text-amber-400 font-medium">{replyingTo}</span></span>
                <button type="button" onClick={onClose} className="ml-auto text-zinc-600 hover:text-zinc-400">
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Responder a ${replyingTo}…`}
                rows={3}
                autoFocus
                disabled={isPending}
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 disabled:opacity-50"
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isPending || !content.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {isPending
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Send className="h-3.5 w-3.5" />
                    }
                    Responder
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}
