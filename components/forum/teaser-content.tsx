'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { AuthModal } from '@/components/forum/auth-modal';

const TEASER_CHARS = 400;

interface TeaserContentProps {
    content: string;
}

export function TeaserContent({ content }: TeaserContentProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const teaser = content.slice(0, TEASER_CHARS).trimEnd();

    return (
        <>
            <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />

            <div className="relative">
                {/* Visible teaser text */}
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {teaser}
                </p>

                {/* Fade-out gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent" />

                {/* CTA on top of gradient */}
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-3 gap-2">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
                    >
                        <Lock className="h-4 w-4" />
                        Ler tópico completo
                    </button>
                </div>
            </div>

            {/* Bottom padding so the CTA doesn't overlap following content */}
            <div className="h-10" />
        </>
    );
}
