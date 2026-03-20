import type { Metadata } from 'next';
import Link from 'next/link';
import { Swords, AlertCircle } from 'lucide-react';
import { UpdatePasswordForm } from '@/components/auth/update-password-form';

export const metadata: Metadata = {
    title: 'Nova Senha | O Ancestral',
    description: 'Defina sua nova senha no O Ancestral.',
};

interface UpdatePasswordPageProps {
    searchParams: Promise<{ token?: string }>;
}

export default async function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
    const { token } = await searchParams;

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12">

            {/* Ambient glow */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/6 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-zinc-800/30 blur-3xl" />
            </div>

            <div className="w-full max-w-sm">

                {/* Brand */}
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                            <Swords className="h-7 w-7 text-amber-400" />
                        </div>
                        <span className="font-serif text-2xl font-bold tracking-tight text-amber-400">
                            O Ancestral
                        </span>
                    </Link>

                    <h1 className="mt-4 text-xl font-bold text-zinc-50">
                        {token ? 'Criar nova senha' : 'Link inválido'}
                    </h1>
                    {token && (
                        <p className="mt-1.5 text-sm text-zinc-500">
                            Escolha uma senha forte para proteger sua conta.
                        </p>
                    )}
                </div>

                {token ? (
                    <UpdatePasswordForm token={token} />
                ) : (
                    <div className="space-y-5">
                        <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-4">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-red-400">Link inválido ou expirado</p>
                                    <p className="mt-1 text-sm text-red-400/70">
                                        O link para redefinir sua senha expirou ou já foi utilizado.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/auth/reset-password"
                            className="block w-full rounded-xl bg-amber-500 px-6 py-3.5 text-center font-bold text-zinc-950 transition-all hover:bg-amber-400"
                        >
                            Solicitar novo link
                        </Link>
                        <p className="text-center text-sm text-zinc-600">
                            <Link href="/login" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                                Voltar para o login
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
