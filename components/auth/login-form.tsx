'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { googleSignIn, appleSignIn } from '@/app/actions/social';
import { cn } from '@/lib/utils';

// ─── Icons ────────────────────────────────────────────────────────────────────

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

function AppleIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
        </svg>
    );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface LoginFormProps {
    callbackUrl: string;
    initialError?: string;
    hasApple: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LoginForm({ callbackUrl, initialError, hasApple }: LoginFormProps) {
    const router = useRouter();

    const [email,     setEmail]     = useState('');
    const [password,  setPassword]  = useState('');
    const [showPass,  setShowPass]  = useState(false);
    const [error,     setError]     = useState(initialError ?? '');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Preencha o e-mail e a senha.');
            return;
        }

        startTransition(async () => {
            const result = await signIn('credentials', {
                email:    email.trim().toLowerCase(),
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('E-mail ou senha incorretos.');
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        });
    };

    return (
        <div className="space-y-5">

            {/* ── Credentials form ─────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {error && (
                    <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3">
                        <p className="text-sm font-medium text-red-400">{error}</p>
                    </div>
                )}

                <div className="space-y-1.5">
                    <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        E-mail
                    </label>
                    <input
                        id="login-email"
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

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Senha
                        </label>
                        <Link
                            href="/auth/reset-password"
                            className="text-xs text-zinc-500 hover:text-amber-400 transition-colors"
                            tabIndex={-1}
                        >
                            Esqueceu a senha?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            id="login-password"
                            type={showPass ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                            tabIndex={-1}
                            aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                            Entrando…
                        </span>
                    ) : (
                        'Entrar'
                    )}
                </button>
            </form>

            {/* ── Divider ──────────────────────────────────────────────────── */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-950 px-3 text-zinc-600 tracking-widest">
                        Ou continue com
                    </span>
                </div>
            </div>

            {/* ── Social buttons ───────────────────────────────────────────── */}
            <div className="space-y-3">
                <form action={googleSignIn}>
                    <input type="hidden" name="callbackUrl" value={callbackUrl} />
                    <button
                        type="submit"
                        className={cn(
                            'flex w-full items-center justify-center gap-3',
                            'rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-3.5',
                            'text-sm font-semibold text-zinc-200',
                            'transition-all duration-200',
                            'hover:border-zinc-600 hover:bg-zinc-800 hover:text-white',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                        )}
                    >
                        <GoogleIcon className="h-4 w-4 shrink-0" />
                        <span>Continuar com o Google</span>
                    </button>
                </form>

                {hasApple && (
                    <form action={appleSignIn}>
                        <input type="hidden" name="callbackUrl" value={callbackUrl} />
                        <button
                            type="submit"
                            className={cn(
                                'flex w-full items-center justify-center gap-3',
                                'rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-3.5',
                                'text-sm font-semibold text-zinc-200',
                                'transition-all duration-200',
                                'hover:border-zinc-600 hover:bg-zinc-800 hover:text-white',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                            )}
                        >
                            <AppleIcon className="h-4 w-4 shrink-0" />
                            <span>Continuar com a Apple</span>
                        </button>
                    </form>
                )}
            </div>

            {/* ── Footer link ──────────────────────────────────────────────── */}
            <p className="text-center text-sm text-zinc-600">
                Não tem conta?{' '}
                <Link
                    href={`/cadastro${callbackUrl !== '/dashboard' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                    className="font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                    Cadastre-se
                </Link>
            </p>
        </div>
    );
}
