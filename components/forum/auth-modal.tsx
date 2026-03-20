'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Swords, LogIn, UserPlus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="border-zinc-800 bg-zinc-950 p-0 sm:max-w-md" showCloseButton={false}>
                {/* Header */}
                <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-zinc-900 to-zinc-950 border-b border-zinc-800 px-6 py-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 ring-2 ring-amber-500/30">
                            <Swords className="h-7 w-7 text-amber-400" />
                        </div>
                    </div>
                    <DialogTitle className="font-serif text-2xl font-bold text-zinc-100">
                        Acesse a Forja
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-sm text-zinc-400 leading-relaxed">
                        Faça login ou cadastre-se para interagir<br />com a tribo e participar das discussões.
                    </DialogDescription>
                </div>

                {/* Actions */}
                <div className="p-6 space-y-3">
                    <Link
                        href="/auth/login"
                        onClick={onClose}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-bold text-zinc-950 transition-colors hover:bg-amber-400"
                    >
                        <LogIn className="h-5 w-5" />
                        Entrar na minha conta
                    </Link>
                    <Link
                        href="/auth/register"
                        onClick={onClose}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
                    >
                        <UserPlus className="h-5 w-5" />
                        Criar conta gratuita
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        Continuar navegando sem conta
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/** Inline hook para qualquer componente gerenciar o modal */
export function useAuthModal() {
    const [open, setOpen] = useState(false);
    return {
        open,
        show:  () => setOpen(true),
        close: () => setOpen(false),
        Modal: () => <AuthModal open={open} onClose={() => setOpen(false)} />,
    };
}
