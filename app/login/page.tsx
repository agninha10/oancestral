import type { Metadata } from 'next';
import Link from 'next/link';
import { Swords } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
    title: 'Entrar — A Porta da Forja | O Ancestral',
    description: 'Acesse a plataforma O Ancestral com e-mail, senha ou conta Google.',
};

export default async function LoginPage(props: {
    searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
    const searchParams = await props.searchParams;
    const callbackUrl  = searchParams?.callbackUrl ?? '/dashboard';
    const error        = searchParams?.error;

    // Map NextAuth OAuth error codes to human-readable messages
    const initialError = error === 'OAuthAccountNotLinked'
        ? 'Esse e-mail já está associado a outro provedor. Use o mesmo método que usou da primeira vez.'
        : error === 'CredentialsSignin'
        ? 'E-mail ou senha incorretos.'
        : error
        ? 'Algo deu errado. Tente novamente.'
        : undefined;

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
                        Acesse a Forja
                    </h1>
                    <p className="mt-1.5 text-sm text-zinc-500">
                        Entre para continuar sua jornada de alta performance.
                    </p>
                </div>

                <LoginForm
                    callbackUrl={callbackUrl}
                    initialError={initialError}
                    hasApple={!!process.env.APPLE_ID}
                />

                {/* Legal */}
                <p className="mt-6 text-center text-[11px] leading-relaxed text-zinc-700">
                    Ao entrar, você concorda com os nossos{' '}
                    <Link href="/termos-de-servico" className="underline underline-offset-2 hover:text-zinc-500">
                        Termos de Uso
                    </Link>{' '}
                    e{' '}
                    <Link href="/politica-de-privacidade" className="underline underline-offset-2 hover:text-zinc-500">
                        Política de Privacidade
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
