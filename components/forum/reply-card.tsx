'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CornerDownRight, MessageCircle } from 'lucide-react';
import { Avatar } from '@/components/forum/post-card';
import { InlineReplyForm } from '@/components/forum/inline-reply-form';
import { useAuthModal } from '@/components/forum/auth-modal';
import type { ReplyItem } from '@/app/actions/forum';

interface ReplyCardProps {
    reply: ReplyItem;
    postId: string;
    isAuthenticated: boolean;
}

export function ReplyCard({ reply, postId, isAuthenticated }: ReplyCardProps) {
    const [replyingTo, setReplyingTo] = useState(false);
    const { open, show, close, Modal } = useAuthModal();

    const timeAgo = formatDistanceToNow(new Date(reply.createdAt), {
        addSuffix: true,
        locale: ptBR,
    });

    const handleReplyClick = () => {
        if (!isAuthenticated) { show(); return; }
        setReplyingTo(true);
    };

    return (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 space-y-3">
            <Modal />

            {/* Author */}
            <div className="flex items-center gap-3">
                <Avatar name={reply.author.name} avatarUrl={reply.author.avatarUrl} />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-200">{reply.author.name}</p>
                    <p className="text-xs text-zinc-500">{timeAgo}</p>
                </div>
            </div>

            {/* Content */}
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap pl-11">
                {reply.content}
            </p>

            {/* Reply button */}
            <div className="pl-11">
                {!replyingTo ? (
                    <button
                        type="button"
                        onClick={handleReplyClick}
                        className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-amber-400 transition-colors"
                    >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Responder
                    </button>
                ) : (
                    <InlineReplyForm
                        postId={postId}
                        parentId={reply.id}
                        replyingTo={reply.author.name}
                        onClose={() => setReplyingTo(false)}
                    />
                )}
            </div>

            {/* Sub-replies */}
            {reply.replies.length > 0 && (
                <div className="pl-8 space-y-3 border-l-2 border-zinc-800 mt-1">
                    {reply.replies.map((sub) => {
                        const subTime = formatDistanceToNow(new Date(sub.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                        });
                        return (
                            <div key={sub.id} className="flex gap-3 pt-3">
                                <div className="shrink-0 mt-0.5">
                                    <CornerDownRight className="h-3.5 w-3.5 text-zinc-700" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar name={sub.author.name} avatarUrl={sub.author.avatarUrl} size={6} />
                                        <span className="text-xs font-semibold text-zinc-300">{sub.author.name}</span>
                                        <span className="text-xs text-zinc-600">{subTime}</span>
                                    </div>
                                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                                        {sub.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
