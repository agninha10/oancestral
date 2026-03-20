import type { Metadata } from 'next';
import Link from 'next/link';
import { Swords } from 'lucide-react';
import { PasswordResetForm } from '@/components/auth/password-reset-form';

export const metadata: Metadata = {
    title: 'Recuperar Senha | O Ancestral',
    description: 'Redefina sua senha no O Ancestral.',
};

export default function ResetPasswordPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12">

            {/* Ambient glow */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/6 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-zinc-800/30 blur-3xl" />
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
                        Recuperar senha
                    </h1>
                    <p className="mt-1.5 text-sm text-zinc-500">
                        Digite seu e-mail e enviaremos um link de redefinição.
                    </p>
                </div>

                <PasswordResetForm />
            </div>
        </div>
    );
}
