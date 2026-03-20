'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Swords, LogIn, UserPlus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

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
                    {/* Google — primary */}
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/comunidade' })}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-zinc-100 transition-all hover:border-zinc-500 hover:bg-zinc-800"
                    >
                        <GoogleIcon />
                        Continuar com o Google
                    </button>

                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 border-t border-zinc-800" />
                        <span className="text-xs text-zinc-600 uppercase tracking-widest">ou</span>
                        <div className="flex-1 border-t border-zinc-800" />
                    </div>

                    <Link
                        href="/login"
                        onClick={onClose}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
                    >
                        <LogIn className="h-4 w-4" />
                        Entrar com e-mail
                    </Link>
                    <Link
                        href="/cadastro"
                        onClick={onClose}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-bold text-zinc-950 transition-colors hover:bg-amber-400"
                    >
                        <UserPlus className="h-4 w-4" />
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
