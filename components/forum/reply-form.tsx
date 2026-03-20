'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import { createReply } from '@/app/actions/forum';

interface ReplyFormProps {
    postId: string;
}

export function ReplyForm({ postId }: ReplyFormProps) {
    const [content,  setContent]  = useState('');
    const [isPending, startT]     = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        startT(async () => {
            const res = await createReply({ postId, content });
            if (res.success) {
                setContent('');
                toast.success('Resposta adicionada à Forja.');
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Adicione sua resposta à Forja…"
                rows={4}
                disabled={isPending}
                className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30 disabled:opacity-50"
            />
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending || !content.trim()}
                    className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isPending
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Send className="h-4 w-4" />
                    }
                    Forjar resposta
                </button>
            </div>
        </form>
    );
}
