'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PasswordResetForm() {
    const [email,     setEmail]     = useState('');
    const [error,     setError]     = useState('');
    const [success,   setSuccess]   = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Informe seu e-mail.');
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch('/api/auth/forgot-password', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ email: email.trim() }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    setError(data.error ?? 'Erro ao enviar e-mail. Tente novamente.');
                    return;
                }

                setSuccess(true);
            } catch {
                setError('Erro de conexão. Tente novamente.');
            }
        });
    };

    if (success) {
        return (
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
                        <CheckCircle2 className="h-8 w-8 text-amber-400" />
                    </div>
                </div>
                <div>
                    <p className="text-base font-semibold text-zinc-100">E-mail enviado!</p>
                    <p className="mt-1.5 text-sm text-zinc-500">
                        Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                        O link expira em 24 horas.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="block text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                    Voltar para o login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {error && (
                <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3">
                    <p className="text-sm font-medium text-red-400">{error}</p>
                </div>
            )}

            <div className="space-y-1.5">
                <label htmlFor="reset-email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    E-mail
                </label>
                <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className={cn(
                        'w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3',
                        'text-sm text-zinc-100 placeholder:text-zinc-600',
                        'outline-none transition-colors',
                        'focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30',
                    )}
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className={cn(
                    'w-full rounded-xl px-6 py-3.5',
                    'bg-amber-500 font-bold text-zinc-950',
                    'transition-all duration-200',
                    'hover:bg-amber-400 active:scale-[0.99]',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                )}
            >
                {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                    </span>
                ) : (
                    'Enviar link de recuperação'
                )}
            </button>

            <p className="text-center text-sm text-zinc-600">
                Lembrou a senha?{' '}
                <Link href="/login" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                    Fazer login
                </Link>
            </p>
        </form>
    );
}
