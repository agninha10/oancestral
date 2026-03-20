'use client';

import { useState, useTransition } from 'react';
import { Flame } from 'lucide-react';
import { togglePostLike } from '@/app/actions/forum';
import { useAuthModal } from '@/components/forum/auth-modal';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
    postId: string;
    initialCount: number;
    initialLiked: boolean;
    isAuthenticated: boolean;
}

export function LikeButton({ postId, initialCount, initialLiked, isAuthenticated }: LikeButtonProps) {
    const [liked,   setLiked]   = useState(initialLiked);
    const [count,   setCount]   = useState(initialCount);
    const [pending, startT]     = useTransition();
    const { open, show, close, Modal } = useAuthModal();

    const handleClick = () => {
        if (!isAuthenticated) { show(); return; }

        setLiked((v) => !v);
        setCount((v) => liked ? v - 1 : v + 1);

        startT(async () => {
            const res = await togglePostLike(postId);
            setLiked(res.liked);
            setCount(res.count);
        });
    };

    return (
        <>
            <Modal />
            <button
                onClick={handleClick}
                disabled={pending}
                className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
                    liked
                        ? 'text-amber-400 hover:text-amber-300'
                        : 'text-zinc-500 hover:text-amber-400'
                )}
            >
                <Flame className={cn('h-4 w-4 transition-transform', liked && 'scale-110')} />
                <span>{count}</span>
            </button>
        </>
    );
}
