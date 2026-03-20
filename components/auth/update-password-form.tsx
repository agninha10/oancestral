'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpdatePasswordFormProps {
    token: string;
}

export function UpdatePasswordForm({ token }: UpdatePasswordFormProps) {
    const router = useRouter();

    const [password,        setPassword]        = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass,        setShowPass]        = useState(false);
    const [showConfirm,     setShowConfirm]     = useState(false);
    const [error,           setError]           = useState('');
    const [success,         setSuccess]         = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch('/api/auth/update-password', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ token, password }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    setError(data.error ?? 'Erro ao atualizar senha. Tente novamente.');
                    return;
                }

                setSuccess(true);
                setTimeout(() => router.push('/login'), 2500);
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
                    <p className="text-base font-semibold text-zinc-100">Senha redefinida!</p>
                    <p className="mt-1.5 text-sm text-zinc-500">
                        Você será redirecionado para o login em instantes.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="block text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                    Ir para o login agora
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

            {/* Nova senha */}
            <div className="space-y-1.5">
                <label htmlFor="new-password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Nova senha
                </label>
                <div className="relative">
                    <input
                        id="new-password"
                        type={showPass ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className={cn(
                            'w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 pr-11',
                            'text-sm text-zinc-100 placeholder:text-zinc-600',
                            'outline-none transition-colors',
                            'focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30',
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        tabIndex={-1}
                        aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {password.length > 0 && password.length < 8 && (
                    <p className="text-xs text-zinc-600">
                        {8 - password.length} caractere{8 - password.length !== 1 ? 's' : ''} restante{8 - password.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Confirmar senha */}
            <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Confirmar senha
                </label>
                <div className="relative">
                    <input
                        id="confirm-password"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a senha"
                        className={cn(
                            'w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 pr-11',
                            'text-sm text-zinc-100 placeholder:text-zinc-600',
                            'outline-none transition-colors',
                            'focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30',
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        tabIndex={-1}
                        aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
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
                        Salvando...
                    </span>
                ) : (
                    'Salvar nova senha'
                )}
            </button>

            <p className="text-center text-sm text-zinc-600">
                <Link href="/login" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                    Voltar para o login
                </Link>
            </p>
        </form>
    );
}
