'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Swords, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeaserContentProps {
    content: string;
}

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

export function TeaserContent({ content }: TeaserContentProps) {
    const pathname = usePathname();

    // Show 30% of content, minimum 300 chars
    const teaserLength = Math.max(300, Math.floor(content.length * 0.30));
    const teaser = content.slice(0, teaserLength).trimEnd();

    const handleGoogleSignIn = () =>
        signIn('google', { callbackUrl: pathname });

    return (
        <div>
            {/* Teaser text with gradient fade-out */}
            <div className="relative">
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {teaser}
                </p>
                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-transparent pointer-events-none" />
            </div>

            {/* Auth Wall Card */}
            <div className="relative -mt-2 rounded-2xl border border-amber-500/25 bg-zinc-950 shadow-2xl shadow-amber-500/5 overflow-hidden">
                {/* Top amber line accent */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                <div className="px-5 py-6 sm:px-7 sm:py-7 space-y-5">
                    {/* Icon + copy */}
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
                            <Swords className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="font-serif text-lg font-bold text-zinc-100">
                                Junte-se à Forja
                            </p>
                            <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
                                Leia o relato completo e debata com a comunidade de alta performance.
                            </p>
                        </div>
                    </div>

                    {/* Social proof */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-600">
                        <Users className="h-3 w-3" />
                        <span>Acesso gratuito · Apenas um clique</span>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-2.5">
                        {/* Primary: Google */}
                        <button
                            onClick={handleGoogleSignIn}
                            className={cn(
                                'flex w-full items-center justify-center gap-3',
                                'rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3.5',
                                'text-sm font-semibold text-zinc-100',
                                'transition-all duration-150',
                                'hover:border-zinc-500 hover:bg-zinc-800',
                                'active:scale-[0.98]',
                            )}
                        >
                            <GoogleIcon />
                            Continuar com o Google
                        </button>

                        {/* Secondary: Criar conta + Login */}
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href={`/cadastro?callbackUrl=${encodeURIComponent(pathname)}`}
                                className={cn(
                                    'rounded-xl bg-amber-500 px-4 py-3',
                                    'text-center text-sm font-bold text-zinc-950',
                                    'transition-colors hover:bg-amber-400 active:scale-[0.98]',
                                )}
                            >
                                Criar conta grátis
                            </Link>
                            <Link
                                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                                className={cn(
                                    'rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3',
                                    'text-center text-sm font-semibold text-zinc-500',
                                    'transition-colors hover:border-zinc-600 hover:text-zinc-300 active:scale-[0.98]',
                                )}
                            >
                                Já tenho conta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
